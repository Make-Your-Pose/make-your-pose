import { css } from '~styled-system/css';
import bg1 from '../images/bg-1.png';
import { hstack, vstack } from '~styled-system/patterns';

const data = [
  {
    id: 'id1',
    username: 'heeryong',
    score: 2800,
  },
];

function Result() {
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
            Leaderboard
          </div>
          <div
            className={css({
              flex: '1',
              borderRadius: '2xl',
              border: '1px solid',
              borderColor: 'white',
              width: '500px',

              bgColor: 'rgba(0, 0, 0, 0.1)',
              backdropFilter: 'auto',
              backdropBlur: 'md',
            })}
          >
            {data.map((item, index) => (
              <div
                key={item.id}
                className={hstack({
                  p: '4',
                  borderBottom: '1px solid',
                  borderColor: 'white',
                  color: 'white',
                })}
              >
                <div className={css({ px: '2', fontWeight: 'bold' })}>
                  {index + 1}
                </div>
                <div className={css({ flex: 1, fontWeight: 'bold' })}>
                  {item.username}
                </div>
                <div className={css({ fontWeight: 'bold' })}>{item.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
