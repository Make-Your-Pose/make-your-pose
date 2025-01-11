import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { PivotControls } from '@react-three/drei';
import { useState } from 'react';
import * as THREE from 'three';

interface Props {
  landmark: NormalizedLandmark;
  onUpdate: (landmark: NormalizedLandmark) => void;
}

export default function Point({ landmark, onUpdate }: Props) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <PivotControls
      enabled={isSelected}
      anchor={[0, 0, 0]}
      disableRotations
      disableScaling
      disableSliders
      depthTest={false}
      // onDrag={(l, dl, w, dw) => {
      //   onUpdate({
      //     ...landmark,
      //   });
      // }}
    >
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
      <mesh
        position={[landmark.x, landmark.y, landmark.z]}
        onClick={() => setIsSelected(!isSelected)}
      >
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color={isSelected ? 'red' : 'white'} />
      </mesh>
    </PivotControls>
  );
}
