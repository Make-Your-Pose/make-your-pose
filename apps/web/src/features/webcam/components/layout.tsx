import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { css } from '~styled-system/css';
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { WebcamContext } from '../context';
import { poseLandmarker, gestureRecognizer } from 'src/features/webcam/vision';
import { DevtoolMenu } from 'src/features/devtool/components/menu';
import { DevtoolWebcam } from 'src/features/devtool/components/webcam';
import { NicknameProvider } from 'src/features/nickname/context';
import { logger } from 'src/utils/logger';
import { detectGesture } from '../gesture-detection';

// Check if environment is production
const isProduction = process.env.NODE_ENV === 'production';

// Gesture context 및 useGesture 제거

/**
 * 전역 레이아웃
 * 웹캠과 개발자 도구를 관리
 * + 제스처 인식 기능 통합
 */
export function GlobalLayout() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [poseLandmarkerResult, setPoseLandmarkerResult] =
    useState<PoseLandmarkerResult | null>(null);

  // Gesture 관련 상태 및 ref
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const lastVideoTimestampRef = useRef(performance.now());

  // 웹캠 스트림 시작 및 비디오 연결
  useEffect(() => {
    async function startWebcam() {
      if (navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(stream);

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          logger.error('Error accessing webcam: ', err);
        }
      }
    }
    startWebcam();

    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  // poseLandmarker + gestureRecognizer 동시 실행
  const handleLoadedData: React.ReactEventHandler<HTMLVideoElement> = (
    event,
  ) => {
    const video = event.currentTarget;

    const detectLoop = async () => {
      const timestamp = performance.now();
      if (timestamp !== lastVideoTimestampRef.current) {
        // Pose detection
        if (poseLandmarker) {
          const poseLandmarkerResult = poseLandmarker.detectForVideo(
            video,
            timestamp,
          );
          setPoseLandmarkerResult(poseLandmarkerResult);
        }

        // Gesture detection
        if (gestureRecognizer) {
          try {
            const results = await gestureRecognizer.recognizeForVideo(
              video,
              timestamp,
            );
            if (results?.gestures.length > 0) {
              detectGesture(results, canvasRef);
            }
          } catch (error) {
            logger.error('제스처 인식 오류:', error);
          }
        }

        lastVideoTimestampRef.current = timestamp;
      }
      animationFrameIdRef.current = requestAnimationFrame(detectLoop);
    };

    detectLoop();
  };

  return (
    <WebcamContext.Provider value={{ stream, poseLandmarkerResult }}>
      <NicknameProvider>
        <Outlet />
      </NicknameProvider>

      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        ref={videoRef}
        className={css({
          srOnly: true,
        })}
        autoPlay
        width={640}
        height={480}
        onLoadedData={handleLoadedData}
      />
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

      {/* Only render developer tools in non-production environments */}
      {!isProduction && (
        <>
          <DevtoolMenu />
          <DevtoolWebcam />
        </>
      )}
    </WebcamContext.Provider>
  );
}
