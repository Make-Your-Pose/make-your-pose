import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { css } from '~styled-system/css';
import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { WebcamContext } from '../context';
import { poseLandmarker } from 'src/features/webcam/pose-landmarker';
import { DevtoolMenu } from 'src/features/devtool/components/menu';
import { DevtoolWebcam } from 'src/features/devtool/components/webcam';
import { NicknameProvider } from 'src/features/nickname/context';
import { logger } from 'src/utils/logger';

/**
 * 전역 레이아웃
 * 웹캠과 개발자 도구를 관리
 */
export function GlobalLayout() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [poseLandmarkerResult, setPoseLandmarkerResult] =
    useState<PoseLandmarkerResult | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastVideoTimestampRef = useRef(performance.now());

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
  }, []);

  const handleLoadedData: React.ReactEventHandler<HTMLVideoElement> = (
    event,
  ) => {
    const video = event.currentTarget;

    const detectPose = () => {
      const timestamp = performance.now();
      if (timestamp !== lastVideoTimestampRef.current) {
        const poseLandmarkerResult = poseLandmarker.detectForVideo(
          video,
          timestamp,
        );
        setPoseLandmarkerResult(poseLandmarkerResult);

        lastVideoTimestampRef.current = timestamp;
      }
      requestAnimationFrame(detectPose);
    };

    detectPose();
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

      <DevtoolMenu />
      <DevtoolWebcam />
    </WebcamContext.Provider>
  );
}
