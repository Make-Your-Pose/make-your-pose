import { useEffect, useRef } from 'react';
import { useWebcam } from 'src/features/webcam/context';
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
      // drawMask called
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const segmentationMask =
          webcam.poseLandmarkerResult?.segmentationMasks?.[0];

        // Canvas available, segmentationMask: true/false

        if (ctx && segmentationMask) {
          // --- 1. 마스크 크기 가져오기 ---
          const maskWidth = segmentationMask.width;
          const maskHeight = segmentationMask.height;

          // Mask dimensions: maskWidth x maskHeight

          if (maskWidth === 0 || maskHeight === 0) {
            // 유효하지 않은 마스크 크기입니다.
            animationFrameRef.current = requestAnimationFrame(drawMask);
            return;
          }

          // --- 2. 대상 캔버스 및 컨텍스트 준비 ---
          canvas.width = maskWidth;
          canvas.height = maskHeight;
          // Canvas resized to match mask dimensions

          // --- 3. ImageData 생성 ---
          const imageData = ctx.createImageData(maskWidth, maskHeight);
          const pixelData = imageData.data; // Uint8ClampedArray (R, G, B, A 순서)
          // ImageData created

          // --- 4. 마스크 데이터 가져오기 (Array 형태로) ---
          let maskBuffer: Float32Array | Uint8Array;
          let maskType = '';

          try {
            // 마스크 처리 시작...
            if (segmentationMask.hasFloat32Array()) {
              // Float32Array 형식의 마스크 데이터 사용
              maskBuffer = segmentationMask.getAsFloat32Array();
              maskType = 'float32';
              // Float32Array retrieved, length: maskBuffer.length
            } else if (segmentationMask.hasUint8Array()) {
              // Uint8Array 형식의 마스크 데이터 사용
              maskBuffer = segmentationMask.getAsUint8Array();
              maskType = 'uint8';
              // Uint8Array retrieved, length: maskBuffer.length
            } else if (segmentationMask.hasWebGLTexture()) {
              // WebGLTexture에서 Float32Array로 변환 시도 중...
              maskBuffer = segmentationMask.getAsFloat32Array();
              maskType = 'float32';
              // WebGLTexture에서 변환 완료, length: maskBuffer.length
            } else {
              console.error('마스크 데이터를 Array 형태로 가져올 수 없습니다.');
              animationFrameRef.current = requestAnimationFrame(drawMask);
              return;
            }

            // 마스크 타입: maskType, 크기: maskWidth x maskHeight
            // --- 5. 픽셀 데이터 변환 및 채우기 ---
            const threshold = 0.5;
            const maskPixelColor = [255, 0, 0, 128];
            const backgroundColor = [0, 0, 0, 0];

            // 픽셀 데이터 변환 시작...
            for (let i = 0; i < maskWidth * maskHeight; ++i) {
              let maskValue = maskBuffer[i];

              if (maskType === 'uint8') {
                maskValue = maskValue / 255.0;
              }

              const isMaskPixel = maskValue > threshold;
              const color = isMaskPixel ? maskPixelColor : backgroundColor;

              const pixelIndex = i * 4;
              pixelData[pixelIndex] = color[0];
              pixelData[pixelIndex + 1] = color[1];
              pixelData[pixelIndex + 2] = color[2];
              pixelData[pixelIndex + 3] = color[3];
            }
            // 픽셀 데이터 변환 완료

            // --- 6. 캔버스에 그리기 ---
            // 캔버스에 마스크 데이터 그리기...
            ctx.putImageData(imageData, 0, 0);
            // 마스크 렌더링 완료
          } catch (error) {
            console.error('마스크 처리 또는 렌더링 중 오류 발생:', error);
          } finally {
            // 마스크 처리 완료
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
          transform: 'scaleX(-1)',
        })}
      />
    </div>
  );
}
