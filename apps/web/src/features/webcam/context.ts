import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { createContext, useContext } from 'react';

interface WebcamContextValue {
  stream: MediaStream | null;
  poseLandmarkerResult: PoseLandmarkerResult | null;
}

export const WebcamContext = createContext<WebcamContextValue | undefined>(
  undefined,
);

export function useWebcam() {
  const context = useContext(WebcamContext);
  if (context === undefined) {
    throw new Error();
  }
  return context;
}
