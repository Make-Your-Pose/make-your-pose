# Make Your Pose

`Make Your Pose`는 웹캠 기반 포즈 인식으로 정답 포즈를 맞히는 인터랙티브 웹 게임입니다.

- 플레이어는 실시간으로 자신의 포즈를 따라 하며 정답을 추리합니다.
- 포즈 유사도 점수를 기반으로 라운드가 진행됩니다.
- 게임 종료 후 카테고리별 랭킹(리더보드)을 확인할 수 있습니다.

## 프로젝트 구성

이 저장소는 Turborepo 기반 모노레포입니다.

### apps/web
- 실제 게임 클라이언트(React + Vite)
- 포즈 인식(Mediapipe), 게임 상태 머신(XState), 3D 렌더링(three/react-three)
- Cloudflare Worker API를 통해 점수 저장/조회

### apps/editor
- 포즈 랜드마크 데이터 편집/생성 도구(React + Vite)
- 이미지에서 랜드마크 추출, 파일 열기/저장 기능 제공

## 주요 기능

- 홈 → 튜토리얼 → 로비 → 게임 → 결과 화면 흐름
- 카테고리 선택 기반 게임(현재 sports, yoga)
- 정답 포즈 랜드마크와 사용자 포즈 간 유사도 계산
- 점수 기록 및 카테고리별 리더보드 조회
- BGM/SFX를 포함한 몰입형 UI

## 기술 스택

- Monorepo: Turborepo, pnpm workspaces
- Frontend: React, TypeScript, Vite
- Styling: Panda CSS
- Pose/3D: MediaPipe Tasks Vision, three.js, @react-three/fiber
- State Machine: XState
- Backend(API): Cloudflare Workers + itty-router
- Database: Cloudflare D1

## 시작하기

### 1) 요구 사항
- Node.js 20+
- pnpm 9+

### 2) 의존성 설치
```bash
pnpm install
```

### 3) 전체 개발 서버 실행(모노레포)
```bash
pnpm dev
```

### 4) 앱별 실행
```bash
# 게임 웹 앱
pnpm --filter @make-your-pose/web dev

# 에디터 앱
pnpm --filter @make-your-pose/editor dev
```

## 빌드 및 검증

```bash
# 전체 빌드
pnpm build

# 모노레포 lint
pnpm lint

# 포맷 + lint 체크
pnpm format-and-lint
```

## 배포

웹 앱(`apps/web`)은 Cloudflare Worker로 배포할 수 있습니다.

```bash
pnpm --filter @make-your-pose/web deploy
```

`apps/web/wrangler.jsonc`에서 Worker/D1 설정을 확인하세요.

## API 개요

`apps/web/worker`에 랭킹 API가 구현되어 있습니다.

- `GET /api/rankings/:category` : 카테고리별 랭킹 조회
- `POST /api/rankings/:category/scores` : 점수 등록

## 디렉터리 구조

```text
make-your-pose/
├─ apps/
│  ├─ web/        # 게임 클라이언트 + Cloudflare Worker API
│  └─ editor/     # 랜드마크 편집 도구
├─ packages/
│  └─ typescript-config/
├─ turbo.json
└─ pnpm-workspace.yaml
```

## 라이선스

별도 고지 전까지 저장소 정책을 따릅니다.
