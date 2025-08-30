---
title: "CKA 실전 풀이 프로토콜"
date: "2025-08-30"
excerpt: "실제 CKA와 유사한 흐름으로 문제를 푸는 7단계 방법론과 명령 스니펫을 정리했습니다."
category: "CKA"
tags: ["Kubernetes","CKA","Study-Method","Exam-Strategy"]
image: ""

---

본 문서는 매 라운드에서 **똑같이 반복**할 실전형 풀이 루틴입니다. 짧은 지시문으로 제시되는 CKA 문제를 빠르게 해석하고, 최소 타이핑으로 정확히 해결하는 데 초점을 둡니다.

## 0) 세팅 (≈30초)

- 별칭: `alias k=kubectl`
- 네임스페이스 고정(문제에 명시 시): `k config set-context --current --namespace=<ns>`
- 드라이런 단축: `DO='--dry-run=client -o yaml'`  
- 편의: `export LC_ALL=C` (이벤트 정렬 안정), `EDITOR=vim` 또는 선호 편집기

## 1) 문제 파싱 (≈30초) — R·V·C 규칙

- **Resource**: Pod / Deployment / Service / ConfigMap / Secret / PV,PVC / Role,RoleBinding / NetworkPolicy …
- **Verb**: 생성(create) / 수정(patch, edit) / 롤아웃(rollout) / 디버깅(troubleshoot)
- **Constraints**: 포트·라벨·셀렉터·Probe·리소스·스토리지·RBAC·스케줄링·네트워크 제한 등  
  → 종이에 *R·V·C* 3줄로만 요약(30초 제한).

## 2) 스켈레톤 뽑기 (2~3분) — imperative → YAML

가능하면 명령형으로 **YAML 스켈레톤**을 먼저 만든 뒤 보정합니다.

```bash
k create deploy web --image=nginx:1.25-alpine {DO} > d.yaml
k expose deploy web --port=80 --target-port=8080 {DO} > svc.yaml
k create configmap app-cm --from-literal=KEY=VAL {DO} > cm.yaml
k create role view-pods --verb=get,list,watch --resource=pods {DO} > role.yaml
```

필드 참고: `k explain <Kind> --recursive | less`

## 3) 요구사항 주입 (2분) — 단어 ↔ 필드 매핑

- “헬스체크” → `liveness/readiness/startupProbe`
- “내부 통신만” → `Service.type: ClusterIP`
- “지속 저장” → `PVC(+StorageClass)`
- “특정 네임스페이스만 접근” → `NetworkPolicy.ingress`, `namespaceSelector`
- “권한 부여” → `Role/RoleBinding + ServiceAccount`
- “노드 제한/허용” → `nodeSelector / tolerations / affinity`
- 리소스: `resources.requests/limits` (단위: `m`/`Mi`).

## 4) 적용 & 즉시 검증 (2분)

```bash
k apply -f .
k get all -o wide
k describe <kind>/<name>
k get events --sort-by=.lastTimestamp | tail
k get endpoints <svc>
# 앱 확인
k port-forward <pod> 8080:8080 &
curl -sS http://localhost:8080/healthz
```

**원칙**: “적용 후 30초 안에 이상 징후 감지” → 바로 5)로 이동.

## 5) 빠른 트러블슈팅 (2분)

**Pending**  

- 노드 셀렉터/테인트, 리소스 부족, PVC 바인딩, 이미지 풀 시크릿, 스케줄러 이벤트  
  `k describe pod … | sed -n '/Events/,$p'`

**CrashLoopBackOff**  

- 초기 지연 부족, 커맨드/엔트리포인트 오류, 권한/경로  
  `k logs -p <pod>`, `k describe pod <pod>`

**Service 연결 불가**  

- Endpoints 없음(라벨-셀렉터 오타), `targetPort` 불일치, 앱이 실제 리슨X, NetPol 차단  
  `k get endpoints <svc>`, `k exec <pod> -- ss -lnt`

**RBAC 거부**  

- SA/Role/RoleBinding 연결 확인, 리소스/verb 오타  
  `k auth can-i get pods --as=system:serviceaccount:<ns>:<sa>`



## 6) 리캡 & 정리 (1분)

- 오늘 실수 1개와 원인, **회피 체크리스트 1줄**로 기록.
- 블로그 정리는 고정 순서로 기록:  
  **실전 CKA 문제 → 답변 → 채점 & 피드백 → 모범답안(YAML+해설) → 자주 하는 실수 & 회피법 → 실전 팁 → 개념 정리(공식 문서 링크, 개념당 한 줄) → 마무리 체크**

---

### 포켓 스니펫

```bash
alias k=kubectl; DO='--dry-run=client -o yaml'
k create deploy web --image=nginx:1.25-alpine $DO > d.yaml
k expose deploy web --port=80 --target-port=8080 $DO > svc.yaml
k get events --sort-by=.lastTimestamp | tail
k get endpoints web-svc
```

### 개념 링크(복습용)

- Probes — liveness/readiness/startup: https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/
- Service — selector↔라벨→Endpoints: https://kubernetes.io/docs/concepts/services-networking/service/
- Requests/Limits — 스케줄링·cgroup 제한: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
- Labels/Selectors — 매칭 핵심: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/