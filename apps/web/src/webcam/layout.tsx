import { useRef, useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { WebcamContext } from './context';
import { poseLandmarker } from './pose-landmarker';
import { css } from '~styled-system/css';
import {
  DrawingUtils,
  PoseLandmarker,
  type PoseLandmarkerResult,
} from '@mediapipe/tasks-vision';

function WebcamLayout() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [poseLandmarkerResult, setPoseLandmarkerResult] =
    useState<PoseLandmarkerResult | null>(null);
  const [isActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
          console.error('Error accessing webcam: ', err);
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

        const canvasCtx = canvasRef.current?.getContext('2d');
        if (canvasRef.current && canvasCtx) {
          canvasCtx.save();
          canvasCtx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.width,
          );
          const drawingUtils = new DrawingUtils(canvasCtx);
          for (const landmark of poseLandmarkerResult.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) =>
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS,
            );
          }

          canvasCtx.restore();
        }
      }
      requestAnimationFrame(detectPose);
    };

    detectPose();
  };

  return (
    <WebcamContext.Provider value={{ stream, poseLandmarkerResult }}>
      <div>
        {/* <label>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Activate Webcam
        </label> */}

        <div className={css({ position: 'relative' })}>
          {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
          <video
            ref={videoRef}
            className={css({ srOnly: !isActive })}
            autoPlay
            width={640}
            height={480}
            onLoadedData={handleLoadedData}
          />
          <canvas
            ref={canvasRef}
            className={css({
              display: isActive ? 'block' : 'none',
              position: 'absolute',
              top: 0,
              left: 0,
            })}
            style={{ width: '640px', height: '480px' }}
          />
        </div>

        <Outlet />
      </div>
    </WebcamContext.Provider>
  );
}

export default WebcamLayout;
