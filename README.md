# Turborepo 스타터

공식 Turborepo 스타터 저장소입니다.

## 이 예제를 사용하는 방법

다음 명령어를 실행하세요.

```sh
npx create-turbo@latest
```

## 무엇이 포함되어 있나요?

이 Turborepo에는 다음 패키지/앱이 포함되어 있습니다.

### 앱과 패키지

- `docs`: [Next.js](https://nextjs.org/) 앱
- `web`: 또 다른 [Next.js](https://nextjs.org/) 앱
- `@repo/ui`: `web`과 `docs`에서 함께 사용하는 React 컴포넌트 라이브러리(스텁)
- `@repo/eslint-config`: `eslint` 설정(`eslint-config-next`, `eslint-config-prettier` 포함)
- `@repo/typescript-config`: 모노레포 전반에서 사용하는 `tsconfig.json`

각 패키지/앱은 100% [TypeScript](https://www.typescriptlang.org/)로 작성되어 있습니다.

### 유틸리티

이 Turborepo에는 다음 도구들이 기본으로 설정되어 있습니다.

- 정적 타입 검사를 위한 [TypeScript](https://www.typescriptlang.org/)
- 코드 린트를 위한 [ESLint](https://eslint.org/)
- 코드 포맷팅을 위한 [Prettier](https://prettier.io)

### 빌드

모든 앱과 패키지를 빌드하려면 다음 명령어를 실행하세요.

```
cd my-turborepo
pnpm build
```

### 개발

모든 앱과 패키지를 개발 모드로 실행하려면 다음 명령어를 실행하세요.

```
cd my-turborepo
pnpm dev
```

### 원격 캐시(Remote Caching)

Turborepo는 [원격 캐시(Remote Caching)](https://turbo.build/repo/docs/core-concepts/remote-caching)라는 기법을 사용해 머신 간 캐시 아티팩트를 공유할 수 있습니다. 이를 통해 팀 및 CI/CD 파이프라인과 빌드 캐시를 공유할 수 있습니다.

기본적으로 Turborepo는 로컬 캐시를 사용합니다. 원격 캐시를 사용하려면 Vercel 계정이 필요합니다. 계정이 없다면 [여기서 생성](https://vercel.com/signup)한 뒤, 다음 명령어를 실행하세요.

```
cd my-turborepo
npx turbo login
```

이 명령은 Turborepo CLI를 [Vercel 계정](https://vercel.com/docs/concepts/personal-accounts/overview)과 인증합니다.

다음으로, Turborepo 루트에서 아래 명령어를 실행해 원격 캐시와 연결할 수 있습니다.

```
npx turbo link
```

## 유용한 링크

Turborepo에 대해 더 알아보세요.

- [작업(Tasks)](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [캐싱(Caching)](https://turbo.build/repo/docs/core-concepts/caching)
- [원격 캐시(Remote Caching)](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [필터링(Filtering)](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [설정 옵션(Configuration Options)](https://turbo.build/repo/docs/reference/configuration)
- [CLI 사용법(CLI Usage)](https://turbo.build/repo/docs/reference/command-line-reference)
