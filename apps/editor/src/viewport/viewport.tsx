import { useState } from 'react';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Canvas } from '@react-three/fiber';
import { Landmarks } from './landmarks';
import { GizmoHelper, GizmoViewport, OrbitControls } from '@react-three/drei';
import { Box, Stack } from 'styled-system/jsx';
import { Properties } from './properties';

interface Props {
  landmarks: NormalizedLandmark[] | null;
  onLandmarksUpdate: (landmarks: NormalizedLandmark[]) => void;
}

export function Viewport({ landmarks, onLandmarksUpdate }: Props) {
  const [selectedLandmark] = useState<NormalizedLandmark | null>(null);
  const [selectedIndex] = useState<number | null>(null);

  return (
    <Stack direction="row" flex={1}>
      <Box flex={1}>
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} intensity={1} />
          {landmarks && (
            <Landmarks
              landmarks={landmarks}
              onLandmarksUpdate={onLandmarksUpdate}
            />
          )}
          <OrbitControls makeDefault />
          <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
            <GizmoViewport labelColor="white" axisHeadScale={1} />
          </GizmoHelper>
        </Canvas>
      </Box>
      <Properties
        selectedIndex={selectedIndex}
        selectedLandmark={selectedLandmark}
      />
    </Stack>
  );
}
