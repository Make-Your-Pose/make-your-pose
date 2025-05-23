import type React from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { gestureRecognizer, detectGesture } from './gesture-detection';
import { logger } from 'src/utils/logger';

interface GestureResult {
  gestures: Array<any>;
}

const GestureContext = createContext<{
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  buttonRefs: React.RefObject<(HTMLButtonElement | HTMLAnchorElement)[]>;
  gestureResults: GestureResult | null;
}>({
  videoRef: { current: null },
  canvasRef: { current: null },
  buttonRefs: { current: [] },
  gestureResults: null,
});

export function GestureProvider({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);
  const [gestureResults, setGestureResults] = useState<GestureResult | null>(
    null,
  );

  useEffect(() => {
    async function startVideoStream() {
      if (!videoRef.current) return;

      try {
        logger.log('전역 비디오 스트림 시작');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;

        videoRef.current.addEventListener('canplay', () => {
          logger.log('비디오 스트림 준비 완료!');
          startGestureRecognition();
        });
      } catch (error) {
        logger.error('비디오 스트림 오류:', error);
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
      logger.error('Gesture Recognizer 초기화되지 않음');
      return;
    }

    logger.log('Gesture Recognizer 실행됨');

    const detectLoop = async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) {
        logger.error('⚠️ 비디오 준비되지 않음, 대기 중...');
        return requestAnimationFrame(detectLoop);
      }

      try {
        const results = await gestureRecognizer.recognizeForVideo(
          videoRef.current,
          performance.now(),
        );
        if (results?.gestures.length > 0) {
          setGestureResults(results);
          detectGesture(results, canvasRef);
        }
      } catch (error) {
        logger.error('제스처 인식 오류:', error);
      }

      animationFrameIdRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();
  }

  return (
    <GestureContext.Provider
      value={{ videoRef, canvasRef, buttonRefs, gestureResults }}
    >
      <video ref={videoRef} autoPlay playsInline style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      {children}
    </GestureContext.Provider>
  );
}

// 제스처 컨텍스트 사용 함수
export function useGesture() {
  return useContext(GestureContext);
}
