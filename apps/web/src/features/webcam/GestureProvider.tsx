import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { gestureRecognizer, detectGesture } from "./gesture-detection";

const GestureContext = createContext(null);

export function GestureProvider({ children }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const buttonRefs = useRef([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const [gestureResults, setGestureResults] = useState(null);

  useEffect(() => {
    async function startVideoStream() {
      if (!videoRef.current) return;

      try {
        console.log("전역 비디오 스트림 시작");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;

        videoRef.current.addEventListener("canplay", () => {
          console.log("비디오 스트림 준비 완료!");
          startGestureRecognition();
        });
      } catch (error) {
        console.error("비디오 스트림 오류:", error);
      }
    }

    startVideoStream();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  async function startGestureRecognition() {
    if (!gestureRecognizer) {
      console.error("Gesture Recognizer 초기화되지 않음");
      return;
    }

    console.log("Gesture Recognizer 실행됨");

    const detectLoop = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        console.warn("⚠️ 비디오 준비되지 않음, 대기 중...");
        return requestAnimationFrame(detectLoop);
      }

      try {
        const results = await gestureRecognizer.recognizeForVideo(videoRef.current, performance.now());
        if (results?.gestures.length > 0) {
          setGestureResults(results);
          detectGesture(results, canvasRef, buttonRefs);
        }
      } catch (error) {
        console.error("제스처 인식 오류:", error);
      }

      animationFrameIdRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }

  return (
    <GestureContext.Provider value={{ videoRef, canvasRef, buttonRefs, gestureResults }}>
      <video ref={videoRef} autoPlay playsInline style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
        }}
      />
      {children}
    </GestureContext.Provider>
  );
}

//제스처 컨텍스트 사용 함수
export function useGesture() {
  return useContext(GestureContext);
}
