import { css } from '~styled-system/css';

// Circular progress bar component
export const SimilarityBoard = ({
  similarity,
}: {
  rate: number; // 0-1
  similarity?: number | null;
}) => {
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
            fontFamily: 'GmarketSansBold',
            textShadow: '0px 0px 12px rgba(255, 103, 1, 0.95)',
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
