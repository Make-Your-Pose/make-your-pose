import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { Line } from '@react-three/drei';
import Point from './point';
import { useMemo } from 'react';

interface Props {
  landmarks: NormalizedLandmark[];
  onLandmarksUpdate: (landmarks: NormalizedLandmark[]) => void;
}

export function Landmarks({ landmarks, onLandmarksUpdate }: Props) {
  const scaledLandmarks = useMemo(
    () =>
      landmarks.map(
        (lm) =>
          ({
            x: lm.x * 5,
            y: lm.y * 5,
            z: lm.z * 5,
            visibility: lm.visibility,
          }) satisfies NormalizedLandmark,
      ),
    [landmarks],
  );

  return (
    <>
      {scaledLandmarks.map((lm, i) => (
        <Point
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          key={i}
          landmark={lm}
          onUpdate={(newLandmark) => {
            const newLandmarks = [...scaledLandmarks];
            newLandmarks[i] = newLandmark;
            onLandmarksUpdate(newLandmarks);
          }}
        />
      ))}
      <pointsMaterial vertexColors size={0.2} depthWrite={false} />\{' '}
      {CONNECTIONS.map(([startIdx, endIdx], i) => {
        const start = scaledLandmarks[startIdx];
        const end = scaledLandmarks[endIdx];

        return (
          <Line
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={i}
            points={[
              [start.x, start.y, start.z],
              [end.x, end.y, end.z],
            ]}
            color="yellow"
            segments
          />
        );
      })}
    </>
  );
}

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 7],
  [0, 4],
  [4, 5],
  [5, 6],
  [6, 8],
  [9, 10],
  [11, 12],
  [11, 13],
  [13, 15],
  [15, 17],
  [15, 19],
  [15, 21],
  [17, 19],
  [12, 14],
  [14, 16],
  [16, 18],
  [16, 20],
  [16, 22],
  [18, 20],
  [11, 23],
  [12, 24],
  [23, 24],
  [23, 25],
  [24, 26],
  [25, 27],
  [26, 28],
  [27, 29],
  [28, 30],
  [29, 31],
  [30, 32],
  [27, 31],
  [28, 32],
];
