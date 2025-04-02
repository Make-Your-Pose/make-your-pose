import { useEffect, useState, useRef } from 'react';
import { css } from '~styled-system/css';

// Circular progress bar component
export const CircularProgressBar = ({
  hintTime,
  hintDuration,
  onFinish,
}: {
  hintTime: number;
  hintDuration: number; // in milliseconds
  onFinish?: () => void;
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [remainingTime, setRemainingTime] = useState(hintDuration / 1000); // Convert ms to seconds
  const strokeDashoffset =
    circumference - (remainingTime / (hintDuration / 1000)) * circumference;

  // Add a ref for animation frame ID
  const animationFrameId = useRef<number | null>(null);

  // Reset remainingTime when hintTime changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setRemainingTime(hintDuration / 1000);
  }, [hintTime, hintDuration]);

  useEffect(() => {
    // Animation function using requestAnimationFrame
    const animate = () => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - hintTime) / 1000; // Convert to seconds
      const remaining = Math.max(0, hintDuration / 1000 - elapsedTime);

      setRemainingTime(remaining);

      // If timer reached zero, call onFinish and stop animation
      if (remaining <= 0) {
        if (onFinish) onFinish();
        return;
      }

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameId.current = requestAnimationFrame(animate);

    // Clean up animation on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [hintTime, hintDuration, onFinish]);

  return (
    <div
      className={css({
        position: 'relative',
        width: '120px',
        height: '120px',
      })}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg
        className={css({
          transform: 'rotate(-90deg)',
          width: '100%',
          height: '100%',
        })}
        viewBox="0 0 120 120"
      >
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="10"
        />
        {/* Foreground circle (progress) */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
