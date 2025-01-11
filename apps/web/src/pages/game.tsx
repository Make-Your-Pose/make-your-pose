import type { PoseLandmarkerResult } from '@mediapipe/tasks-vision';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Player from 'src/game/player';
import {
  calculateAngleSimilarity,
  calculateCombinedSimilarity,
  calculateDistanceSimilarity,
  getPoseAngles,
} from 'src/pose/landmarks';
import { useWebcam } from 'src/webcam/context';
import { answerLandmarker } from 'src/webcam/pose-landmarker';
import { css, cx } from '~styled-system/css';
import { container, hstack } from '~styled-system/patterns';

function Game() {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [answerPose, setAnswerPose] = useState<PoseLandmarkerResult | null>(
    null,
  );

  const webcam = useWebcam();

  useEffect(() => {
    if (answerPose?.landmarks[0] && webcam.poseLandmarkerResult?.landmarks[0]) {
      const distanceSimilarity = calculateDistanceSimilarity(
        answerPose.landmarks[0],
        webcam.poseLandmarkerResult.landmarks[0],
      );
      console.log('distanceSimilarity:', distanceSimilarity);

      const answerAngles = getPoseAngles(answerPose.landmarks[0]);
      const userAngles = getPoseAngles(
        webcam.poseLandmarkerResult.landmarks[0],
      );
      const angleSimilarity = calculateAngleSimilarity(
        answerAngles,
        userAngles,
      );
      console.log('angleSimilarity:', angleSimilarity);

      const combinedSimilarity = calculateCombinedSimilarity(
        distanceSimilarity,
        angleSimilarity,
      );
      console.log('combinedSimilarity:', combinedSimilarity);
    }
  }, [webcam.poseLandmarkerResult, answerPose]);

  // useEffect(() => {
  //   console.log(webcam.stream);
  // }, [webcam.stream]);

  // useEffect(() => {
  //   const canvas = canvasRef.current;
  //   const context = canvas?.getContext('2d');

  //   const render = async () => {
  //     if (video && context && canvas) {
  //       context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //       await poseLandmarker.setOptions({ runningMode: 'VIDEO' });
  //       const result = poseLandmarker.detectForVideo(
  //         video,
  //         startTimeMs.current,
  //       );

  //       const drawingUtils = new DrawingUtils(context);
  //       for (const landmark of result.landmarks) {
  //         drawingUtils.drawLandmarks(landmark, {
  //           // biome-ignore lint/style/noNonNullAssertion: <explanation>
  //           radius: (data) => DrawingUtils.lerp(data.from!.z, -0.15, 0.1, 5, 1),
  //         });
  //         drawingUtils.drawConnectors(
  //           landmark,
  //           PoseLandmarker.POSE_CONNECTIONS,
  //         );
  //       }

  //       requestAnimationFrame(render);
  //     }
  //   };

  //   render();

  //   return () => {
  //     if (streamRef.current) {
  //       for (const track of streamRef.current.getTracks()) {
  //         track.stop();
  //       }
  //     }
  //   };
  // }, []);

  const addScore = () => {
    setScore(score + 100);
  };

  const endGame = () => {
    navigate('/result', { state: { score: score } });
  };

  // const handleImageLoad: React.ReactEventHandler<HTMLImageElement> = async (
  //   event,
  // ) => {
  //   await poseLandmarker.setOptions({ runningMode: 'IMAGE' });
  //   const answerResult = poseLandmarker.detect(event.currentTarget);
  //   setAnswerPose(answerResult);
  //   console.log('Answer result:', answerResult);
  // };

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = (event) => {
    const poseLandmarkerResult = answerLandmarker.detect(event.currentTarget);
    setAnswerPose(poseLandmarkerResult);
  };

  return (
    <div className={container()}>
      <Player />
      <div className={css({ position: 'relative' })}>
        <img src="./00008.jpg" width="100%" alt="" onLoad={handleLoad} />
      </div>
      <div className={cx(hstack(), css({ my: '8' }))}>
        <button
          type="button"
          className={css({
            bg: 'blue.500',
            p: '2',
          })}
          onClick={addScore}
        >
          Add 100 to Score
        </button>
        <button
          type="button"
          className={css({
            bg: 'blue.500',
            p: '2',
          })}
          onClick={endGame}
        >
          End
        </button>
      </div>
      <div>Score: {score}</div>
    </div>
  );
}

export default Game;
