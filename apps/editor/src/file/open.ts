import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export async function openFile() {
  const [fileHandle] = await window.showOpenFilePicker({
    types: [
      {
        description: 'JSON',
        accept: {
          'application/json': ['.json'],
        },
      },
    ],
  });
  const file = await fileHandle.getFile();
  const text = await file.text();

  return JSON.parse(text) as NormalizedLandmark[];
}
