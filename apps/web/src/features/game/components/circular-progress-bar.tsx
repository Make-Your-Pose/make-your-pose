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

  // 메시지
  let message = "조금만 더!";
  if (similarity && similarity >= 90) message = "완벽해요!";
  else if (similarity && similarity >= 80) message = "거의 비슷해요!";

  return (
    <div
      className={css({
        position: 'relative',
        width: '350px',
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
        {/* <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="10"
        /> */}
        {/* Foreground circle (progress) */}
        {/* <circle
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="white"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        /> */}
      </svg>

      {/* Add similarity percentage in the center */}
      {similarity !== undefined && similarity !== null && (
        <div
          className={css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -100%)',
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '120px',
          })}
        >
          {similarity}%
        </div>
      )}
      <div
        className={
          css({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, 0%)',
            justifyContent: "center",
            textAlign: "center",
            width: "100%",
            padding: "20px 0",
            textStyle: "3xl",
            fontWeight: "semibold",
            background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.75) 8%, rgba(255, 255, 255, 0.90) 50%, rgba(255, 255, 255, 0.75) 92%, rgba(255, 255, 255, 0.00) 100%)",
          })
        }>
        {message}
      </div>
    </div>
  );
};
