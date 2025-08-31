---
title: "CKA 연습 02 추가 — Taints·Tolerations·nodeSelector 이해"
date: "2025-08-31"
excerpt: "테인트/톨러레이션과 nodeSelector의 역할 차이를 명확히 구분하고, 언제 무엇을 함께 사용해야 하는지 실전 예제로 학습합니다."
category: "CKA"
tags: ["Kubernetes","CKA","Scheduling","Taints","Tolerations","Labels","nodeSelector"]
image: ""
---

# 1) 실전 CKA 문제
- 노드에 `dedicated=ml:NoSchedule` 테인트가 있음.
- 왜 **tolerations 없이**는 그 노드로 스케줄이 안 되는가?  
- 그 노드로 **확실히** 가게 하려면 Pod에 어떤 스펙이 필요할까?

# 2) 답변 (수험생 자연어)
> tolerations은 테인트가 걸린 노드에 파드를 스케쥴링하기 위해 지정해주는 것, nodeSelector는 특정 노드에 스케쥴링 되게 해주는 것.

# 3) 채점 & 피드백
- **정확성**: 테인트가 있으면 **tolerations**로 허용이 필요함을 이해하고 있음
- **보완점**: 
  - nodeSelector는 "**라벨이 붙은 노드 집합**"을 선택함(반드시 한 노드란 뜻은 아님)
  - 정말 한 노드로 보내려면 **고유 라벨을 그 노드에만** 달거나 `nodeAffinity`/`nodeName` 사용 필요
- **합격선 판단**: *Pass(개념 이해 충분)*
- **개선 포인트(우선순위)**:
  1. **tolerations와 nodeSelector의 역할 구분** 명확화
  2. **단일 노드 강제 배치** 방법론 추가 학습
  3. **nodeAffinity 대안** 숙지

# 4) 모범답안 (YAML + 해설)
```yaml
apiVersion: apps/v1
kind: Deployment
metadata: {name: demo}
spec:
  replicas: 2
  selector: {matchLabels: {app: demo}}
  template:
    metadata: {labels: {app: demo}}
    spec:
      nodeSelector:
        env: prod      # 라벨이 env=prod인 노드 집합을 선택
      tolerations:
      - key: "dedicated"
        operator: "Equal"
        value: "ml"
        effect: "NoSchedule"   # 테인트 허용(입장권), 강제는 아님
      containers:
      - name: app
        image: nginx:1.25-alpine
```
**해설**
- `tolerations`: **테인트를 허용**(그 노드에 들어갈 자격). 없으면 `NoSchedule` 때문에 거부됨
- `nodeSelector`: **어디로 갈지 선택**(라벨 기반). 강제하려면 **라벨을 유일**하게 하거나 `nodeAffinity`/`nodeName` 사용
- **핵심**: tolerations는 "입장권", nodeSelector는 "목적지 선택"의 역할

**검증**
```bash
# YAML 적용
kubectl apply -f taints-selector-demo.yaml

# 파드가 의도한 노드에 배치되었는지 확인
kubectl get pod -o wide

# 노드 라벨과 테인트 확인
kubectl get nodes --show-labels
kubectl describe node <노드명> | grep -A5 Taints
```

# 5) 자주 하는 실수 & 회피법
- **톨러레이션 누락**: 테인트 노드에 배치 시도 시 `Pending` 상태
  - **회피법**: Pod spec에 tolerations 정확히 추가
  - **즉시 확인**: `kubectl describe pod`에서 Events 섹션 확인
- **선택 조건 없음**: tolerations만 있으면 다른 노드로도 갈 수 있음
  - **회피법**: nodeSelector/nodeAffinity 함께 사용
  - **즉시 확인**: `kubectl get pod -o wide`에서 NODE 컬럼 확인
- **라벨 오타/중복**: 의도치 않은 분산 배치
  - **회피법**: `kubectl get nodes --show-labels`로 사전 검증

# 6) 실전 팁
- **배치 확인 우선순위**: `kubectl get pod -o wide`의 NODE 컬럼부터 확인
- **스켈레톤 활용**: `kubectl run --dry-run=client -o yaml`로 기본 틀 생성 후 수정
- **강제 배치**: 유일 라벨이 어렵다면 `nodeAffinity`(requiredDuringScheduling) 사용
- **디버깅**: `kubectl describe pod`의 Events로 스케줄링 실패 원인 파악

# 7) 개념 정리 (공식 링크 + 한 줄)
- **Taints & Tolerations** — 노드는 "제한", 파드는 "허용"; 매칭되어야 스케줄 가능.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/
- **Assigning Pods to Nodes** — 라벨/어피니티로 배치 위치를 선택하고 강제.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/
- **Node Affinity** — nodeSelector보다 강력한 노드 선택 조건 설정.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity
- **Pod Scheduling** — 스케줄러의 전체적인 파드 배치 결정 과정.  
  https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/

# 8) 마무리 체크
- **tolerations**와 **nodeSelector**의 역할 차이를 한 문장으로 설명해보자.
- 테인트가 있는 노드에 파드를 **확실히** 배치하려면 어떤 조합이 필요한가?
- nodeSelector 대신 nodeAffinity를 사용하는 경우는 언제인가?
- 파드가 `Pending` 상태일 때 어떤 명령어로 원인을 파악할 수 있는가?
