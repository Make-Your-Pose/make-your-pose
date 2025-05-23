import type { AnswerData } from './types';

const sportsData: AnswerData[] = [];
for (let i = 1; i <= 21; i++) {
  const number = String(i).padStart(5, '0');
  sportsData.push({
    image: `/answer-images/sports/${number}.webp`,
    landmarksPath: `/answer-images/sports/${number}.json`,
  });
}

export default sportsData;
