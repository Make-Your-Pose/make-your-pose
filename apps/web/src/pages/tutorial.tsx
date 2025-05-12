import { useEffect, useState, useRef } from 'react'; // Import useRef
import { Link } from 'react-router';
import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import { motion, AnimatePresence } from 'motion/react';
import tutorial1 from '../images/description_image_1.svg';
import tutorial2 from '../images/description_image_2.svg';
import tutorial3 from '../images/description_image_3.svg';
import rightChevron from '../images/right-arrow-chevron.svg';
import bg1 from '../images/bg-stage-dimmed.jpg';
import home from '../images/home.svg';
import CircleLineLeft from 'src/features/game/components/circle-line-left';
import CircleLineRight from 'src/features/game/components/circle-line-right';

const backgroundStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  height: '100vh',
  padding: '70px 0',
  textAlign: 'center',
  backgroundColor: 'gray',
});

const titleStyle = css({
  textStyle: '4xl',
  fontWeight: 'semibold',
  textAlign: 'center',
  justifyContent: 'center',
  color: '#FFFFFF',
});

const containerStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  gap: '48px',
  width: '60vw',
  height: '75vh',
});

const boxStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  flex: 1,
  height: '100%',
  padding: '40px',
  backgroundColor: 'white',
  borderRadius: '40px',
  boxShadow: 'lg',
  overflow: 'hidden', // Add overflow hidden to contain the animation
});

const textStyle = css({
  textAlign: 'center',
  fontSize: '4xl',
  fontWeight: 'semibold',
});

const button = css({
  display: 'flex',
  width: '100%',
  height: '100px',
  padding: '16px 24px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '24px',
  backgroundColor: '#eeeeee',
  marginTop: '30px',
  fontSize: '3xl',
  fontWeight: 'semibold',
});

const progressBarContainerStyle = css({
  height: '8px',
  backgroundColor: '#D9D9D9',
  borderRadius: '4px',
  overflow: 'hidden',
  marginTop: '20px', // Add some space above the progress bar
});

const progressBarStyle = css({
  height: '100%',
  backgroundColor: '#FF6600',
  borderRadius: '4px',
  transition: 'width 0.1s linear', // Smooth transition for width changes
});

const pages = [
  {
    image: tutorial1,
    description: (
      <>
        <span>Make Your Pose는 몸을 움직여</span>
        <br />
        <span style={{ color: '#FF6600' }}>정답 포즈를 추리</span>
        <span>하는 웹 게임입니다</span>
      </>
    ),
  },
  {
    image: tutorial2,
    description: (
      <>
        <span>시간이 흐르면 </span>
        <span style={{ color: '#FF6600' }}>정답 포즈 조각</span>
        <span>이 하나씩 공개됩니다.</span>
        <br />
        <span style={{ color: '#FF6600' }}>유사도를 보고</span>
        <span> 정답 포즈를 추리하세요!</span>
      </>
    ),
  },
  {
    image: tutorial3,
    description: (
      <>
        <span>정답을 </span>
        <span style={{ color: '#FF6600' }}>빨리 맞출수록 더 높은 점수</span>
        <span>를 받습니다.</span>
        <br />
        <span>그럼 게임을 시작해볼까요?</span>
      </>
    ),
  },
];

const variants = {
  enter: (direction: number) => {
    return {
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => {
    return {
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    };
  },
};

function Tutorial() {
  const [pageIndex, setPageIndex] = useState(0);
  const [direction, setDirection] = useState(0); // Track animation direction
  const [progress, setProgress] = useState(0); // State for progress bar
  const [isManualMode, setIsManualMode] = useState(false); // State to track manual interaction
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store progress interval ID
  const slideIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref to store slide change interval ID

  const clearIntervals = () => {
    if (slideIntervalRef.current) clearInterval(slideIntervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    slideIntervalRef.current = null;
    progressIntervalRef.current = null;
  };

  const startIntervals = (manualTrigger = false) => {
    clearIntervals(); // Clear existing intervals first

    // If triggered manually, set progress to full or zero depending on desired behavior
    // Here, we reset it to 0, assuming manual navigation should also show a fresh state.
    setProgress(manualTrigger ? 0 : 0);

    // Only start automatic intervals if not in manual mode
    if (!isManualMode && !manualTrigger) {
      // Interval for updating progress bar
      const startTime = Date.now();
      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const currentProgress = Math.min((elapsedTime / 6000) * 100, 100);
        setProgress(currentProgress);
      }, 60);

      // Interval for changing the slide
      slideIntervalRef.current = setInterval(() => {
        setDirection(1);
        setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
        // The useEffect listening to pageIndex will restart intervals if needed
      }, 6000);
    } else if (manualTrigger) {
      // If manually triggered, ensure progress is reset visually immediately
      setProgress(0);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Start intervals on initial mount only if not in manual mode
    if (!isManualMode) {
      startIntervals();
    }
    // Cleanup function to clear intervals when component unmounts
    return clearIntervals;
  }, []); // Run only on mount

  // Effect to restart intervals when pageIndex changes, respecting manual mode
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Only restart intervals if not in manual mode.
    // If in manual mode, this effect essentially does nothing regarding intervals.
    // The startIntervals call handles clearing and resetting progress if needed.
    if (!isManualMode) {
      startIntervals();
    } else {
      // If in manual mode, just ensure intervals are cleared and progress is reset
      // This handles the case where pageIndex changes due to manual click
      clearIntervals();
      setProgress(0); // Reset progress on manual navigation
    }
    // Rerun effect when pageIndex changes OR when mode changes
  }, [pageIndex, isManualMode]);

  const handlePaginationClick = (index: number) => {
    if (!isManualMode) {
      setIsManualMode(true); // Enter manual mode on first click
    }
    clearIntervals(); // Stop automatic sliding immediately
    setDirection(index > pageIndex ? 1 : -1);
    setPageIndex(index);
    // No need to call startIntervals here, the useEffect for pageIndex/isManualMode handles it
  };

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
            height: '100vh',
            left: '0',
            top: '0',
            alignItems: 'center',
            paddingInline: '0rem',
          })}
        >
          <div className={css({ display: 'flex', gap: '32px', marginBottom: '5vh', alignItems: 'center' })}>
            <CircleLineLeft/>
            <div className={titleStyle}>게임 설명</div>
            <CircleLineRight/>
          </div>
          {/* Add a button to enter manual mode */}
          {/* Card */}
          {/* Wrap the containerStyle div with motion.div and add animation props */}
          <motion.div
            className={containerStyle}
            initial={{ scale: 0, opacity: 0 }} // Start smaller and invisible
            animate={{ scale: 1, opacity: 1 }} // Animate to normal size and visible
            transition={{
              duration: 0.5,
              type: 'spring',
              bounce: 0.5,
            }} // Define animation duration and easing
          >
            <div className={boxStyle}>
              {/* Wrapper div to reserve space for animated content */}
              <div style={{ flex: 1, position: 'relative', width: '100%' }}>
                {/* Progress Bar - Conditionally render or style based on mode if needed */}
                <div
                  className={progressBarContainerStyle}
                  style={{
                    visibility: isManualMode ? 'hidden' : 'visible', // Hide progress bar in manual mode
                  }}
                >
                  <div
                    className={progressBarStyle}
                    style={{ width: `${progress}%` }} // Dynamic width based on progress state
                  />
                </div>

                <AnimatePresence initial={false} custom={direction}>
                  <motion.div
                    key={pageIndex} // Important for AnimatePresence to track the element
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 },
                    }}
                    style={{
                      // Ensure the motion div takes full height and centers content within the wrapper
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%', // Fill the wrapper
                      width: '100%', // Fill the wrapper
                      alignItems: 'center',
                      justifyContent: 'center', // Center content vertically
                      gap: '5%', // Maintain gap
                      position: 'absolute', // Position absolute for smooth transition
                      top: 0, // Align to top of wrapper
                      left: 0, // Align to left of wrapper
                    }}
                  >
                    {/* image */}
                    <img
                      src={pages[pageIndex].image} // Use pages[pageIndex] directly
                      alt="currentSlide"
                      style={{
                        width: 'auto',
                        height: '60%',
                        objectFit: 'contain',
                      }}
                    />
                    {/* description */}
                    <div className={textStyle}>
                      {pages[pageIndex].description}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* pagination */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: 'auto', // Push pagination towards the bottom before the button
                }}
              >
                {pages.map((_, index) => (
                  <button
                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                    key={index}
                    type="button"
                    onClick={() => handlePaginationClick(index)} // Use the new handler
                    className={css({
                      // Use css function here
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      backgroundColor:
                        pageIndex === index ? '#FF6600' : '#D9D9D9', // Conditional background color
                      border: 'none', // Remove default button border
                      padding: 0, // Remove default button padding
                      cursor: 'pointer', // Add pointer cursor
                      outline: 'none', // Remove focus outline if desired
                    })}
                    aria-label={`Go to slide ${index + 1}`} // Accessibility improvement
                  />
                ))}
              </div>

              <Link className={button} to="/lobby">
                Skip
                <img alt="" src={rightChevron} aria-hidden />
              </Link>
            </div>
          </motion.div>{' '}
          {/* End of motion.div wrapper */}
        </div>
      </div>
    </>
  );
}

export default Tutorial;
