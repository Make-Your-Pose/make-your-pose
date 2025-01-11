import { useEffect, useRef } from 'react';
import { useWebcam } from 'src/webcam/context';

function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream } = useWebcam();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video ref={videoRef} autoPlay />
    </div>
  );
}

export default Player;
