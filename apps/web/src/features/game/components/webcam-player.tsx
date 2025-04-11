import { useEffect, useRef } from 'react';
import { useWebcam } from 'src/features/webcam/context';
import { logger } from 'src/utils/logger';
import { css } from '~styled-system/css';

export function WebcamPlayer() {
  const webcam = useWebcam();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = webcam.stream;
    }
  }, [webcam.stream]);

  useEffect(() => {
    const drawMask = () => {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      if (canvas && video) {
        const ctx = canvas.getContext('2d');
        const segmentationMask =
          webcam.poseLandmarkerResult?.segmentationMasks?.[0];

        if (ctx && segmentationMask) {
          // --- 1. 마스크 크기 가져오기 ---
          const maskWidth = segmentationMask.width;
          const maskHeight = segmentationMask.height;

          if (maskWidth === 0 || maskHeight === 0) {
            animationFrameRef.current = requestAnimationFrame(drawMask);
            return;
          }

          // --- 2. 대상 캔버스 및 컨텍스트 준비 ---
          canvas.width = maskWidth;
          canvas.height = maskHeight;

          // --- 3. 먼저 캔버스에 비디오 프레임 그리기 ---
          ctx.save();
          // 비디오를 미러링하여 그리기 (scaleX(-1) 효과)
          ctx.scale(-1, 1);
          ctx.drawImage(video, -maskWidth, 0, maskWidth, maskHeight);
          ctx.restore();

          // --- 4. 이미지 데이터 가져오기 ---
          const imageData = ctx.getImageData(0, 0, maskWidth, maskHeight);
          const pixelData = imageData.data;

          // --- 5. 마스크 데이터 가져오기 ---
          let maskBuffer: Float32Array | Uint8Array;
          let maskType = '';

          try {
            if (segmentationMask.hasFloat32Array()) {
              maskBuffer = segmentationMask.getAsFloat32Array();
              maskType = 'float32';
            } else if (segmentationMask.hasUint8Array()) {
              maskBuffer = segmentationMask.getAsUint8Array();
              maskType = 'uint8';
            } else if (segmentationMask.hasWebGLTexture()) {
              maskBuffer = segmentationMask.getAsFloat32Array();
              maskType = 'float32';
            } else {
              logger.error('마스크 데이터를 Array 형태로 가져올 수 없습니다.');
              animationFrameRef.current = requestAnimationFrame(drawMask);
              return;
            }

            // --- 6. 마스크 적용 (마스크가 없는 영역은 투명하게) ---
            const threshold = 0.5;

            for (let y = 0; y < maskHeight; ++y) {
              for (let x = 0; x < maskWidth; ++x) {
                // 원래 순서대로의 인덱스
                const i = y * maskWidth + x;

                // 좌우 반전된 인덱스 (x 좌표만 반전)
                const mirroredX = maskWidth - 1 - x;
                const mirroredIndex = y * maskWidth + mirroredX;

                let maskValue = maskBuffer[i];

                if (maskType === 'uint8') {
                  maskValue = maskValue / 255.0;
                }

                // 마스크가 없는 영역은 알파 값을 0으로 설정
                if (maskValue <= threshold) {
                  // 반전된 위치의 픽셀을 투명하게 설정
                  const pixelIndex = mirroredIndex * 4;
                  pixelData[pixelIndex + 3] = 0; // 알파 채널
                }
              }
            }

            // --- 7. 수정된 이미지 데이터를 캔버스에 다시 그리기 ---
            ctx.putImageData(imageData, 0, 0);
          } catch (error) {
            logger.error('마스크 처리 또는 렌더링 중 오류 발생:', error);
          }
        }
      }

      // Continue the animation loop
      animationFrameRef.current = requestAnimationFrame(drawMask);
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(drawMask);

    // Clean up animation frame on unmount
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [webcam.poseLandmarkerResult]);

  return (
    <div
      className={css({
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      })}
    >
      {/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          transform: 'scaleX(-1)',
          display: 'none', // 비디오 요소 숨기기
        })}
      />
      <canvas
        ref={canvasRef}
        className={css({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 99,
        })}
      />
    </div>
  );
}
