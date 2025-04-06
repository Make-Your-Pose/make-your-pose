import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import Avatar from './avatar';
import { useWebcam } from 'src/features/webcam/context';

export function Player() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { stream, poseLandmarkerResult } = useWebcam();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <Canvas camera={{ position: [0, 1, -5] }}>
      {poseLandmarkerResult?.landmarks[0] ? (
        <Avatar
          poseData={poseLandmarkerResult.landmarks[0]}
          worldData={poseLandmarkerResult.worldLandmarks[0]}
        />
      ) : null}

      <spotLight
        position={[7, 7, 7]}
        castShadow
        intensity={100}
        shadow-bias={-0.0001}
      />
      <ambientLight intensity={1} />
    </Canvas>
  );
}
