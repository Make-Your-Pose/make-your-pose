import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { PivotControls } from '@react-three/drei';
import { useState } from 'react';

interface Props {
  landmark: NormalizedLandmark;
  onUpdate: (landmark: NormalizedLandmark) => void;
}

export default function Point({ landmark }: Props) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <PivotControls
      enabled={isSelected}
      anchor={[0, 0, 0]}
      disableRotations
      disableScaling
      disableSliders
      depthTest={false}
      // autoTransform={false}
      // onDrag={(l, dl, w, dw) => {
      //   const newPosition = new Vector3();
      //   l.decompose(newPosition, new Quaternion(), new Vector3());

      //   // 기존 landmark 데이터와 병합하여 업데이트
      //   onUpdate({
      //     ...landmark,
      //     x: newPosition.x,
      //     y: newPosition.y,
      //     z: newPosition.z,
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
