import { useEffect, useState } from 'react';
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { stack } from '~styled-system/patterns';
import tutorial1 from "../images/description_image_1.png"
import tutorial2 from "../images/description_image_2.png"
import tutorial3 from "../images/description_image_3.png"
import rightChevron from "../images/right-arrow-chevron.png";
import bg1 from '../images/bg-1.png';
import home from '../images/home.png'

const backgroundStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  height: "100vh",
  padding: "70px 0",
  textAlign: "center",
  backgroundColor: "gray",
});

const titleStyle = css({
  width: "40%",
  padding: "20px 0",
  marginBottom: "32px",
  textStyle: "3xl",
  fontWeight: "semibold",
  textAlign: "center",
  background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)",
  justifyContent: "center",
});

const containerStyle = css({
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  gap: "48px",
  width: "70vw",
  height: "75vh",
});

const boxStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",
  flex: 1,
  height: "100%",
  padding: "40px",
  backgroundColor: "white",
  borderRadius: "20px",
  boxShadow: "lg",
});

const textStyle = css({
  textAlign: "center",
  fontSize: "4xl",
  fontWeight: "semibold",
});

const buttonsBoxStyle = css({
  display: "flex",
  flexDirection: "row",
  width: "100%",
});

const button = css({
  display: "flex",
  width: "100%",
  height: "100px",
  padding: "16px 24px",
  justifyContent: "space-between",
  alignItems: "center",
  borderRadius: "12px",
  backgroundColor: "#eeeeee",
  marginTop: "30px",
  fontSize: "3xl",
  fontWeight: "semibold",
});

const pages = [
  {
    image: tutorial1,
    description: (
      <>
        <span>Make Your Pose는 몸을 움직여</span><br />
        <span style={{ color: "#FF6600" }}>정답 포즈를 추리</span><span>하는 웹 게임입니다</span>
      </>
    ),
  },
  {
    image: tutorial2,
    description: (
      <>
        <span>시간이 흐르면 </span><span style={{ color: "#FF6600" }}>정답 포즈 조각</span><span>이 하나씩 공개됩니다.</span><br />
        <span style={{ color: "#FF6600" }}>유사도를 보고</span><span> 정답 포즈를 추리하세요!</span>
      </>
    ),
  },
  {
    image: tutorial3,
    description: (
      <>
        <span>정답을 </span><span style={{ color: "#FF6600" }}>빨리 맞출수록 더 높은 점수</span><span>를 받습니다.</span><br />
        <span>그럼 게임을 시작해볼까요?</span>
      </>
    ),
  },
];

function Tutorial() {
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const currentPage = pages[pageIndex];

  return (
    <>
      <Link
        to="/"
        style={{
          position: "fixed",
          bottom: "70px",
          right: "50px",
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          boxShadow: "md",
          zIndex: 10,
        }}
        className="home-button">
        <img src={home} alt="homeButtom" style={{ marginBottom: '8px' }}/>
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
            height: '100vh',
            left: '0',
            top: '0',
            alignItems: 'center',
            paddingInline: '0rem',
          })}
        >
          <div className={titleStyle}>게임 설명</div>
          <div className={containerStyle}>
            <div className={boxStyle}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", gap: "5%" }}>
                {/* image */}
                <img src={currentPage.image} alt="currentSlide" style={{ width: 'auto', height: '60%', objectFit: 'contain' }} />
                {/* description */}
                <div className={textStyle}>{currentPage.description}</div>
                {/* pagination */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                  {pages.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setPageIndex(index)}
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: pageIndex === index ? '#FF6600' : '#D9D9D9',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className={buttonsBoxStyle}>
                <Link className={button} to="/lobby" style={{ justifyContent: "space-between" }}>
                  <span style={{ width: "40px", height: "40px" }}></span>다음<img src={rightChevron} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>    
    </>
  );
}

export default Tutorial;
