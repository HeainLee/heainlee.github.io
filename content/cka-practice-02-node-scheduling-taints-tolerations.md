---
title: "CKA 연습 02 — 노드 라벨·테인트, nodeSelector & tolerations"
date: "2025-08-30"
excerpt: "특정 노드로 워크로드를 강제 스케줄링하기 위해 라벨과 테인트를 적용하고, Deployment에 nodeSelector와 tolerations를 설정합니다."
category: "CKA"
tags: ["Kubernetes","CKA","Scheduling","Taints","Tolerations","Labels"]
image: ""
---

# 1) 실전 CKA 문제
- 네임스페이스 `cka-02` 생성
- 임의의 워커 노드 1대에 라벨 `env=prod` 추가
- 같은 노드에 테인트 `dedicated=ml:NoSchedule` 적용
- `cka-02`에 Deployment `ml-api`(이미지 `nginx:1.25-alpine`, replicas 2, 컨테이너 포트 8080) 생성
  - `nodeSelector: env=prod`
  - tolerations: key `dedicated`, value `ml`, effect `NoSchedule`
  - 요청/제한: 100m/128Mi, 200m/256Mi
- ClusterIP Service `ml-svc`(80→8080)
- 검증: 두 파드가 **선택한 노드 1대**에만 스케줄되는지 확인

# 2) 답변 (수험생 자연어)
> cka-02 네임스페이스를 생성한다. 노드 중 하나에 env=prod 라벨을 추가하고 dedicated=ml:NoSchedule 테인트를 설정한다. nginx:1.25-alpine 이미지를 사용한 ml-api 파드를 Deployment로 생성하는데 복제 갯수는 2로 하고 포트는 8080으로 설정한다. 해당 Pod가 env=prod 라벨이 붙은 노드에 생성될 수 있게 설정해주고 리소스 제한을 요청/제한 용량에 맞게 설정해준다. 서비스는 ClusterIP로 설정하고 k apply .. 적용 후 두 개의 파드가 같은 노드에 생성되어 있는지 확인한다.

# 3) 채점 & 피드백
- **핵심 포인트 커버**: 네임스페이스, 라벨/테인트, Deployment, 리소스, Service, 검증 흐름까지 **대체로 충족**.
- **보완 요청**
  - 테인트가 있는 노드에 스케줄하려면 **tolerations**를 반드시 Pod에 명시해야 함(자연어에서 암시적). 
  - nginx는 기본 80 리슨 → 컨테이너 포트를 8080으로 쓰려면 **리슨 포트 변경**(혹은 Service targetPort를 80으로 유지) 필요.
  - 한 노드에만 배치하려면 **해당 라벨을 그 노드에만** 부여했는지 확인(다수 노드에 `env=prod`가 있으면 분산됨).
- **합격선**: *Pass(경미 보완 필요)*

# 4) 모범답안 (YAML + 해설)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cka-02
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-api
  namespace: cka-02
  labels:
    app: ml-api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      nodeSelector:
        env: prod
      tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "ml"
        effect: "NoSchedule"
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 8080
        command: ["/bin/sh","-c"]
        args:
          - |
            sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf
            exec nginx -g 'daemon off;'
        resources:
          requests:
            cpu: "100m"
            memory: "128Mi"
          limits:
            cpu: "200m"
            memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: ml-svc
  namespace: cka-02
spec:
  selector:
    app: ml-api
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  type: ClusterIP

```
**노드 준비 명령(참고)**  
```bash
# 대상 노드 선택
NODE=<워커노드명>
kubectl label node ${NODE} env=prod --overwrite
kubectl taint nodes ${NODE} dedicated=ml:NoSchedule --overwrite
kubectl get nodes --show-labels | grep ${NODE}
kubectl describe node ${NODE} | sed -n '/Taints/,$p'
```
**해설**
- **nodeSelector + 테인트/톨러레이션**: 라벨로 “어디에” 스케줄할지 제한하고, 테인트/톨러레이션으로 “누가 들어올 수 있는지”를 통제합니다.
- **8080 리슨**: nginx 기본은 80 → 시작 커맨드에서 conf를 수정해 8080으로 노출하거나, Service `targetPort`를 80으로 유지하는 두 가지 방법이 있습니다.
- **단일 노드 배치**: `env=prod` 라벨이 오직 1개 노드에만 있어야 2 파드가 같은 노드로 스케줄됩니다.

**검증**
```bash
kubectl apply -f cka-02-solution.yaml
kubectl -n cka-02 get pod -o wide             # NODE 컬럼이 두 파드 모두 동일한지 확인
kubectl -n cka-02 get svc ml-svc
kubectl get endpoints -n cka-02 ml-svc
kubectl describe deploy -n cka-02 ml-api | egrep -i 'tolerations|nodeSelector'
```

# 5) 자주 하는 실수 & 회피법
- **테인트만 걸고 톨러레이션 누락** → 해당 노드에 스케줄 실패. *Pod spec에 tolerations 추가*.
- **selector/라벨 불일치** → Service Endpoints 0. *`kubectl get endpoints` 즉시 확인*.
- **컨테이너 포트/리슨 포트 혼동** → 8080 리슨 미설정 시 연결 실패. *conf 변경 또는 targetPort=80*.
- **다수 노드에 동일 라벨** → 파드가 분산. *라벨을 단일 노드에만 부여*.

# 6) 실전 팁
- 명령형→YAML: `DO='--dry-run=client -o yaml'`로 스켈레톤을 빠르게 만들고 보정.
- 배치 강제 대안: 간단히는 `nodeSelector`, 세밀제어는 `nodeAffinity/antiAffinity` 활용.
- 검증은 항상 **NODE 컬럼**과 **Endpoints 존재**부터 본다.

# 7) 개념 정리 (공식 링크 + 한 줄)
- **Taints & Tolerations** — 노드의 “제한”과 파드의 “허용” 매칭.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
- **Assigning Pods to Nodes (nodeSelector/Affinity)** — 파드의 배치 위치 제어.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/
- **Deployment** — 선언적 업데이트와 Replica 관리.  
  https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
- **Service** — 라벨/셀렉터 기반으로 Endpoints 생성.  
  https://kubernetes.io/docs/concepts/services-networking/service/
- **Resources (requests/limits)** — 스케줄링과 cgroup 제한에 영향.  
  https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- **Labels/Selectors** — 오브젝트를 묶고 찾는 핵심 메타데이터.  
  https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

# 8) 마무리 체크
- 왜 **테인트만** 있으면 파드 스케줄이 막히는가? 그리고 이를 뚫는 **필수 스펙**은 무엇인가?
- 8080로 노출하려면 **두 가지 방법** 중 어떤 걸 선택했는지 말해보자.
- 두 파드가 같은 노드에 올라가게 만든 **결정적 조건**은?
