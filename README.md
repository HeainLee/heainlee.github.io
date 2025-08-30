# blog with AI

AI와 함께 성장하는 개발자를 위한 기술 블로그입니다. Next.js와 Tailwind CSS를 사용하여 만들어진 모던하고 반응형인 블로그입니다.

## 🌟 주요 특징

- **Next.js 14**: 최신 React 기반 풀스택 프레임워크
- **Tailwind CSS**: 유틸리티 우선 CSS 프레임워크로 빠른 스타일링
- **마크다운 지원**: 블로그 포스트를 마크다운으로 작성
- **반응형 디자인**: 모든 기기에서 최적화된 사용자 경험
- **타입스크립트**: 타입 안전성과 개발자 경험 향상
- **SEO 최적화**: 검색 엔진 최적화를 위한 메타데이터 지원

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
npm install
# 또는
yarn install
```

### 2. 개발 서버 시작

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

### 3. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 시작
npm start
```

## 📁 프로젝트 구조

```
tech-blog/
├── app/                    # Next.js App Router 구조
│   ├── blog/              # 블로그 관련 페이지
│   │   └── [slug]/        # 동적 포스트 페이지
│   ├── components/        # 재사용 가능한 컴포넌트
│   ├── globals.css        # 글로벌 스타일
│   ├── layout.tsx         # 루트 레이아웃
│   └── page.tsx           # 홈페이지
├── content/               # 마크다운 블로그 포스트
├── lib/                   # 유틸리티 함수
├── public/                # 정적 파일들
├── package.json           # 의존성 관리
├── next.config.js         # Next.js 설정
├── tailwind.config.js     # Tailwind CSS 설정
└── tsconfig.json          # TypeScript 설정
```

## ✍️ 블로그 포스트 작성

새로운 블로그 포스트를 작성하려면 `content/` 디렉토리에 마크다운 파일을 생성하세요.

### 포스트 예시

```markdown
---
title: "포스트 제목"
date: "2025-01-01"
excerpt: "포스트의 간단한 설명"
category: "카테고리"
tags: ["태그1", "태그2", "태그3"]
image: "이미지 URL (선택사항)"
---

# 포스트 내용

여기에 마크다운으로 포스트 내용을 작성하세요.

## 섹션 제목

내용...

\`\`\`python
# 코드 예시
print("Hello, World!")
\`\`\`
```

### 프론트매터 필드

- `title`: 포스트 제목 (필수)
- `date`: 발행 날짜 (YYYY-MM-DD 형식, 필수)
- `excerpt`: 포스트 요약 (선택사항)
- `category`: 카테고리 (선택사항)
- `tags`: 태그 배열 (선택사항)
- `image`: 대표 이미지 URL (선택사항)

## 🎨 커스터마이징

### 색상 테마 변경

`tailwind.config.js` 파일에서 색상을 수정할 수 있습니다:

```javascript
colors: {
  'blog-dark': '#1a1a1a',
  'blog-light': '#f8f9fa',
  'blog-accent': '#0066cc',  // 메인 액센트 색상
  'blog-text': '#333333',
  'blog-muted': '#6c757d',
}
```

### 레이아웃 수정

- `app/layout.tsx`: 전체 레이아웃
- `app/components/Header.tsx`: 헤더 컴포넌트
- `app/components/Footer.tsx`: 푸터 컴포넌트
- `app/components/Sidebar.tsx`: 사이드바 컴포넌트

## 🛠️ 사용된 기술

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Markdown**: gray-matter, remark, remark-html
- **Date Handling**: date-fns

## 📝 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 🤝 기여하기

이슈나 풀 리퀘스트는 언제든 환영합니다!

1. 포크하기
2. 피처 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 커밋하기 (`git commit -m 'Add some amazing feature'`)
4. 푸시하기 (`git push origin feature/amazing-feature`)
5. 풀 리퀘스트 열기

---

Made with ❤️ by Tech Blog Team
