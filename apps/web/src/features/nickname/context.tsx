import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Lists of adjectives and nouns in Korean
const adjectives = [
  '행복한',
  '즐거운',
  '신나는',
  '기분좋은',
  '뭉클한',
  '설레는',
  '기대되는',
  '상쾌한',
  '활기찬',
  '씩씩한',
  '웃는',
  '긍정적인',
  '희망찬',
  '따스한',
  '포근한',
  '다정한',

  '용감한',
  '대담한',
  '정의로운',
  '진실된',
  '성실한',
  '부지런한',
  '똑똑한',
  '지혜로운',
  '현명한',
  '창의적인',
  '열정적인',
  '친절한',
  '상냥한',
  '예의바른',
  '겸손한',
  '끈기있는',
  '침착한',
  '자유로운',
  '솔직한',
  '유쾌한',
  '재미있는',
  '매력적인',

  '귀여운',
  '아름다운',
  '멋진',
  '잘생긴',
  '예쁜',
  '빛나는',
  '반짝이는',
  '화려한',
  '우아한',
  '단정한',
  '깔끔한',
  '작은',
  '강력한',
  '튼튼한',
  '건강한',
  '빠른',
  '날렵한',
  '푸른',
  '붉은',
  '하얀',
  '검은',
  '노란',
  '알록달록한',
  '투명한',
  '부드러운',
  '단단한',
  '차가운',
  '뜨거운',
  '시원한',
  '따뜻한',
  '촉촉한',
  '새로운',
  '젊은',
  '신비로운',
  '소중한',
  '특별한',
  '유명한',
  '전설적인',
  '향기로운',
];

const nouns = [
  '사자',
  '호랑이',
  '표범',
  '치타',
  '늑대',
  '여우',
  '곰',
  '코끼리',
  '기린',
  '하마',
  '코뿔소',
  '얼룩말',
  '원숭이',
  '고릴라',
  '캥거루',
  '코알라',
  '판다',
  '너구리',
  '수달',
  '비버',
  '사슴',
  '고슴도치',
  '다람쥐',
  '청설모',
  '고양이',
  '강아지',
  '햄스터',
  '기니피그',
  '토끼',
  '염소',
  '돼지',
  '오리',
  '거위',
  '독수리',
  '부엉이',
  '올빼미',
  '까마귀',
  '까치',
  '참새',
  '비둘기',
  '앵무새',
  '플라밍고',
  '펭귄',
  '고래',
  '돌고래',
  '상어',
  '문어',
  '오징어',
  '해파리',
  '불가사리',
  '물고기',
  '거북이',
  '자라',
  '악어',
  '도마뱀',
  '카멜레온',
  '개구리',
  '두꺼비',
  '달팽이',
  '나비',
  '잠자리',
  '꿀벌',
  '무당벌레',
  '개미',
  '메뚜기',
  '귀뚜라미',
  '유니콘',
  '페가수스',
  '불사조',
  '인어',
  '요정',

  '하늘',
  '구름',
  '태양',
  '은하수',
  '우주',
  '바다',
  '파도',
  '호수',
  '폭포',
  '이슬',
  '안개',
  '무지개',
  '언덕',
  '계곡',
  '동굴',
  '나무',
  '씨앗',
  '열매',
  '버섯',
  '보석',
  '크리스탈',
  '모래',
  '진흙',
  '불꽃',
  '용암',
  '그림자',
];

// Function to generate a random nickname
const generateNickname = (): string => {
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun}`;
};

// Type for the nickname context
type NicknameContextType = {
  id: string; // Add id field
  nickname: string;
  regenerateNickname: () => void;
};

// Create the context with default values
const NicknameContext = createContext<NicknameContextType>({
  id: '', // Add default id
  nickname: '',
  regenerateNickname: () => {},
});

// Custom hook to use the nickname context
export const useNickname = () => useContext(NicknameContext);

// Provider component for the nickname
export const NicknameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [id, setId] = useState<string>(''); // Add id state
  const [nickname, setNickname] = useState<string>('');

  // Generate a nickname and id on initial render
  useEffect(() => {
    const newNickname = generateNickname();
    setNickname(newNickname);
    setId(uuidv4()); // Generate and set UUID v4
  }, []);

  // Function to regenerate the nickname
  const regenerateNickname = () => {
    const newNickname = generateNickname();
    setNickname(newNickname);
    setId(uuidv4());
  };

  return (
    <NicknameContext.Provider value={{ id, nickname, regenerateNickname }}>
      {children}
    </NicknameContext.Provider>
  );
};
