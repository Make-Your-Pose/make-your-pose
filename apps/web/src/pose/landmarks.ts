import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

function splitLandmarks(landmarks: NormalizedLandmark[]) {
  if (!landmarks) return { main: [], face: [], handsFeet: [] };

  const main: NormalizedLandmark[] = [];
  const face: NormalizedLandmark[] = [];
  const handsFeet: NormalizedLandmark[] = [];

  landmarks.forEach((landmark, index) => {
    if (index >= 0 && index <= 10) {
      face.push(landmark);
    } else if ((index >= 15 && index <= 20) || (index >= 21 && index <= 32)) {
      handsFeet.push(landmark);
    } else {
      main.push(landmark);
    }
  });

  return { main, face, handsFeet };
}

export function calculateDistanceSimilarity(
  landmarks1: NormalizedLandmark[],
  landmarks2: NormalizedLandmark[],
) {
  const {
    main: main1,
    face: face1,
    handsFeet: handsFeet1,
  } = splitLandmarks(landmarks1);
  const {
    main: main2,
    face: face2,
    handsFeet: handsFeet2,
  } = splitLandmarks(landmarks2);

  let totalDifference = 0;
  let count = 0;

  // 주요 관절 유사도 (가중치 1.0)
  main1.forEach((landmark, index) => {
    if (landmark && main2[index]) {
      const dx = landmark.x - main2[index].x;
      const dy = landmark.y - main2[index].y;
      totalDifference += Math.sqrt(dx * dx + dy * dy) * 1.0;
      count++;
    }
  });

  // 얼굴 유사도 (가중치 0.2)
  face1.forEach((landmark, index) => {
    if (landmark && face2[index]) {
      const dx = landmark.x - face2[index].x;
      const dy = landmark.y - face2[index].y;
      totalDifference += Math.sqrt(dx * dx + dy * dy) * 0.2;
      count++;
    }
  });

  // 손가락/발끝 유사도 (가중치 0.2)
  handsFeet1.forEach((landmark, index) => {
    if (landmark && handsFeet2[index]) {
      const dx = landmark.x - handsFeet2[index].x;
      const dy = landmark.y - handsFeet2[index].y;
      totalDifference += Math.sqrt(dx * dx + dy * dy) * 0.2;
      count++;
    }
  });

  if (count === 0) return 0;

  return 1 / (1 + totalDifference / count);
}

export function calculateAngleSimilarity(
  answerAngles: Angles,
  currentAngles: Angles,
  tolerance = 15,
) {
  let totalDifference = 0;
  let count = 0;

  for (const key in answerAngles) {
    const angleKey = key as keyof Angles;
    if (answerAngles[angleKey] !== null && currentAngles[angleKey] !== null) {
      const difference = Math.abs(
        answerAngles[angleKey] - currentAngles[angleKey],
      );
      if (difference <= tolerance) {
        totalDifference += difference;
        count++;
      }
    }
  }

  if (count === 0) return 0;

  return 1 / (1 + totalDifference / count);
}

export function calculateCombinedSimilarity(
  distanceSimilarity: number,
  angleSimilarity: number,
  w1 = 0.8,
  w2 = 0.2,
) {
  return w1 * distanceSimilarity + w2 * angleSimilarity;
}

function calculateAngle(
  firstLandmark: NormalizedLandmark,
  midLandmark: NormalizedLandmark,
  lastLandmark: NormalizedLandmark,
) {
  const radians =
    Math.atan2(lastLandmark.y - midLandmark.y, lastLandmark.x - midLandmark.x) -
    Math.atan2(
      firstLandmark.y - midLandmark.y,
      firstLandmark.x - midLandmark.x,
    );

  let degrees = Math.abs(radians * (180.0 / Math.PI));
  if (degrees > 180.0) {
    degrees = 360.0 - degrees;
  }
  return degrees;
}

interface Angles {
  leftShoulder: number;
  rightShoulder: number;
  leftElbow: number;
  rightElbow: number;
  frontLegHip: number;
  backKnee: number;
  waist: number;
  face: number;
  finger: number;
  toe: number;
}

export function getPoseAngles(landmarks: NormalizedLandmark[]) {
  const angles: Angles = {
    leftShoulder: calculateAngle(landmarks[11], landmarks[13], landmarks[15]),
    rightShoulder: calculateAngle(landmarks[12], landmarks[14], landmarks[16]),
    leftElbow: calculateAngle(landmarks[11], landmarks[13], landmarks[23]),
    rightElbow: calculateAngle(landmarks[12], landmarks[14], landmarks[24]),
    frontLegHip: calculateAngle(landmarks[23], landmarks[25], landmarks[27]),
    backKnee: calculateAngle(landmarks[24], landmarks[26], landmarks[28]),
    waist: calculateAngle(landmarks[11], landmarks[23], landmarks[25]),
    face: calculateAngle(landmarks[0], landmarks[1], landmarks[2]), // 얼굴 각도
    finger: calculateAngle(landmarks[15], landmarks[17], landmarks[19]), // 손가락 각도
    toe: calculateAngle(landmarks[27], landmarks[31], landmarks[32]), // 발끝 각도
  };

  // const validAngles = {};
  // for (const key in angles) {
  //   if (angles[key] !== null) {
  //     validAngles[key] = angles[key];
  //   }
  // }
  return angles;
}

export function calculateCosineSimilarity(
      landmarks1: NormalizedLandmark[],
      landmarks2: NormalizedLandmark[],
) {
  const {
    main: main1,
    face: face1,
    handsFeet: handsFeet1,
  } = splitLandmarks(landmarks1);
  const {
    main: main2,
    face: face2,
    handsFeet: handsFeet2,
  } = splitLandmarks(landmarks2);

  let allLandmarks1 = [...main1, ...face1, ...handsFeet1];
  let allLandmarks2 = [...main2, ...face2, ...handsFeet2];

  let normLandmarks1 = normalizeVector(allLandmarks1);
  let normLandmarks2 = normalizeVector(allLandmarks2);

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < normLandmarks1.length; i++) {
    let weight = 1.0;
    if (i >= main1.length && i < main1.length + face1.length)
      weight = 0.2; // 얼굴 중요도 낮춤
    if (i >= main1.length + face1.length) weight = 1.0; // 손, 발 중요도 증가

    dotProduct +=
      (normLandmarks1[i].x * normLandmarks2[i].x +
        normLandmarks1[i].y * normLandmarks2[i].y +
        normLandmarks1[i].z * normLandmarks2[i].z) * // Z값 포함
      weight;

    magnitude1 +=
      (normLandmarks1[i].x ** 2 +
        normLandmarks1[i].y ** 2 +
        normLandmarks1[i].z ** 2) *
      weight;
    magnitude2 +=
      (normLandmarks2[i].x ** 2 +
        normLandmarks2[i].y ** 2 +
        normLandmarks2[i].z ** 2) *
      weight;

      console.log(magnitude1, magnitude2);
  }

  let cosineSimilarity =
    dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  return Math.max(0, Math.min(1, cosineSimilarity));

}

// 벡터 정규화
function normalizeVector(landmarks) {
  let meanX =
    landmarks.reduce((sum, lm) => sum + lm.x, 0) / landmarks.length;
  let meanY =
    landmarks.reduce((sum, lm) => sum + lm.y, 0) / landmarks.length;
  let meanZ =
    landmarks.reduce((sum, lm) => sum + (lm.z || 0), 0) /
    landmarks.length; // Z값 추가

  let norm = Math.sqrt(
    landmarks.reduce(
      (sum, lm) =>
        sum +
        (lm.x - meanX) ** 2 +
        (lm.y - meanY) ** 2 +
        (lm.z || 0 - meanZ) ** 2, // Z값 추가
      0
    )
  );

  return landmarks.map((lm) => ({
    x: (lm.x - meanX) / norm,
    y: (lm.y - meanY) / norm,
    z: (lm.z || 0 - meanZ) / norm, // Z값 정규화
  }));
}