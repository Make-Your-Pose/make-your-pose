import { css } from '~styled-system/css';
import bg1 from '../images/bg-1.png';
import { hstack, vstack } from '~styled-system/patterns';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import home from '../images/home.svg';
import { logger } from 'src/utils/logger';
import { useNickname } from 'src/features/nickname/context';

// Type for the data items
type RankingItem = {
  ID: string;
  Username: string;
  Score: number;
};

const button = css({
  display: 'flex',
  width: '100%',
  height: '90px',
  padding: '16px 24px',
  gap: '12px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  backgroundColor: '#eeeeee',
  marginTop: '30px',
  fontSize: '4xl',
  fontWeight: 'semibold',
});

function Result() {
  const [data, setData] = useState<RankingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { id, regenerateNickname } = useNickname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/rankings/sports');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        logger.error('Error fetching ranking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
            {isLoading ? (
              <div
                className={css({ color: 'white', p: '4', textAlign: 'center' })}
              >
                Loading data...
              </div>
            ) : (
              data.map((item, index) => (
                <div
                  key={item.ID}
                  className={hstack({
                    p: '4',
                    borderBottom: '1px solid',
                    borderColor: 'white',
                    color: 'white',
                    backgroundColor:
                      id === item.ID
                        ? 'rgba(255, 255, 255, 0.1)'
                        : 'transparent',
                  })}
                >
                  <div className={css({ px: '2', fontWeight: 'bold' })}>
                    {index + 1}
                  </div>
                  <div className={css({ flex: 1, fontWeight: 'bold' })}>
                    {item.Username}
                  </div>
                  <div className={css({ fontWeight: 'bold' })}>
                    {item.Score}
                  </div>
                </div>
              ))
            )}
          </div>
          <Link className={button} to="/" onClick={() => regenerateNickname()}>
            <img src={home} style={{ width: '40px' }} />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Result;
