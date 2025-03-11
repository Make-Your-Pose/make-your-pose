import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );


  //제스처 인식
export const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task",
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
      categoryAllowlist: ["Pointing_Up", "Thumb_Up", "Victory"],
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

//제스처 랜드마크 시각화 및 버튼 클릭 이벤트
  let rightThumbUpTimer = null;
  let leftThumbUpTimer = null;
  let bothThumbUpTimer = null;
  
  export function detectGesture(gestureResults, canvasRef) {
    
    if (!gestureResults || !canvasRef?.current) return;
  
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    if (!ctx) return;
  
    //캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 640;
    canvas.height = 480;

    // 캔버스 거울 모드
    ctx.save(); 
    ctx.translate(canvas.width, 0); 
    ctx.scale(-1, 1);
      
    let rightThumbUp = false;
    let leftThumbUp = false;
  
    //손 랜드마크 시각화
    gestureResults.landmarks.forEach((hand, index) => {
      hand.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x * canvas.width, point.y * canvas.height, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
      });

      // `handedness` 값을 가져와 사용
      const handType = gestureResults.handedness[index]?.[0]?.displayName; // "Left" 또는 "Right"
  
      const categoryName = gestureResults.gestures[index]?.[0]?.categoryName;
      if (categoryName === "Thumb_Up") {
        if (handType === "Left") {
          leftThumbUp = true;
        } else if (handType === "Right") {
          rightThumbUp = true;
        }
      }
    });
  
    // 2초 동안 유지
    if (rightThumbUp && leftThumbUp) {
      if (!bothThumbUpTimer) {
        console.log("양손 Thumb Up 감지! 2초 유지하면 클릭");
        bothThumbUpTimer = setTimeout(() => {
          console.log("양손 Thumb Up 2초 유지됨! 현재 요소 클릭");
          triggerEnterKey();
          bothThumbUpTimer = null;
        }, 2000);
      }
    } else {
      clearTimeout(bothThumbUpTimer);
      bothThumbUpTimer = null;
    }
  
    if (rightThumbUp && !leftThumbUp) {
      if (!rightThumbUpTimer) {
        console.log("오른손 Thumb Up 감지! 2초 유지하면 다음으로 이동");
        rightThumbUpTimer = setTimeout(() => {
          console.log("오른손 Thumb Up 2초 유지됨! 다음 요소로 이동");
          moveFocus(true);
          rightThumbUpTimer = null;
        }, 2000);
      }
    } else {
      clearTimeout(rightThumbUpTimer);
      rightThumbUpTimer = null;
    }
  
    if (leftThumbUp && !rightThumbUp) {
      if (!leftThumbUpTimer) {
        console.log("왼손 Thumb Up 감지! 2초 유지하면 이전으로 이동");
        leftThumbUpTimer = setTimeout(() => {
          console.log("왼손 Thumb Up 2초 유지됨! 이전 요소로 이동");
          moveFocus(false);
          leftThumbUpTimer = null;
        }, 2000);
      }
    } else {
      clearTimeout(leftThumbUpTimer);
      leftThumbUpTimer = null;
    }
  }
  
  //포커스 이동 함수
  function moveFocus(forward = true) {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    );
  
    if (focusableElements.length === 0) return;
  
    const currentIndex = focusableElements.indexOf(document.activeElement);
    let nextIndex;
  
    if (forward) {
      nextIndex = (currentIndex + 1) % focusableElements.length; //다음 요소 (마지막이면 첫 번째로)
    } else {
      nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length; //이전 요소 (첫 번째면 마지막으로)
    }
  
    focusableElements[nextIndex].focus();
  }
  
  //현재 포커스된 요소 클릭
  function triggerEnterKey() {
    const activeElement = document.activeElement;
    if (activeElement && (activeElement.tagName === "BUTTON" || activeElement.tagName === "A" )) {
      activeElement.click();
    }
  }
  
