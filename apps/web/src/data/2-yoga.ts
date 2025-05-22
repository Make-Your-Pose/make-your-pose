import type { AnswerData } from './types';

const yogaData: AnswerData[] = [];
for (let i = 1; i <= 5; i++) {
  const number = String(i).padStart(5, '0');
  yogaData.push({
    image: `/answer-images/yoga/${number}.webp`,
    landmarksPath: `/answer-images/yoga/${number}.json`,
  });
}

export default yogaData;
