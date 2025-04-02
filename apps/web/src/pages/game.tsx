import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';
import { Player } from 'src/game/player';
import { answerLandmarker } from 'src/features/webcam/pose-landmarker';
import { css } from '~styled-system/css';
import { hstack, vstack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { useMachine } from '@xstate/react';
import { gameMachine } from 'src/features/game/machine';
import { Hint } from 'src/game/hint';
import { CircularProgressBar } from '../game/circular-progress-bar';
import { inspect } from '../features/devtool/inspector';
import { useWebcam } from 'src/features/webcam/context';

function Game() {
  const [answerPose, setAnswerPose] = useState<PoseLandmarkerResult | null>(
    null,
  );

  const webcam = useWebcam();

  useEffect(() => {
    if (answerPose?.landmarks[0] && webcam.poseLandmarkerResult?.landmarks[0]) {
      // const distanceSimilarity = calculateDistanceSimilarity(
      //   answerPose.landmarks[0],
      //   webcam.poseLandmarkerResult.landmarks[0],
      // );
      // // console.log('distanceSimilarity:', distanceSimilarity);
      // const answerAngles = getPoseAngles(answerPose.landmarks[0]);
      // const userAngles = getPoseAngles(
      //   webcam.poseLandmarkerResult.landmarks[0],
      // );
      // const angleSimilarity = calculateAngleSimilarity(
      //   answerAngles,
      //   userAngles,
      // );
      // console.log('angleSimilarity:', angleSimilarity);
      // const combinedSimilarity = calculateCombinedSimilarity(
      //   distanceSimilarity,
      //   angleSimilarity,
      // );
      // console.log('combinedSimilarity:', combinedSimilarity);
    }
  }, [webcam.poseLandmarkerResult, answerPose]);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const poseLandmarkerResult = answerLandmarker.detect(event.currentTarget);
    setAnswerPose(poseLandmarkerResult);
  };

  const [state, send] = useMachine(gameMachine, { inspect });

  const [hintTime, setHintTime] = useState<number | null>(null);
  const hintDuration = 1000;

  const isPlaying = state.matches('playing');

  useEffect(() => {
    if (isPlaying) {
      setHintTime(Date.now());
    } else {
      setHintTime(null);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (hintTime === null) return;

    let animationFrameId: number;

    const updateTimer = () => {
      const elapsedTime = Date.now() - hintTime;
      const remainingTime = Math.max(0, hintDuration - elapsedTime);

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

  return (
    <div>
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
              src="./00008.jpg"
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
              })}
              onLoad={handleLoad}
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
              gap: '1',
              px: '12',
              py: '4',
              borderRadius: 'xl',
              backdropFilter: 'auto',
              backdropBlur: '2xl',
              bgColor: 'rgba(0, 0, 0, 0.3)',
              mt: '200px',
            })}
          >
            <div
              className={css({
                color: 'white',
                fontWeight: 'bold',
                textStyle: 'lg',
              })}
            >
              Time Left
            </div>
            {hintTime !== null ? (
              <CircularProgressBar
                hintTime={hintTime}
                hintDuration={hintDuration}
                onFinish={() => send({ type: 'next' })}
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
            Player 1
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
            <Player />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
