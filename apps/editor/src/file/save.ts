import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export async function saveFile(landmarks: NormalizedLandmark[]) {
  const fileHandle = await window.showSaveFilePicker({
    types: [
      {
        description: 'JSON',
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
  });
  const writable = await fileHandle.createWritable();
  await writable.write(JSON.stringify(landmarks));
  await writable.close();
}
