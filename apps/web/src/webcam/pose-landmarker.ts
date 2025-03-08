import { FilesetResolver, PoseLandmarker, GestureRecognizer } from "@mediapipe/tasks-vision";

const vision = await FilesetResolver.forVisionTasks(
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
);

// 포즈 랜드마커 (Pose Landmarker)
export const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
    delegate: "GPU",
  },
  runningMode: "VIDEO",
});

// 정답 비교용 포즈 랜드마커 (Answer Landmarker)
export const answerLandmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath:
      "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
    delegate: "GPU",
  },
  runningMode: "IMAGE",
});