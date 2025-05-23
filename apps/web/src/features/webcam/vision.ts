import {
  FilesetResolver,
  GestureRecognizer,
  PoseLandmarker,
} from '@mediapipe/tasks-vision';

const vision = await FilesetResolver.forVisionTasks(
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
);

export const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
  baseOptions: {
    modelAssetPath:
      'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task',
    delegate: 'GPU',
  },
  runningMode: 'VIDEO',
  outputSegmentationMasks: true,
});

export const gestureRecognizer = await GestureRecognizer.createFromOptions(
  vision,
  {
    baseOptions: {
      modelAssetPath:
        'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
    },
    runningMode: 'VIDEO',
    numHands: 2,
    minHandDetectionConfidence: 0.5,
    minHandPresenceConfidence: 0.5,
    minTrackingConfidence: 0.5,
    cannedGesturesClassifierOptions: {
      displayNamesLocale: 'en',
      maxResults: -1,
      scoreThreshold: 0.0,
      categoryAllowlist: ['Pointing_Up', 'Thumb_Up', 'Victory', 'Open_Palm'],
      categoryDenylist: [],
    },
    customGesturesClassifierOptions: {
      displayNamesLocale: 'en',
      maxResults: -1,
      scoreThreshold: 0.0,
      categoryAllowlist: [],
      categoryDenylist: [],
    },
  },
);
