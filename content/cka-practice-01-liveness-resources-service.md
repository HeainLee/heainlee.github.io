---
title: "CKA 연습 01 — livenessProbe·리소스·Service"
date: "2025-08-30"
excerpt: "실전 스타일 문제를 바탕으로 수험생 자연어 답안을 채점·피드백하고, 모범 YAML/해설·실수/팁·공식 링크까지 한 번에 복습합니다."
category: "CKA"
tags: ["Kubernetes","CKA","Probes","Resources","Service"]
image: ""

---

# 1) 실전 CKA 문제

- 네임스페이스 `cka-01` 생성
- Pod `web-pod` (이미지 `nginx:1.25-alpine`, 컨테이너 포트 **8080**)
- livenessProbe: HTTP GET `/healthz` @ 8080, `initialDelaySeconds: 10`, `periodSeconds: 5`, `failureThreshold: 3`
- 자원: requests `cpu 100m / memory 128Mi`, limits `cpu 200m / memory 256Mi`
- 라벨: `app=web`, `tier=frontend`
- 내부 통신용 ClusterIP Service `web-svc`: 80 → 8080

# 2) 답변 (수험생 자연어)

> cka-01이라는 네임스페이스에 web-pod를 nginx:1.25-alpine를 이용해서 생성하고 포트는 8080 사용. livenessProbe는 /healthz 로 확인하고 initialDelaySeconds는 10초, periodSeconds은 5초, 실패시 3회까지 재시도. pod 생성에 요청하는 리소스로 cpu는 100m, memory는 128메가, 제한은 cpu 200m, memory는 256메가로 설정하고, app=web, tier=fronted라는 라벨을 붙여줘. 그리고 서비스는 내부 통신용으로 web-svc라는 이름으로 생성하도록.

# 3) 채점 & 피드백

- **정확성**: 핵심 요구사항(포트, probe, 리소스, Service) 모두 언급. 실무 의도 파악 OK.
- **보완점**
  - `tier=fronted` → `tier=frontend` (라벨 오타는 Service 셀렉터와 불일치 위험).
  - nginx는 기본 80 리슨 → 8080으로 바꾸는 조치 필요(conf 수정).
  - `/healthz`는 기본 라우트가 없어 404 가능 → 정적 파일 생성 등으로 200 보장 필요.
- **합격선 판단**: *Pass(경미한 보완 필요)*
- **개선 포인트(우선순위)**
  1. **라벨/셀렉터 정합성** 확보
  2. **헬스엔드포인트 200 보장**
  3. **포트변경 반영**(nginx 8080 리슨)

# 4) 모범답안 (YAML + 해설)

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cka-01
---
apiVersion: v1
kind: Pod
metadata:
  name: web-pod
  namespace: cka-01
  labels:
    app: web
    tier: frontend
spec:
  containers:
  - name: nginx
    image: nginx:1.25-alpine
    ports:
    - containerPort: 8080
    # nginx 기본 리슨(80) → 8080으로 변경 + /healthz 파일 생성해 200 응답 보장
    command: ["/bin/sh","-c"]
    args:
      - |
        sed -i 's/listen\s\+80;/listen 8080;/' /etc/nginx/conf.d/default.conf
        echo ok > /usr/share/nginx/html/healthz
        exec nginx -g 'daemon off;'
    resources:
      requests:
        cpu: "100m"
        memory: "128Mi"
      limits:
        cpu: "200m"
        memory: "256Mi"
    livenessProbe:
      httpGet:
        path: /healthz
        port: 8080
      initialDelaySeconds: 10
      periodSeconds: 5
      failureThreshold: 3
---
apiVersion: v1
kind: Service
metadata:
  name: web-svc
  namespace: cka-01
spec:
  selector:
    app: web
    tier: frontend
  ports:
  - port: 80
    targetPort: 8080
    protocol: TCP
  type: ClusterIP
```

**해설**

- `/healthz`는 nginx 기본 라우트가 아니므로 **정적 파일 생성**으로 200을 보장해 liveness 오탐을 방지.
- 기본 80 리슨을 **8080으로 변경**하여 문제 조건 충족.
- Service의 `selector`와 Pod `labels`를 **정확히 일치**시켜 엔드포인트 생성 보장.

**검증**

```bash
kubectl apply -f cka-01-solution.yaml
kubectl -n cka-01 get pod,svc
kubectl -n cka-01 describe pod web-pod | egrep -i 'liveness|requests|limits|Labels'
kubectl -n cka-01 port-forward pod/web-pod 8080:8080
curl -sS http://localhost:8080/healthz   # ok
```

# 5) 자주 하는 실수 & 회피법

- **/healthz 404** → 정적 파일/헬스 핸들러로 200 보장. 배포 전 `curl` 미리 점검.
- **selector-라벨 불일치** → `kubectl get endpoints <svc>`로 즉시 확인.
- **리소스 단위 혼동** → CPU는 `m`, 메모리는 `Mi`. 시험에선 `Mi` 고정.
- **포트 미스매치** → Pod `containerPort` ↔ Service `targetPort` 동기화.

# 6) 실전 팁

- `kubectl run ... --dry-run=client -o yaml`로 스켈레톤을 뽑아 편집 시간을 절약.
- 초기 기동이 느린 앱은 `initialDelaySeconds`를 여유 있게.
- 동일 패턴의 probe/리소스/라벨은 개인 스니펫으로 준비.

# 7) 개념 정리 (공식 링크 + 한 줄)

- **Probes(liveness/readiness/startup)** — 생존/준비/초기화 용도와 차이.  
  https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- **Service & Endpoints** — selector와 Pod 라벨 일치 시 엔드포인트 생성.  
  https://kubernetes.io/docs/concepts/services-networking/service/
- **Requests/Limits** — 스케줄링 결정과 cgroup 제한에 직접 영향.  
  https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- **Labels/Selectors** — 리소스 매칭의 핵심 메타데이터.  
  https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

# 8) 마무리 체크

- liveness가 **연속 3회 실패**하면 어떤 동작이 일어나는가?
- readiness 실패는 어떤 영향을 주며, liveness와의 차이는?
- Service가 엔드포인트를 못 가지는 전형적 원인은?