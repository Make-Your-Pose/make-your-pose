import { useEffect, useRef } from 'react';
import { useWebcam } from 'src/features/webcam/context';
import { css } from '~styled-system/css';
import { DevtoolMachineContext } from '../machine';

export function DevtoolWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const enableWebcam = DevtoolMachineContext.useSelector(
    (state) => state.context.enableWebcam,
  );

  const webcam = useWebcam();

  useEffect(() => {
    if (enableWebcam && videoRef.current) {
      videoRef.current.srcObject = webcam.stream;
    }
  }, [enableWebcam, webcam.stream]);

  webcam.poseLandmarkerResult?.segmentationMasks?.[0];

  if (!enableWebcam) {
    return null;
  }

  return (
    <div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={css({
          display: 'block',
          position: 'fixed',
          shadow: '2xl',
          bottom: 4,
          right: 4,
          zIndex: 9999,
        })}
      />
    </div>
  );
}
