import { css } from '~styled-system/css';

// Circular progress bar component
export const CircularProgressBar = ({
  rate,
  similarity,
}: {
  rate: number; // 0-1
  similarity?: number | null;
}) => {
  const radius = 145;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - rate * circumference;

  return (
    <div
      className={css({
        position: 'relative',
        width: '300px',
        height: '300px',
      })}
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
      <svg
        className={css({
          transform: 'rotate(-90deg)',
          width: '100%',
          height: '100%',
        })}
        viewBox="0 0 300 300"
      >
        {/* Background circle */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="10"
        />
        {/* Foreground circle (progress) */}
        <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>

      {/* Add similarity percentage in the center */}
      {similarity !== undefined && similarity !== null && (
        <div
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '100px',
          })}
        >
          {similarity}%
        </div>
      )}
    </div>
  );
};
