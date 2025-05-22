import { css } from '~styled-system/css';
import bg1 from '../images/bg-1.png';
import { hstack, vstack } from '~styled-system/patterns';
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import home from '../images/home.svg';
import { motion } from 'motion/react';
import { logger } from 'src/utils/logger';
import { useNickname } from 'src/features/nickname/context';
import { playSound } from '../utils/playSound';

// Type for the data items
type RankingItem = {
  ID: string;
  Username: string;
  Score: number;
};

// const dummyData: RankingItem[] = [
//   {
//     ID: '1',
//     Username: 'PlayerOne',
//     Score: 1500,
//   },
//   {
//     ID: '2',
//     Username: 'PlayerTwo',
//     Score: 1400,
//   },
//   {
//     ID: '3',
//     Username: 'PlayerThree',
//     Score: 1300,
//   },
//   {
//     ID: '4',
//     Username: 'PlayerFour',
//     Score: 1200,
//   },
//   {
//     ID: '5',
//     Username: 'PlayerFive',
//     Score: 1100,
//   },
//   {
//     ID: '6',
//     Username: 'PlayerSix',
//     Score: 1000,
//   },
//   {
//     ID: '7',
//     Username: 'PlayerSeven',
//     Score: 950,
//   },
//   {
//     ID: '8',
//     Username: 'PlayerEight',
//     Score: 900,
//   },
//   {
//     ID: '9',
//     Username: 'PlayerNine',
//     Score: 850,
//   },
//   {
//     ID: '10',
//     Username: 'PlayerTen',
//     Score: 800,
//   },
// ];

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const meItemRef = useRef<HTMLDivElement>(null);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  const { id, regenerateNickname } = useNickname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/rankings/sports');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const fetchedData = await response.json();

        const lastScore = sessionStorage.getItem('lastGameScore');
        const lastUsername = sessionStorage.getItem('lastGameUsername');

        // 사용자가 기록한 점수가 있을 경우, 리스트에 삽입
        if (lastScore && lastUsername) {
          const myScoreItem: RankingItem = {
            ID: 'me',
            Username: lastUsername,
            Score: Number(lastScore),
          };
          setData([myScoreItem, ...fetchedData]); // 새 배열 생성
        }
        setData(fetchedData);
      } catch (error) {
        logger.error('Error fetching ranking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!isLoading && meItemRef.current && scrollContainerRef.current) {
      meItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isLoading]);

  useEffect(() => {
    let isMounted = true;
    playSound('/sounds/bgm_result.mp3').then((audio) => {
      if (!isMounted) {
        audio.pause();
        audio.currentTime = 0;
        return;
      }
      audio.loop = true;
      audio.play();
      bgmRef.current = audio;
    });
    return () => {
      isMounted = false;
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current.currentTime = 0;
        bgmRef.current = null;
      }
    };
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
          {isLoading ? (
            <div
              className={css({
                flex: '1',
                borderRadius: '2xl',
                border: '1px solid',
                borderColor: 'white',
                width: '500px',
                overflowY: 'auto',
                bgColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'auto',
                backdropBlur: '2xl',
                px: '8',
                py: '4',
              })}
            >
              <div
                className={css({
                  color: 'white',
                  p: '4',
                  textAlign: 'center',
                  fontSize: '2xl',
                })}
              >
                Loading data...
              </div>
            </div>
          ) : (
            <motion.div
              ref={scrollContainerRef}
              className={css({
                flex: '1',
                borderRadius: '2xl',
                border: '1px solid',
                borderColor: 'white',
                width: '500px',
                overflowY: 'auto',
                bgColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'auto',
                backdropBlur: '2xl',
                px: '8',
                py: '4',
              })}
              initial={{ scale: 0.5, opacity: 0 }} // Start smaller and invisible
              animate={{ scale: 1, opacity: 1 }} // Animate to normal size and visible
              transition={{
                duration: 0.5,
                type: 'spring',
                bounce: 0.5,
              }} // Define animation duration and easing
            >
              {data.map((item, index) => {
                const isMe = item.ID === id;

                return (
                  <div
                    key={item.ID}
                    ref={isMe ? meItemRef : null}
                    className={css({
                      display: 'flex',
                      padding: '4',
                      borderBottom: '1px solid',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      fontSize: 'lg',
                      position: 'relative',
                      alignItems: 'center',
                    })}
                  >
                    <motion.div
                      className={hstack({ width: '100%' })}
                      animate={
                        isMe
                          ? { scale: [1, 1.05, 1], zIndex: 1 }
                          : { scale: 1, zIndex: 0 }
                      }
                      transition={
                        isMe
                          ? {
                              delay: 0.5,
                              duration: 0.5,
                              ease: 'easeInOut',
                              repeat: 3,
                              repeatType: 'mirror',
                            }
                          : {}
                      }
                    >
                      <div
                        className={css({
                          px: '4',
                          py: '2',
                          borderRadius: 'lg',
                          fontWeight: 'bold',
                          backgroundColor: isMe ? 'white' : 'transparent',
                          color: isMe ? 'black' : 'white',
                        })}
                      >
                        {isMe ? '나' : index + 1}
                      </div>
                      <div
                        className={css({
                          px: '4',
                          py: '2',
                          flex: 1,
                          borderRadius: 'lg',
                          fontWeight: 'bold',
                          backgroundColor: isMe ? 'white' : 'transparent',
                          color: isMe ? 'black' : 'white',
                        })}
                      >
                        {item.Username}
                      </div>
                      <div
                        className={css({
                          px: '4',
                          py: '2',
                          fontWeight: 'bold',
                          borderRadius: 'lg',
                          backgroundColor: isMe ? 'white' : 'transparent',
                          color: isMe ? 'black' : 'white',
                        })}
                      >
                        {item.Score}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          )}
          <Link
            className={button}
            to="/"
            onClick={() => {
              regenerateNickname();
            }}
          >
            <img src={home} style={{ width: '40px' }} />
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Result;
