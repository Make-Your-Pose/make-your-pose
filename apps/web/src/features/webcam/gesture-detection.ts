type PoseLandmark = {
  x: number;  // X 좌표
  y: number;  // Y 좌표
  z: number;  // Z 좌표 (3D 위치)
};

// 여러 랜드마크를 포함한 배열 정의
type PoseLandmarks = PoseLandmark[]; 

// 제스처 결과 정의
type GestureResults = {
  landmarks: PoseLandmarks[];  // 여러 손의 랜드마크
  handedness: { displayName: string }[][];  // 손의 종류 (왼손/오른손)
};

import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import '../../styles.css';

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

// 제스처 인식
export const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
  },
  runningMode: "VIDEO",
  numHands: 2,
  minHandDetectionConfidence: 0.5,
  minHandPresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  cannedGesturesClassifierOptions: {
    displayNamesLocale: "en",
    maxResults: -1,
    scoreThreshold: 0.0,
    categoryAllowlist: ["Pointing_Up", "Thumb_Up", "Victory", "Open_Palm"],
    categoryDenylist: [],
  },
  customGesturesClassifierOptions: {
    displayNamesLocale: "en",
    maxResults: -1,
    scoreThreshold: 0.0,
    categoryAllowlist: [],
    categoryDenylist: [],
  },
});

let focusTimer: ReturnType<typeof setTimeout> | null = null;
let clickTimer: ReturnType<typeof setTimeout> | null = null;

export function detectGesture(gestureResults: GestureResults | null, canvasRef: React.RefObject<HTMLCanvasElement>) {
  if (!gestureResults || !canvasRef?.current) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  // 캔버스 초기화
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // 캔버스 거울 모드
  ctx.save();
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);

  gestureResults.landmarks.forEach((hand: PoseLandmarks, index: number) => {
    const handType = gestureResults.handedness[index]?.[0]?.displayName;

    // 손 랜드마크 시각화
    hand.forEach((point: any, index: number) => {
      // NaN 값이 있을 경우 해당 값을 건너뛰기
      if (isNaN(point.x) || isNaN(point.y)) {
        return;
      }

      if (index === 8 && handType === "Right") {
        const cursorX = (1 - point.x) * canvas.width;
        const cursorY = point.y * canvas.height;

        // 커서 위치를 손끝 위치로 이동
        moveCursorTo(cursorX, cursorY);
        handleCursorFocus(cursorX, cursorY);
      }
    });
  });
}

// 커서가 클릭 가능한 요소 위에 1초 동안 있을 경우 포커스
function handleCursorFocus() {
  const cursorElement = document.querySelector(".fake-cursor");

  if (!cursorElement) {
    createFakeCursor();
  }

  const cursorRect = cursorElement ? cursorElement.getBoundingClientRect() : null;

  if (cursorRect) {
    // 커서 위치 아래에 있는 요소들을 찾아 클릭 가능한 요소를 식별
    const elementsAtCursor = document.elementsFromPoint(
      cursorRect.left + cursorRect.width / 2,
      cursorRect.top + cursorRect.height / 2
    );

    // 클릭 가능한 요소 필터링
    const clickableElement = elementsAtCursor.find(element => {
      return (
        element.tagName === "BUTTON" ||
        element.tagName === "A"
      );
    });

    if (clickableElement instanceof HTMLElement) {
      // 포커스를 설정하는 타이머
      focusTimer = setTimeout(() => {
        clickableElement.focus();
        // console.log("포커스 적용됨");

        clickableElement.classList.add("animate-background", "playing");
        clickableElement.classList.remove("stopped"); // 중단 상태 제거

        // 포커스가 적용된 후 4초 대기 후 클릭
        clickTimer = setTimeout(() => {
          // requestAnimationFrame을 사용하여 포커스가 확실히 적용된 후 클릭
          requestAnimationFrame(() => {
            const activeElement = document.activeElement;

            // 현재 포커스된 요소가 clickableElement와 일치하는지 확인
            if (activeElement === clickableElement) {
              // fake-cursor 위치 계산
              const cursorElement = document.querySelector(".fake-cursor");
              if (cursorElement instanceof HTMLElement) {
                const cursorRect = cursorElement.getBoundingClientRect();
                const clickableRect = clickableElement.getBoundingClientRect();

                // fake-cursor가 클릭 가능한 영역 내에 있을 때만 클릭
                if (
                  cursorRect.left >= clickableRect.left &&
                  cursorRect.top >= clickableRect.top &&
                  cursorRect.right <= clickableRect.right &&
                  cursorRect.bottom <= clickableRect.bottom
                ) {
                  clickableElement.click();  // 클릭 동작
                  // console.log("현재 포커스된 요소 클릭됨");
                } else {
                  // console.log("fake-cursor가 클릭 가능한 영역을 벗어남");
                  clearTimeout(clickTimer!); // clickTimer가 null일 수 있으므로 안전하게 처리
                  // fake-cursor가 영역을 벗어나면 배경이 내려가는 애니메이션 적용
                  clickableElement.classList.add("stopped");
                  clickableElement.classList.remove("playing");
                }
              }
            }
          });
        }, 4000); // 포커스 후 4초 대기 후 클릭

      }, 1000); // 1초 후 포커스 설정
    } else {
      // 클릭 가능한 요소가 없으면 타이머 초기화
      clearTimeout(focusTimer!);
      clearTimeout(clickTimer!);
    }
  }
}

// 가짜 커서 생성 함수
function createFakeCursor() {
  const cursorElement = document.createElement("div");
  cursorElement.classList.add("fake-cursor");

  document.body.appendChild(cursorElement);  // 화면에 커서를 추가
}

// moveCursorTo 함수: 커서 위치 이동
function moveCursorTo(x: number, y: number) {
  const cursorElement = document.querySelector(".fake-cursor");
  if (cursorElement instanceof HTMLElement) {
    cursorElement.style.left = `${x - 25}px`;
    cursorElement.style.top = `${y - 25}px`;
  }
}