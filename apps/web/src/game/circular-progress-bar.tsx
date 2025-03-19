import { useEffect, useState } from 'react';
import { css } from '~styled-system/css';

// Circular progress bar component
export const CircularProgressBar = ({
  value,
  maxValue,
  onFinish,
}: {
  value: number;
  maxValue: number;
  onFinish?: () => void;
}) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [remainingTime, setRemainingTime] = useState(maxValue);
  const strokeDashoffset =
    circumference - (remainingTime / maxValue) * circumference;

  useEffect(() => {
    // Set up interval to update every 0.01 seconds (10ms)
    const intervalId = setInterval(() => {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - value) / 1000; // Convert to seconds
      const remaining = Math.max(0, maxValue - elapsedTime);

      setRemainingTime(remaining);

      // If timer reached zero, call onFinish and clear interval
      if (remaining <= 0) {
        clearInterval(intervalId);
        if (onFinish) onFinish();
      }
    }, 10); // Update every 10ms for 0.01s precision

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [value, maxValue, onFinish]);

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
      <div
        className={css({
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1.5rem',
        })}
      >
        {remainingTime.toFixed(2)}
      </div>
    </div>
  );
};
