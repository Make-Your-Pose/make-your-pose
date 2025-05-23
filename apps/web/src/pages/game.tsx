import { useEffect, useState, useRef } from 'react';
import { css } from '~styled-system/css';
import { hstack, vstack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'src/features/game/machine';
import { Hint } from 'src/features/game/components/hint';
import { SimilarityBoard } from '../features/game/components/similarity-board';
import { inspect } from 'src/features/devtool/inspector';
import { useWebcam } from 'src/features/webcam/context';
import { WebcamPlayer } from 'src/features/game/components/webcam-player';
import { calculateCosineSimilarity } from 'src/pose/landmarks';
import { useNickname } from 'src/features/nickname/context';
import { Link, useNavigate, useLocation } from 'react-router';
import home from '../images/home.svg';
import { logger } from 'src/utils/logger';
import type { AnswerData } from 'src/data/types';
import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { playSound } from '../utils/playSound';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const categoryDataModules: Record<
  string,
  () => Promise<{ default: AnswerData[] }>
> = {
  sports: () => import('../data/1-sports'),
  yoga: () => import('../data/2-yoga'),
};

function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, nickname } = useNickname();

  const [category, setCategory] = useState<string | null>(null);
  const [shuffledAnswers, setShuffledAnswers] = useState<AnswerData[]>([]);
  const [currentAnswerLandmarks, setCurrentAnswerLandmarks] = useState<
    NormalizedLandmark[] | null
  >(null);

  const cosineSimilarityRef = useRef<number | null>(null);
  const lastCalculationTimeRef = useRef<number>(0); // 마지막으로 유사도를 계산한 시간. (타임스탬프)
  const highScoreStartTimeRef = useRef<number | null>(null); // 점수가 일정 기준 이상(예: 85점 이상)을 유지하고 있는 시작 시점. (0.5초 이상 유지됐는지 판단하기 위해 사용)
  const [progressRate, setProgressRate] = useState(0); // 현재 힌트 하나가 지나가는 동안의 진행률 (0~1). (진행 바 같은 UI에 사용됨)
  const [scoreReaction, setScoreReaction] = useState<number | null>(null); // 성공했을 때 뜨는 +85 같은 UI 표시용 숫자. (표시 후 일정 시간 뒤에 null로 초기화됨)
  const [lastPassedScore, setLastPassedScore] = useState<number | null>(null); // 마지막 라운드에서 성공한 점수를 저장. (UI에서 보여줄 점수로 사용됨)
  const [hasPassed, setHasPassed] = useState(false); // 현재 라운드에서 성공했는지 여부. (성공 시 true로 설정됨 실패하면 false)
  const webcam = useWebcam(); // 웹캠에서 가져온 포즈 데이터 (poseLandmarkerResult.landmarks[0])를 포함하는 사용자 정의 훅.
  const [state, send] = useMachine(gameMachine, { inspect }); // xstate 상태 머신에서 현재 상태와 이벤트 전송 함수. 게임 흐름 제어용. (예: "pass", "next", "gameOver" 등)

  const answer =
    shuffledAnswers.length > 0 && state.context.round < shuffledAnswers.length
      ? shuffledAnswers[state.context.round]
      : null;

  const [hintTime, setHintTime] = useState<number | null>(null); // 현재 힌트(카드)가 시작된 시간. 3초 지나면 다음 힌트로 전환.
  const hintDuration = 3000; // 힌트 하나당 보여지는 시간 (3초)
  const isPlaying = state.matches('playing'); // 현재 게임이 "playing" 상태인지 여부.
  const isGameOver = state.matches('gameOver'); // 게임이 "gameOver" 상태인지 여부.
  const remainingTiles = state.context.hint.filter((v) => !v).length;
  const [score, setScore] = useState(0); // 현재 점수. (게임이 끝나면 서버에 전송됨)

  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const prevHintRef = useRef<boolean[]>([]);

  useEffect(() => {
    let isMounted = true;
    playSound('/sounds/bgm_ingame.mp3').then((audio) => {
      if (!isMounted) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }
      audio.loop = true;
      audio.play();
      bgmRef.current = audio;
    });
    return () => {
      isMounted = false;
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
        bgmRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // Play unveil sound when a new hint is unveiled or time runs out
    if (isPlaying && state.context.hint) {
      const prev = prevHintRef.current;
      const curr = state.context.hint;
      if (
        prev.length > 0 &&
        curr.filter(Boolean).length > prev.filter(Boolean).length
      ) {
        playSound('/sounds/sfx_ingame_unveil.mp3');
      }
      prevHintRef.current = [...curr];
    }
  }, [isPlaying, state.context.hint]);

  useEffect(() => {
    // Play correct sound when player gets the correct pose
    if (scoreReaction !== null && scoreReaction > 0) {
      playSound('/sounds/sfx_ingame_correct.mp3');
    }
  }, [scoreReaction]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const cat = searchParams.get('category');
    if (cat && categoryDataModules[cat]) {
      setCategory(cat);
      categoryDataModules[cat]()
        .then((module) => {
          setShuffledAnswers(shuffleArray(module.default));
        })
        .catch((err) => {
          logger.error(`Failed to load data for category: ${cat}`, err);
          navigate('/lobby'); // Or show an error message
        });
    } else {
      logger.warn('Invalid or missing category in URL, redirecting to lobby.');
      navigate('/lobby'); // Redirect if category is invalid or not found
    }
  }, [location.search, navigate]);

  useEffect(() => {
    if (answer?.landmarksPath) {
      setCurrentAnswerLandmarks(null); // Reset while fetching new landmarks
      fetch(answer.landmarksPath)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch landmarks: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => setCurrentAnswerLandmarks(data))
        .catch((err) => {
          logger.error(
            `Failed to load landmarks from ${answer.landmarksPath}`,
            err,
          );
          setCurrentAnswerLandmarks(null); // Ensure it's null on error
        });
    } else {
      setCurrentAnswerLandmarks(null); // Clear landmarks if no answer or path
    }
  }, [answer]);

  useEffect(() => {
    // Use currentAnswerLandmarks instead of answer.landmarks
    if (currentAnswerLandmarks && webcam.poseLandmarkerResult?.landmarks[0]) {
      const currentTime = Date.now();
      // Only calculate if 100ms has passed since the last calculation
      if (currentTime - lastCalculationTimeRef.current >= 100) {
        const cosine = calculateCosineSimilarity(
          currentAnswerLandmarks, // Use fetched landmarks
          webcam.poseLandmarkerResult.landmarks[0],
        );
        cosineSimilarityRef.current = cosine; // Update ref instead of state
        lastCalculationTimeRef.current = currentTime; // Update the timestamp

        // Check similarity immediately after calculation
        if (isPlaying && !hasPassed) {
          const currentScore = Math.round(cosine * 100);
          logger.log('Checking similarity:', currentScore);

          if (currentScore >= 85) {
            // If this is the first time reaching 85+, record the start time
            if (highScoreStartTimeRef.current === null) {
              highScoreStartTimeRef.current = currentTime;
            }

            // Check if we've maintained the score for at least 500ms
            const highScoreDuration =
              currentTime - highScoreStartTimeRef.current;
            if (highScoreDuration >= 500) {
              highScoreStartTimeRef.current = null;
              setLastPassedScore(currentScore);
              setHasPassed(true);
              send({ type: 'pass', score: currentScore });
            }

            setScore(currentScore); // Update the score state
          } else {
            setScore(currentScore); // Update the score state
            // Reset the tracking if the score drops below 85
            highScoreStartTimeRef.current = null;
          }
        }
      }
    }
  }, [
    webcam.poseLandmarkerResult,
    currentAnswerLandmarks,
    isPlaying,
    hasPassed,
    send,
  ]);

  useEffect(() => {
    if (isPlaying) {
      setHintTime(Date.now());
    } else {
      setHintTime(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isGameOver && category) {
      // Ensure category is available
      const postScore = async () => {
        try {
          const response = await fetch(`/api/rankings/${category}/scores`, {
            // Dynamic category in URL
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id,
              score: state.context.score,
              username: nickname,
              category: category, // Dynamic category in body
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to record score');
          }

          logger.log('Score recorded successfully');
        } catch (error) {
          logger.error('Error recording score:', error);
        }

        navigate('/result');
      };
      postScore();
    }
  }, [isGameOver, navigate, state.context.score, id, nickname, category]); // Add category to dependencies

  useEffect(() => {
    if (hintTime === null || scoreReaction !== null) return;

    let animationFrameId: number;

    const updateTimer = () => {
      const elapsedTime = Date.now() - hintTime;
      const remainingTime = Math.max(0, hintDuration - elapsedTime);

      // Calculate progress rate (0-1)
      const newRate = 1 - remainingTime / hintDuration;
      setProgressRate(newRate);

      if (remainingTime <= 0) {
        setHintTime(Date.now());

        // if (!hasPassed) {
        //   setMissed(true); // 점수 통과 못 했으면 missed true 설정
        // }

        setHasPassed(false);
        send({ type: 'next' });
      } else {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hintTime, scoreReaction, send]);

  useEffect(() => {
    if (lastPassedScore !== null) {
      setScoreReaction(lastPassedScore);
      const timeout = setTimeout(() => {
        setScoreReaction(null);
        send({ type: 'next' });
        setLastPassedScore(null);
        setHasPassed(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [lastPassedScore, send]);

  useEffect(() => {
    if (remainingTiles === 0 && score < 85) {
      setScoreReaction(0);
      setTimeout(() => {
        setScoreReaction(null);
        send({ type: 'next' });
      }, 1000);
    }
  }, [remainingTiles, score, send]); // Changed lastPassedScore to score as per original logic context

  // Calculate similarity percentage value
  const similarityPercentage =
    cosineSimilarityRef.current !== null
      ? Math.round(cosineSimilarityRef.current * 100)
      : null;

  return (
    <div>
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '50px',
          padding: '16px 20px',
          borderRadius: '999px',
          backgroundColor: '#ffffff',
          boxShadow: 'md',
          zIndex: 10,
        }}
        className="home-button"
      >
        <img src={home} alt="homeButtom" style={{ marginBottom: '8px' }} />
      </Link>
      <div
        className={css({
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          left: '0',
          top: '0',
          bgSize: 'cover',
          bgPosition: 'center',
        })}
        style={{ backgroundImage: `url(${bg1})` }}
      />
      <div
        className={hstack({
          gap: '12',
          justify: 'center',
          position: 'relative',
          width: '100vw',
          height: '100vh',
          px: '12',
          py: '16',
        })}
      >
        {/* left column */}
        <div className={vstack({ gap: '4', height: '100%' })}>
          <div
            className={css({
              display: 'inline-flex',
              px: '8',
              py: '2',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'full',
              border: '1px solid',
              borderColor: 'white',
              textStyle: '2xl',
              fontWeight: 'bold',
              color: 'white',
              backdropFilter: 'auto',
              backdropBlur: '2xl',
              bgColor: 'rgba(0, 0, 0, 0.1)',
            })}
          >
            Round {state.context.round + 1}
          </div>
          <div
            className={css({
              flex: '1',
              borderRadius: '2xl',
              border: '1px solid',
              borderColor: 'white',
              width: '600px',
              overflow: 'hidden',
              position: 'relative',
              bgColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'auto',
              backdropBlur: 'md',
            })}
          >
            {answer?.image ? (
              <img
                src={answer.image}
                width="100%"
                alt=""
                className={css({
                  position: 'absolute',
                  inset: 0,
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  transform: 'scaleX(-1)',
                })}
              />
            ) : (
              <div
                className={css({
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  color: 'white',
                })}
              >
                Loading image...
              </div>
            )}
            {answer && (
              <Hint
                key={`${category}-${state.context.round}`}
                hint={state.context.hint}
              />
            )}
          </div>
        </div>
        {/* middle column */}
        <div className={vstack({ gap: '4', height: '100%' })}>
          <div
            className={vstack({
              alignItems: 'center',
              gap: '1',
              width: '80%',
              py: '6',
              bgColor: 'white',
              borderRadius: '16px',
              textStyle: '3xl',
            })}
          >
            Score
            <div
              className={css({
                textStyle: '6xl',
                fontWeight: 'bold',
                marginTop: '12px',
              })}
            >
              {state.context.score}
            </div>
          </div>
          <div
            className={vstack({
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1',
              width: '300px',
              flex: '1',
              position: 'relative',
            })}
          >
            {(isPlaying || scoreReaction !== null) && (
              <>
                <SimilarityBoard
                  rate={progressRate}
                  similarity={similarityPercentage}
                />
                {typeof scoreReaction === 'number' && (
                  <div
                    className={css({
                      position: 'absolute',
                      top: '28%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontWeight: 'bold',
                      fontSize: scoreReaction === 0 ? '6xl' : '7xl',
                      color: scoreReaction === 0 ? '#FF6701' : 'black',
                      animation: 'floatUpFade 1s forwards',
                      animationDelay: '0.3s',
                      pointerEvents: 'none',
                      zIndex: 5,
                    })}
                  >
                    {scoreReaction === 0 ? 'Miss' : `+${scoreReaction}`}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        {/* right column */}
        <div className={vstack({ gap: '4', height: '100%' })}>
          <div
            className={css({
              display: 'inline-flex',
              px: '8',
              py: '2',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'full',
              border: '1px solid',
              borderColor: 'white',
              textStyle: '2xl',
              fontWeight: 'bold',
              color: 'white',
              backdropFilter: 'auto',
              backdropBlur: '2xl',
              bgColor: 'rgba(0, 0, 0, 0.1)',
            })}
          >
            {nickname}
          </div>
          <div
            className={css({
              flex: '1',
              borderRadius: '2xl',
              border: '1px solid',
              borderColor: 'white',
              width: '600px',
              overflow: 'hidden',
              bgColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'auto',
              backdropBlur: 'md',
            })}
          >
            <WebcamPlayer />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
