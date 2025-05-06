import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { Link } from 'react-router';
import home from '../images/home.svg';
import { motion } from 'motion/react';

const backgroundStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100vw',
});

const titleStyle = css({
  justifyContent: 'center',
  textAlign: 'center',
  width: '40%',
  padding: '20px 0',
  marginBottom: '32px',
  textStyle: '3xl',
  fontWeight: 'semibold',
  background:
    'linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)',
});

const categoryCard = css({
  display: 'flex',
  flexDirection: 'row',
  gap: '20px',
  alignItems: 'baseline',
  // width: '49%', // Remove or adjust width
  width: '100%', // Let the grid control the width
  height: '36.6vh',
  bgSize: 'cover',
  bgPosition: 'center',
  borderRadius: '2xl',
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

  return (
    <>
      <Link
        to="/"
        style={{
          position: 'fixed',
          bottom: '70px',
          right: '50px',
          padding: '16px 20px',
          borderRadius: '12px',
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
            blur: '3xl',
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
          <div className={titleStyle}>
            플레이 하고 싶은 카테고리를 선택하세요
          </div>
          <motion.div // Wrap container with motion.div
            className={css({
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
              width: '80%',
              margin: '0 auto',
              color: 'white',
            })}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <MotionLink // Use MotionLink
              to="/game"
              className={categoryCard}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.0)), url(${bg1})`,
              }}
              variants={itemVariants} // Apply item variants
              whileHover={{ scale: 1.05 }} // Add hover effect
            >
              <div className={categoryName}>스포츠</div>
              <div className={categoryNameEng}>Sports</div>
            </MotionLink>

            <motion.div // Wrap div with motion.div
              className={categoryCard}
              style={{ backgroundColor: '#828282' }}
              variants={itemVariants} // Apply item variants
              whileHover={{ scale: 1.05 }} // Add hover effect
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng} />
            </motion.div>

            <motion.div // Wrap div with motion.div
              className={categoryCard}
              style={{ backgroundColor: '#828282' }}
              variants={itemVariants} // Apply item variants
              whileHover={{ scale: 1.05 }} // Add hover effect
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng} />
            </motion.div>

            <motion.div // Wrap div with motion.div
              className={categoryCard}
              style={{ backgroundColor: '#828282' }}
              variants={itemVariants} // Apply item variants
              whileHover={{ scale: 1.05 }} // Add hover effect
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
