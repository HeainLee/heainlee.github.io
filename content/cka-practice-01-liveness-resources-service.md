---
title: "CKA 연습 01 — livenessProbe·리소스·Service"
date: "2025-08-30"
excerpt: "네임스페이스 생성부터 Pod livenessProbe, 자원 요청/제한, 내부 통신용 Service까지 실전 스타일 문제로 풀어보고, 수험생 자연어 답안을 YAML로 변환해 해설합니다."
category: "CKA"
tags: ["Kubernetes","CKA","Probes","Resources","Service","Practice"]
image: ""
---

# 문제 (실전 스타일)
- 네임스페이스 `cka-01` 생성
- Pod `web-pod` (이미지 `nginx:1.25-alpine`, 컨테이너 포트 **8080**)
- livenessProbe: HTTP GET `/healthz` @ 8080, `initialDelaySeconds: 10`, `periodSeconds: 5`, `failureThreshold: 3`
- 자원: `requests: cpu 100m / memory 128Mi`, `limits: cpu 200m / memory 256Mi`
- 라벨: `app=web`, `tier=frontend`
- 내부 통신용 ClusterIP Service `web-svc`: 80 → 8080

# 수험생 자연어 답안
> cka-01이라는 네임스페이스에 web-pod를 nginx:1.25-alpine를 이용해서 생성하고 포트는 8080 사용. livenessProbe는 /healthz 로 확인하고 initialDelaySeconds는 10초, periodSeconds은 5초, 실패시 3회까지 재시도. pod 생성에 요청하는 리소스로 cpu는 100m, memory는 128메가, 제한은 cpu 200m, memory는 256메가로 설정하고, app=web, tier=frontend라는 라벨을 붙여줘. 그리고 서비스는 내부 통신용으로 web-svc라는 이름으로 생성하도록.

# 해설
- **왜 `/healthz` 파일을 만들었나?** 기본 nginx에는 `/healthz` 라우트가 없어 404가 납니다. livenessProbe는 2xx가 아니면 실패로 판단해 컨테이너를 재시작합니다. 정적 파일을 만들어 항상 **200**을 반환하게 하여, 애플리케이션이 살아있으면 불필요한 재시작을 막습니다.
- **포트 8080**: nginx 기본 리슨 포트는 80입니다. 실전에서는 컨테이너 시작 시 `sed`로 conf를 수정해 8080을 리슨하도록 바꾸면 빠릅니다.
- **Service selector**는 Pod 라벨과 **정확히** 일치해야 엔드포인트가 생성됩니다.
- **리소스 단위**: CPU는 `m`(millicore), 메모리는 `Mi`(Mebibyte) 표기.

# 정답 YAML
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

# 검증 가이드
```bash
# 적용
kubectl apply -f cka-01-solution.yaml

# 리소스 확인
kubectl -n cka-01 get pod,svc
kubectl -n cka-01 describe pod web-pod | egrep -i 'liveness|requests|limits|Labels'

# 포트포워딩 및 헬스 확인
kubectl -n cka-01 port-forward pod/web-pod 8080:8080 &
curl -sS http://localhost:8080/healthz   # ok
```

# 자주 하는 실수 & 회피법
- `livenessProbe`와 `readinessProbe` 혼동 → liveness는 **살아있나**, readiness는 **트래픽 받을 준비 됐나**.
- Service `targetPort` 누락/오타 → Pod의 `containerPort`와 불일치 시 접근 불가.
- selector-라벨 불일치 → `kubectl get endpoints web-svc -n cka-01`로 디버깅.
- 메모리 단위 `128M` vs `128Mi` 혼용 → 시험에선 **`Mi`** 사용 습관화.
- nginx 8080 리슨 누락 → conf 수정이 안 되면 `/healthz`도 404.

# 실전 팁
- 베이스 스켈레톤은 `kubectl create ns ...` / `kubectl run ... --dry-run=client -o yaml`로 뽑아 편집 시간을 줄입니다.
- Probe는 가능하면 **HTTP 200이 보장되는 경로**를 명시하고, 초기 기동이 느린 앱이면 `initialDelaySeconds`를 충분히 줍니다.
- YAML 작업 후엔 `kubectl explain`으로 필드 유효성 체크.

# 마무리 체크(스스로 설명해보기)
- liveness가 **연속 3회 실패**하면 컨테이너는 재시작됩니다. readiness 실패는 재시작하지 않으며, **서비스 트래픽만 차단**됩니다.
