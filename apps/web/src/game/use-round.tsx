import { useState, useEffect, useRef } from 'react';

// 힌트 공개 하나의 제한 시간 (초)
const hintLimit = 10;

export function useRound() {
  const [round, setRound] = useState(0);
  const [hint, setHint] = useState([
    [false, false, false],
    [false, false, false],
    [false, false, false],
  ]);
  const [isHintTimerActive, setIsHintTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(hintLimit);

  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const startTimeRef = useRef<number>();

  // RAF 기반 실시간 카운트다운 타이머
  useEffect(() => {
    if (!isHintTimerActive) {
      return;
    }

    const animate = (timestamp: number) => {
      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
        previousTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const remainingTime = Math.max(0, hintLimit - elapsed / 1000);

      // 0.01초 단위로 반올림하여 표시
      const roundedTime = Math.round(remainingTime * 100) / 100;

      setTimeRemaining(roundedTime);

      // 시간이 0이 되면 힌트를 보여주고 타이머 재설정
      if (roundedTime <= 0) {
        showRandomHint();
        startTimeRef.current = timestamp; // 타이머 재시작
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      previousTimeRef.current = undefined;
    };
  }, [isHintTimerActive]);

  const nextRound = () => {
    setRound((prev) => prev + 1);
    setHint([
      [false, false, false],
      [false, false, false],
      [false, false, false],
    ]);
    // 새로운 라운드가 시작될 때 타이머 초기화
    setIsHintTimerActive(false);
    setTimeRemaining(hintLimit);
    startTimeRef.current = undefined;
  };

  const showRandomHint = () => {
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);

    if (hint[row][col]) {
      return showRandomHint();
    }

    setHint((prev) => {
      const newHint = [...prev];
      newHint[row][col] = true;
      return newHint;
    });
  };

  const startHintTimer = () => {
    setIsHintTimerActive(true);
    setTimeRemaining(hintLimit);
    startTimeRef.current = undefined;
    previousTimeRef.current = undefined;
  };

  const stopHintTimer = () => {
    setIsHintTimerActive(false);
  };

  return {
    round,
    hint,
    nextRound,
    showRandomHint,
    startHintTimer,
    stopHintTimer,
    isHintTimerActive,
    timeRemaining,
  };
}
