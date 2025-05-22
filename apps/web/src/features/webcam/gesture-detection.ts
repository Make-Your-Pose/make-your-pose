type PoseLandmark = {
  x: number; // X 좌표
  y: number; // Y 좌표
  z: number; // Z 좌표 (3D 위치)
};

// 여러 랜드마크를 포함한 배열 정의
type PoseLandmarks = PoseLandmark[];

// 제스처 결과 정의
type GestureResults = {
  landmarks: PoseLandmarks[]; // 여러 손의 랜드마크
  handedness: { displayName: string }[][]; // 손의 종류 (왼손/오른손)
};

import '../../styles.css';

// 전역 변수 관리
let currentTarget: HTMLElement | null = null;
let hasInitialized = false;
let hasInitializedResult = false;
let focusTimer: NodeJS.Timeout | null = null;
let clickTimer: NodeJS.Timeout | null = null;
let cachedCursorElement: HTMLElement | null = null;
let resizeListener: (() => void) | null = null;

function initCanvas(canvas: HTMLCanvasElement) {
  // 이전 이벤트 리스너 제거
  if (resizeListener) {
    window.removeEventListener('resize', resizeListener);
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 새 리스너 추가 및 참조 저장
  resizeListener = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  window.addEventListener('resize', resizeListener);
}

export function detectGesture(
  gestureResults: GestureResults | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  if (!gestureResults || !canvasRef?.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // 현재 경로에 따라 한 번만 초기화
  const isResultPage = window.location.pathname === '/result';

  if (
    (!hasInitialized && !isResultPage) ||
    (!hasInitializedResult && isResultPage)
  ) {
    initCanvas(canvas);
    if (isResultPage) {
      hasInitializedResult = true;
    } else {
      hasInitialized = true;
    }
  }

  // 매 프레임 렌더링용 clearRect만 실행
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 캔버스 거울 모드
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  // 게임 페이지일 때는 제스처 감지를 최소화
  if (window.location.pathname === '/game') {
    removeFakeCursor();
    ctx.restore();
    return;
  }

  let rightIndexFingerPosition: { x: number; y: number } | null = null;

  // 필요한 데이터만 처리
  for (let i = 0; i < gestureResults.landmarks.length; i++) {
    const hand = gestureResults.landmarks[i];
    const handType = gestureResults.handedness[i]?.[0]?.displayName;

    // 오른손 검지 손가락(인덱스 8)만 찾기
    if (handType === 'Right') {
      const point = hand[8];
      if (!Number.isNaN(point.x) && !Number.isNaN(point.y)) {
        rightIndexFingerPosition = {
          x: (1 - point.x) * canvas.width,
          y: point.y * canvas.height,
        };
        break; // 오른손 검지를 찾았으면 더 이상 루프 불필요
      }
    }
  }

  ctx.restore();

  // 오른손 검지 위치가 있을 때만 커서 처리
  if (rightIndexFingerPosition) {
    moveCursorTo(rightIndexFingerPosition.x, rightIndexFingerPosition.y);
    handleCursorFocus(rightIndexFingerPosition.x, rightIndexFingerPosition.y);
  }
}

// 커서가 클릭 가능한 요소 위에 1초 동안 있을 경우 포커스
function handleCursorFocus(_x: number, _y: number) {
  if (!cachedCursorElement) {
    cachedCursorElement = document.querySelector('.fake-cursor');
    if (!cachedCursorElement) {
      createFakeCursor();
      cachedCursorElement = document.querySelector('.fake-cursor');
      if (!cachedCursorElement) return;
    }
  }

  const cursorRect = cachedCursorElement.getBoundingClientRect();

  // 커서 중심점 계산
  const cursorCenterX = cursorRect.left + cursorRect.width / 2;
  const cursorCenterY = cursorRect.top + cursorRect.height / 2;

  const elementsAtCursor = document.elementsFromPoint(
    cursorCenterX,
    cursorCenterY,
  );

  const clickableElement = elementsAtCursor.find(
    (el) =>
      el instanceof HTMLElement &&
      (el.tagName === 'BUTTON' || el.tagName === 'A'),
  ) as HTMLElement | undefined;

  // 현재 타겟이 변경되었거나 없어졌을 때 타이머 제거
  if (
    (clickableElement !== currentTarget || !clickableElement) &&
    currentTarget
  ) {
    clearTimers();
    cancelPlayingAnimation(currentTarget);
    currentTarget = null;
  }

  if (
    clickableElement instanceof HTMLElement &&
    clickableElement !== currentTarget
  ) {
    clearTimers();
    currentTarget = clickableElement;

    focusTimer = setTimeout(() => {
      clickableElement.focus();
      clickableElement.classList.add('animate-background');

      requestAnimationFrame(() => {
        clickableElement.classList.add('playing');
      });

      clickableElement.classList.remove('stopped');

      clickTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          if (!cachedCursorElement) return;

          const cursorRect = cachedCursorElement.getBoundingClientRect();
          const clickableRect = clickableElement.getBoundingClientRect();

          const isInBounds =
            cursorRect.left >= clickableRect.left &&
            cursorRect.top >= clickableRect.top &&
            cursorRect.right <= clickableRect.right &&
            cursorRect.bottom <= clickableRect.bottom;

          if (document.activeElement === clickableElement && isInBounds) {
            clickableElement.click();
            currentTarget = null;
          } else {
            cancelPlayingAnimation(clickableElement);
            currentTarget = null;
          }
        });
      }, 2000);
    }, 1000);
  }
}

function clearTimers() {
  if (focusTimer) {
    clearTimeout(focusTimer);
    focusTimer = null;
  }
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
  }
}

// 가짜 커서 생성 함수
function createFakeCursor() {
  const cursorElement = document.createElement('div');
  cursorElement.classList.add('fake-cursor');
  document.body.appendChild(cursorElement);
  cachedCursorElement = cursorElement;
}

// moveCursorTo 함수: 커서 위치 이동
function moveCursorTo(x: number, y: number) {
  if (!cachedCursorElement) {
    cachedCursorElement = document.querySelector('.fake-cursor');
    if (!cachedCursorElement) {
      createFakeCursor();
      return;
    }
  }

  cachedCursorElement.style.left = `${x - 25}px`;
  cachedCursorElement.style.top = `${y - 25}px`;
}

// 가짜 커서 제거 함수
function removeFakeCursor() {
  if (!cachedCursorElement) {
    cachedCursorElement = document.querySelector('.fake-cursor');
  }

  if (cachedCursorElement) {
    cachedCursorElement.classList.add('remove-fake-cursor');
  }

  clearTimers();
}

function cancelPlayingAnimation(el: HTMLElement) {
  el.classList.remove('playing');
  void el.offsetWidth; // 강제 리플로우로 브라우저 재인식
  el.classList.add('stopped');
}
