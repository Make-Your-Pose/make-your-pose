import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import bg1 from '../images/bg-stage-dimmed.jpg';
import category1 from '../images/bg-1.png'; // Assuming bg-1.png can be used for yoga too, or a new bg-2.png could be imported
import { Link } from 'react-router';
import home from '../images/home.svg';
import { motion } from 'motion/react';
import CircleLineLeft from 'src/features/game/components/circle-line-left';
import CircleLineRight from 'src/features/game/components/circle-line-right';
import { useEffect, useRef } from 'react';
import { playSound } from '../utils/playSound';

const backgroundStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100vw',
});

const titleStyle = css({
  textStyle: '4xl',
  fontWeight: 'semibold',
  textAlign: 'center',
  justifyContent: 'center',
  color: '#FFFFFF',
});

const categoryCard = css({
  display: 'flex',
  flexDirection: 'row',
  gap: '30px',
  alignItems: 'baseline',
  // width: '49%', // Remove or adjust width
  width: '100%', // Let the grid control the width
  height: '36.6vh',
  bgSize: 'cover',
  bgPosition: 'center',
  borderRadius: '24px',
  padding: '32px',
});

const categoryName = css({
  textStyle: '5xl',
  fontWeight: 'bold',
  mb: '4',
});

const categoryNameEng = css({
  textStyle: '2xl',
  fontWeight: 'bold',
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger effect delay
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

function Lobby() {
  // Convert Link to a motion component
  const MotionLink = motion(Link);
  const bgmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    playSound('/sounds/bgm_lobby.mp3').then((audio) => {
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
    <>
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '50px',
          padding: '16px 20px',
          borderRadius: '999px',
          backgroundColor: '#ffffff',
          boxShadow: 'md',
          zIndex: 10,
        }}
        className="home-button"
      >
        <img src={home} alt="homeButtom" style={{ marginBottom: '8px' }} />
      </Link>
      <div className={backgroundStyle}>
        <div
          className={css({
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            left: '0',
            top: '0',
            bgSize: 'cover',
            bgPosition: 'center',
            filter: 'auto',
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
            marginTop: '70px',
          })}
        >
          <div
            className={css({
              display: 'flex',
              gap: '32px',
              marginBottom: '5vh',
              alignItems: 'center',
            })}
          >
            <CircleLineLeft />
            <div className={titleStyle}>
              플레이 하고 싶은 카테고리를 선택하세요
            </div>
            <CircleLineRight />
          </div>
          <motion.div // Wrap container with motion.div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '32px',
              width: '80%',
              margin: '0 auto',
              color: 'white',
            })}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionLink
              to="/game?category=sports"
              className={categoryCard}
              style={{
                backgroundImage: `linear-gradient(1deg, rgba(255, 103, 1, 0.00) 0.63%, rgba(255, 103, 1, 0.05) 60%, #FF6701 84.65%), url(${category1})`,
              }}
              variants={itemVariants}
              whileFocus={{
                scale: 1.05,
                transition: { duration: 0.2 },
                // Play navigation sound on focus
                onAnimationStart: () => playSound('/sounds/sfx_cat_nav.mp3'),
              }}
              onClick={() => playSound('/sounds/sfx_cat_select.mp3')}
            >
              <div className={categoryName}>스포츠</div>
              <div className={categoryNameEng}>Sports</div>
            </MotionLink>

            <MotionLink // Use MotionLink for Yoga
              to="/game?category=yoga" // Pass category
              className={categoryCard}
              style={{
                // Example: Green gradient for Yoga, using category1 image
                backgroundImage: `linear-gradient(1deg, rgba(255, 103, 1, 0.00) 0.63%, rgba(255, 103, 1, 0.05) 60%, #FF6701 84.65%), url(${category1})`,
              }}
              variants={itemVariants} // Apply item variants
              whileFocus={{
                scale: 1.05,
                transition: { duration: 0.2 },
                onAnimationStart: () => playSound('/sounds/sfx_cat_nav.mp3'),
              }}
              onClick={() => playSound('/sounds/sfx_cat_select.mp3')}
            >
              <div className={categoryName}>요가</div>
              <div className={categoryNameEng}>Yoga</div>
            </MotionLink>

            <motion.div // Wrap div with motion.div - Placeholder or future category
              className={categoryCard}
              style={{
                backgroundImage: `linear-gradient(1deg, rgba(255, 103, 1, 0.00) 0.63%, rgba(255, 103, 1, 0.05) 60%, #FF6701 84.65%), url(${category1})`,
              }}
              variants={itemVariants} // Apply item variants
              whileFocus={{ scale: 1.05 }} // Add focus effect
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng} />
            </motion.div>

            <motion.div // Wrap div with motion.div - Placeholder or future category
              className={categoryCard}
              style={{
                backgroundImage: `linear-gradient(1deg, rgba(255, 103, 1, 0.00) 0.63%, rgba(255, 103, 1, 0.05) 60%, #FF6701 84.65%), url(${category1})`,
              }}
              variants={itemVariants} // Apply item variants
              whileFocus={{ scale: 1.05 }} // Add focus effect
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default Lobby;
