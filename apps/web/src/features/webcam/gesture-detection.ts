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

let currentTarget: HTMLElement | null = null;
// 캔버스 초기화 변수
let hasInitialized = false;
let hasInitializedResult = false;

function initCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

export function detectGesture(
  gestureResults: GestureResults | null,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) {
  if (!gestureResults || !canvasRef?.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext('2d');

  if (!ctx) return;

  // result 페이지에서 한 번 더 캔버스 초기화
  if (!hasInitialized && window.location.pathname !== '/result') {
    initCanvas(canvas);
    hasInitialized = true;
  }

  if (!hasInitializedResult && window.location.pathname === '/result') {
    initCanvas(canvas);
    hasInitializedResult = true;
  }

  // 매 프레임 렌더링용 clearRect만 실행
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 캔버스 거울 모드
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  gestureResults.landmarks.forEach((hand, index) => {
    const handType = gestureResults.handedness[index]?.[0]?.displayName;

    // 손 랜드마크 시각화
    hand.forEach((point, index) => {
      // NaN 값이 있을 경우 해당 값을 건너뛰기
      if (Number.isNaN(point.x) || Number.isNaN(point.y)) {
        return;
      }

      if (index === 8 && handType === 'Right') {
        const cursorX = (1 - point.x) * canvas.width;
        const cursorY = point.y * canvas.height;

        // 커서 위치를 손끝 위치로 이동
        moveCursorTo(cursorX, cursorY);
        handleCursorFocus(cursorX, cursorY);
      }
    });
  });
  // Game 페이지일 때 커서 제거
  if (window.location.pathname === '/game') {
    removeFakeCursor(); // Game 페이지로 이동시 커서 제거
  }
}

// 커서가 클릭 가능한 요소 위에 1초 동안 있을 경우 포커스
function handleCursorFocus(_x: number, _y: number) {
  const cursorElement = document.querySelector('.fake-cursor');
  if (!cursorElement) createFakeCursor();

  const cursorRect = cursorElement?.getBoundingClientRect();
  if (!cursorRect) return;

  const elementsAtCursor = document.elementsFromPoint(
    cursorRect.left + cursorRect.width / 2,
    cursorRect.top + cursorRect.height / 2,
  );

  const clickableElement = elementsAtCursor.find(
    (el) =>
      el instanceof HTMLElement &&
      (el.tagName === 'BUTTON' || el.tagName === 'A'),
  ) as HTMLElement | undefined;

  let focusTimer: NodeJS.Timeout | null = null;
  let clickTimer: NodeJS.Timeout | null = null;

  if (
    (clickableElement !== currentTarget || !clickableElement) &&
    currentTarget
  ) {
    if (focusTimer) {
      clearTimeout(focusTimer);
    }
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    cancelPlayingAnimation(currentTarget);
    currentTarget = null;
  }

  if (clickableElement instanceof HTMLElement) {
    if (clickableElement !== currentTarget) {
      if (focusTimer) {
        clearTimeout(focusTimer);
      }
      if (clickTimer) {
        clearTimeout(clickTimer);
      }
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
            const activeElement = document.activeElement;
            const cursorElement = document.querySelector('.fake-cursor');
            if (!cursorElement) return;

            const cursorRect = cursorElement.getBoundingClientRect();
            const clickableRect = clickableElement.getBoundingClientRect();

            const isInBounds =
              cursorRect.left >= clickableRect.left &&
              cursorRect.top >= clickableRect.top &&
              cursorRect.right <= clickableRect.right &&
              cursorRect.bottom <= clickableRect.bottom;

            if (activeElement === clickableElement && isInBounds) {
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
}

// 가짜 커서 생성 함수
function createFakeCursor() {
  const cursorElement = document.createElement('div');
  cursorElement.classList.add('fake-cursor');

  document.body.appendChild(cursorElement); // 화면에 커서를 추가
}

// moveCursorTo 함수: 커서 위치 이동
function moveCursorTo(x: number, y: number) {
  const cursorElement = document.querySelector('.fake-cursor');
  if (cursorElement instanceof HTMLElement) {
    cursorElement.style.left = `${x - 25}px`;
    cursorElement.style.top = `${y - 25}px`;
  }
}

// 가짜 커서 제거 함수
function removeFakeCursor() {
  const cursorElement = document.querySelector('.fake-cursor');
  if (cursorElement instanceof HTMLElement) {
    cursorElement.classList.add('remove-fake-cursor');
  }
}

function cancelPlayingAnimation(el: HTMLElement) {
  el.classList.remove('playing');
  void el.offsetWidth; // 강제 리플로우로 브라우저 재인식
  el.classList.add('stopped');
}
