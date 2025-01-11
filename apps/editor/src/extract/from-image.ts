import { poseLandmarker } from '../vision/pose-landmarker';

export async function extractFromImage() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'Images',
        accept: {
          'image/*': ['.jpg', '.jpeg', '.png'],
        },
      },
    ],
  });
  const file = await fileHandle.getFile();
  const image = await createImageBitmap(file);

  const result = poseLandmarker.detect(image);

  console.log(result);

  return result.landmarks[0].map((lm) => ({
    x: lm.x * 2 - 1,
    y: lm.y * 2 - 1,
    z: lm.z,
    visibility: lm.visibility,
  }));
}
