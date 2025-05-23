import { Link } from 'react-router';
import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import bg1 from '../images/bg-stage-blur.jpg';
import { useEffect, useRef } from 'react';
import { playSound } from 'src/utils/playSound';

const backgroundStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100vh',
  backgroundColor: 'gray',
});

const descriptionStyle = css({
  color: '#ffffff',
  textStyle: '4xl',
  textAlign: 'center',
  justifyContent: 'center',
});

const button = css({
  display: 'flex',
  width: '30vw',
  padding: '20px 24px',
  justifyContent: 'center',
  borderRadius: '20px',
  border: '4px solid transparent',
  backgroundColor: '#ffffff',
  color: '#FF6701',
  marginTop: '30px',
  fontSize: '5xl',
  fontFamily: 'GmarketSansBold',
  letterSpacing: '-0.02em',
  boxShadow: '0px 0px 40px 0px rgba(255, 103, 1, 0.8)',
});

function Home() {
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    playSound('/sounds/bgm_home.mp3').then((audio) => {
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
    <div className={backgroundStyle}>
      <div
        className={css({
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          left: '0',
          top: '0',
          bgSize: 'auto',
          bgPosition: 'center',
          filter: 'auto',
          backgroundSize: 'cover',
        })}
        style={{
          backgroundImage: `url(${bg1})`,
        }}
      />
      <div
        className={stack({
          position: 'relative',
          width: '100vw',
          left: '0',
          top: '0',
          alignItems: 'center',
          paddingInline: '0rem',
        })}
      >
        <div
          className={css({
            textStyle: '9xl',
            color: '#fff',
            fontFamily: 'GmarketSansBold',
            letterSpacing: '-0.03em',
            marginBottom: '11vh',
          })}
        >
          Make Your Pose
        </div>
        <Link className={button} to="/tutorial">
          START
        </Link>
        <div
          className={css({
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '40px',
            gap: '2px',
          })}
        >
          <div className={descriptionStyle}>포인터</div>
          <div
            className={css({
              width: '32px',
              height: '32px',
              backgroundColor: '#FF7E28',
              borderRadius: '999',
            })}
          />
          <div className={descriptionStyle}>
            를 START 버튼 위에 2초간 위치 시키세요
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
