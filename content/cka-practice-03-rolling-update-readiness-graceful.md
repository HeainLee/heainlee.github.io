---
title: "CKA 연습 03 — 무중단 롤링업데이트 & Readiness & Graceful Termination"
date: "2025-08-31"
excerpt: "readiness로 트래픽 안전을 확보하고 RollingUpdate와 preStop/terminationGrace로 무중단에 가깝게 배포하는 전 과정을 정리."
category: "CKA"
tags: ["Kubernetes","CKA","Deployment","RollingUpdate","Readiness","Graceful","Practice"]
image: ""
---

# 1) 실전 CKA 문제
- 네임스페이스 `cka-03`
- Deployment `blue-api` (이미지 `nginx:1.25-alpine`, replicas=3, 컨테이너 포트 8080)
- **readinessProbe**: GET `/readyz`, `initialDelaySeconds=5`, `periodSeconds=3`, `failureThreshold=3`
- **RollingUpdate**: `maxSurge=1`, `maxUnavailable=1`
- **Graceful 종료**: `preStop: sleep 5`, `terminationGracePeriodSeconds: 10`
- ClusterIP Service `blue-svc` (80→8080)
- 그 후 이미지를 `nginx:1.27-alpine`으로 롤링 업데이트하고 **무중단** 진행 여부 확인

# 2) 답변 (수험생 자연어)
> ① 먼저 네임스페이스 `cka-03`를 만든다. ② Nginx 설정에 `listen 8080;`과 `location /readyz { return 200; }`를 추가한다. ③ **무중단 검증의 메인 신호는 `kubectl rollout status`**로 본다. 필요 시 `pods -w`, `endpoints -w`로 보조 확인한다.

# 3) 채점 & 피드백

- **정확성**: 핵심 요구사항(readiness, RollingUpdate, Graceful) 모두 언급. 무중단 배포 3요소 파악 OK.
- **보완점**
  - 실제 서비스 경로(`/`) 헬스체크 추가로 외부 모니터링 지원 강화 필요.
  - 롤아웃 검증 명령어(`rollout status`, `endpoints -w`) 다양한 옵션 활용 부족.
  - `preStop`과 `terminationGracePeriodSeconds`의 시너지 효과에 대한 구체적 설명 부족.
- **합격선 판단**: *Pass(무중단 배포 핵심 이해)*
- **개선 포인트(우선순위)**
  1. **실제 트래픽 검증** 방법 구체화(`watch curl`, 에러율 모니터링)
  2. **롤백 시나리오** 준비(`rollout undo`, 이미지 태그 관리)
  3. **모니터링 지표** 활용법(Ready 상태, Endpoints 변화)

# 4) 모범답안 (YAML + 해설)
```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cka-03
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blue-api
  namespace: cka-03
  labels:
    app: blue-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
  selector:
    matchLabels:
      app: blue-api
  template:
    metadata:
      labels:
        app: blue-api
    spec:
      terminationGracePeriodSeconds: 10
      containers:
      - name: nginx
        image: nginx:1.25-alpine
        ports:
        - containerPort: 8080
        lifecycle:
          preStop:
            exec:
              command: ["/bin/sh","-c","sleep 5"]
        readinessProbe:
          httpGet:
            path: /readyz
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 3
          failureThreshold: 3
        command: ["/bin/sh","-c"]
        args:
          - |
            cat >/etc/nginx/conf.d/blue.conf <<'EOF'
            server {
              listen 8080;
              location /readyz { return 200; }
              location / { return 200 "blue-api"; add_header Content-Type text/plain; }
            }
            EOF
            exec nginx -g 'daemon off;'
---
apiVersion: v1
kind: Service
metadata:
  name: blue-svc
  namespace: cka-03
spec:
  selector:
    app: blue-api
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  type: ClusterIP
```
**해설**
- **readinessProbe**: 준비된 파드만 Service 엔드포인트에 등록 → 롤링 중 트래픽 공백 최소화.
- **RollingUpdate**: `maxSurge=1`(임시 +1), `maxUnavailable=1`(동시 -1)로 가용성을 유지.
- **Graceful**: `preStop`(드레이닝) + `terminationGrace`(정상 종료猶予) 조합.
- **Nginx 설정**: `/readyz`는 항상 200, 8080 리슨을 명시.

**검증**
```bash
# 초기 적용
kubectl apply -f cka-03-solution.yaml

# 메인 신호(선택: rollout status)
kubectl -n cka-03 set image deploy/blue-api nginx=nginx:1.27-alpine --record
kubectl -n cka-03 rollout status deploy/blue-api   # <- 블로킹 상태 확인

# 보조 신호
kubectl -n cka-03 get endpoints -w blue-svc        # 엔드포인트 수 유지 확인
kubectl -n cka-03 get pods -w                      # Ready 변동 관찰
kubectl -n cka-03 port-forward svc/blue-svc 18080:80 &
watch -n0.3 curl -sf http://127.0.0.1:18080/readyz
```

# 5) 자주 하는 실수 & 회피법

- **/readyz 404** → nginx conf에 `location /readyz { return 200; }` 추가. *배포 전 `curl` 점검*.
- **포트 미스매치** → `listen 8080;` ↔ `containerPort: 8080` ↔ `targetPort: 8080` 일치. *`kubectl get svc,endpoints` 확인*.
- **readinessProbe 누락** → 웹앱은 필수 설정으로 트래픽 안전 확보. *`kubectl get pods -w`로 Ready 변화 관찰*.
- **Graceful 미설정** → `preStop + terminationGrace` 조합으로 드레이닝 시간 확보. *롤아웃 중 `watch curl` 테스트*.

# 6) 실전 팁

- `rollout status`를 1차 지표로, 지연/실패 시 `endpoints -w`로 공백 탐지.
- `rollout history`로 이미지 이력 확인, 이상 시 `rollout undo`로 즉시 복원.
- `/` 경로에 단순 200 반환을 둬서 외부 체크가 쉽도록 한다.

# 7) 개념 정리 (공식 링크 + 한 줄)

- **Readiness Probe** — 준비된 파드만 엔드포인트에 등록(트래픽 안전).  
  https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- **RollingUpdate** — 파드 일부만 교체하며 가용성 유지(`maxSurge/maxUnavailable`).  
  https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#rolling-update-deployment
- **Graceful Termination** — preStop→SIGTERM→猶予→SIGKILL 순서로 정상 종료 유도.  
  https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination
- **Service/Endpoints** — Ready 파드만 서비스 대상이 된다.  
  https://kubernetes.io/docs/concepts/services-networking/service/

# 8) 마무리 체크

- `rollout status`가 성공이어도 100% 무중단이 아닐 수 있는 이유 한 줄?
- `replicas=4, maxSurge=2, maxUnavailable=1`일 때 파드 수 범위는?
- `preStop 5s`와 `terminationGrace 10s`의 역할 차이를 한 줄로?
