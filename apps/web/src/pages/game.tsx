import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';
import { hstack, vstack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'src/features/game/machine';
import { Hint } from 'src/features/game/components/hint';
import { CircularProgressBar } from '../features/game/components/circular-progress-bar';
import { inspect } from '../features/devtool/inspector';
import { useWebcam } from 'src/features/webcam/context';
import { WebcamPlayer } from 'src/features/game/components/webcam-player';
import {
  // calculateAngleSimilarity,
  // calculateCombinedSimilarity,
  // calculateDistanceSimilarity,
  // getPoseAngles,
  calculateCosineSimilarity,
} from 'src/pose/landmarks';
import { useNickname } from 'src/features/nickname/context';

import answers from '../data/1-sports';
import { Link, useNavigate } from 'react-router';
import home from '../images/home.png';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Shuffle answers once when the module loads
const shuffledAnswers = shuffleArray(answers);

function Game() {
  // const [combinedSimilarity, setCombinedSimilarity] = useState<number | null>(
  //   null,
  // );
  const [cosineSimilarity, setCosineSimilarity] = useState<number | null>(null);
  const [progressRate, setProgressRate] = useState(0);
  const webcam = useWebcam();
  const navigate = useNavigate();
  const { nickname } = useNickname();

  const [state, send] = useMachine(gameMachine, { inspect });

  const answer = shuffledAnswers[state.context.round];

  useEffect(() => {
    if (answer?.landmarks && webcam.poseLandmarkerResult?.landmarks[0]) {
      // const distance = calculateDistanceSimilarity(
      //   answer.landmarks,
      //   webcam.poseLandmarkerResult.landmarks[0],
      // );
      // const answerAngles = getPoseAngles(answer.landmarks);
      // const userAngles = getPoseAngles(
      //   webcam.poseLandmarkerResult.landmarks[0],
      // );
      // const angle = calculateAngleSimilarity(answerAngles, userAngles);
      // const combined = calculateCombinedSimilarity(distance, angle);
      // setCombinedSimilarity(combined);

      const cosine = calculateCosineSimilarity(
        answer.landmarks,
        webcam.poseLandmarkerResult.landmarks[0],
      );
      setCosineSimilarity(cosine); // cosineSimilarity 상태 업데이트
    }
  }, [webcam.poseLandmarkerResult, answer]);

  const [hintTime, setHintTime] = useState<number | null>(null);
  const hintDuration = 3000;

  const isPlaying = state.matches('playing');
  const isGameOver = state.matches('gameOver');

  // combinedSimularity 전부 cosineSimilarity로 대체
  // Add effect to check similarity score and send pass event when high enough
  useEffect(() => {
    if (isPlaying && cosineSimilarity !== null) {
      const checkSimilarity = () => {
        const score = Math.round(cosineSimilarity * 100);
        console.log('Checking similarity:', score);
        if (score >= 85) {
          console.log('Sending pass event', score);
          send({ type: 'pass', score });
        }
      };

      // Check immediately
      checkSimilarity();

      // Set up interval to check periodically
      const intervalId = setInterval(checkSimilarity, 500);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [isPlaying, cosineSimilarity, send]);

  useEffect(() => {
    if (isPlaying) {
      setHintTime(Date.now());
    } else {
      setHintTime(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (isGameOver) {
      // Post the score to the leaderboard API
      const postScore = async () => {
        try {
          const response = await fetch('/api/rankings/sports/scores', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              score: state.context.score,
              username: nickname,
              category: 'sports',
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to record score');
          }

          console.log('Score recorded successfully');
        } catch (error) {
          console.error('Error recording score:', error);
        }

        // Navigate to result page after recording score
        navigate('/result');
      };

      postScore();
    }
  }, [isGameOver, navigate, state.context.score, nickname]);

  useEffect(() => {
    if (hintTime === null) return;

    let animationFrameId: number;

    const updateTimer = () => {
      const elapsedTime = Date.now() - hintTime;
      const remainingTime = Math.max(0, hintDuration - elapsedTime);

      // Calculate progress rate (0-1)
      const newRate = 1 - remainingTime / hintDuration;
      setProgressRate(newRate);

      if (remainingTime <= 0) {
        setHintTime(Date.now());
        send({ type: 'next' });
      } else {
        animationFrameId = requestAnimationFrame(updateTimer);
      }
    };

    animationFrameId = requestAnimationFrame(updateTimer);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hintTime, send]);

  // Calculate similarity percentage value
  const similarityPercentage =
    cosineSimilarity !== null ? Math.round(cosineSimilarity * 100) : null;

  return (
    <div>
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '50px',
          padding: '16px 20px',
          borderRadius: '12px',
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
        style={{
          backgroundImage: `url(${bg1})`,
        }}
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
                transform: 'scaleX(-1)', // Flip horizontally (mirror effect)
              })}
            />

            <Hint hint={state.context.hint} />
          </div>
        </div>
        <div className={vstack({ gap: '4', height: '100%' })}>
          <div
            className={vstack({
              alignItems: 'center',
              gap: '1',
              px: '12',
              py: '4',
              bgColor: 'white',
              borderRadius: 'xl',
            })}
          >
            Score
            <div className={css({ textStyle: '2xl', fontWeight: 'bold' })}>
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
            })}
          >
            {hintTime !== null ? (
              <CircularProgressBar
                rate={progressRate}
                similarity={similarityPercentage}
              />
            ) : null}
          </div>
        </div>
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
            {/* <Player /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
