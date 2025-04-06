import React, { useEffect, useState } from 'react';
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { stack } from '~styled-system/patterns';
import { useGesture } from "../webcam/GestureProvider";
import { Carousel } from '@ark-ui/react/carousel';
import rightThumb from "../images/right-thumb.png";
import leftThumb from "../images/left-thumb.png";
import bothThumbs from "../images/both-thumbs.png";
import testUser from "../images/test-user.png";
import rightChevron from "../images/right-arrow-chevron.png";
import bg1 from '../images/bg-1.png';

const backgroundStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100vh", textAlign: "center", padding: "40px 0", backgroundColor: "gray" });
const titleStyle = css({ justifyContent: "center", textAlign: "center", width: "40%", padding: "20px 0", marginBottom: "32px", textStyle: "3xl", fontWeight: "semibold", background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)" });
const containerStyle = css({ display: "flex", flexDirection: "row", alignItems: "stretch", gap: "48px", width: "80vw", height: "80%" });
const boxStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", flex: 1, height: "100%", backgroundColor: "white", padding: "24px", borderRadius: "20px", boxShadow: "lg" });
const textStyle = css({ textAlign: "center", fontSize: "3xl", fontWeight: "semibold" });
const buttonsBoxStyle = css({ display: 'flex', flexDirection: "row", width: "100%" });
const button = css({ display: "flex", width: "100%", padding: "16px 24px", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", backgroundColor: "#eeeeee", marginTop: "30px", fontSize: "2xl", fontWeight: "semibold" });

const pages = [
  {
    image: rightThumb,
    description: (
      <>
        <span style={{ color: "#FF6600" }}>오른손</span>을 들어 ‘따봉’ 포즈를 하면<br />
        <span style={{ color: "#FF6600" }}>다음</span>으로 포커스가 이동합니다.
      </>
    ),
  },
  {
    image: leftThumb,
    description: (
      <>
        <span style={{ color: "#FF6600" }}>왼손</span>을 들어 ‘따봉’ 포즈를 하면<br />
        <span style={{ color: "#FF6600" }}>이전</span>으로 포커스가 이동합니다.
      </>
    ),
  },
  {
    image: bothThumbs,
    description: (
      <>
        <span style={{ color: "#FF6600" }}>양손</span>을 들어 ‘따봉’ 포즈를 하면<br />
        포커싱 된 요소가 <span style={{ color: "#FF6600" }}>클릭</span>됩니다.
      </>
    ),
  },
];

function Tutorial() {
  const { buttonRefs, gestureResults } = useGesture(); 
  const [pageIndex, setPageIndex] = useState(0);

  // 자동 전환과 텍스트 동기화
  useEffect(() => {
    const interval = setInterval(() => {
      setPageIndex((prevIndex) => (prevIndex + 1) % pages.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const currentPage = pages[pageIndex];

  return (
    <>
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
          })}
        >
          <div className={titleStyle}>게임 조작 방법 안내</div>
          <div className={containerStyle}>
            <div className={boxStyle}>
              <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center", gap: "32px" }}>
                  {/* image */}
                  <img src={currentPage.image} alt="currentSlide" style={{ width: 'auto', height: '260px', objectFit: 'contain' }} />
                  {/* description */}
                  <div className={textStyle}>{currentPage.description}</div>
                  {/* pagination */}
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  {pages.map((_, index) => (
                    <div
                      key={index}
                      onClick={() => setPageIndex(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: pageIndex === index ? '#FF6600' : '#D9D9D9',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className={buttonsBoxStyle}>
                <Link className={button} ref={(el) => buttonRefs.current[0] = el} to="/lobby" style={{ justifyContent: "space-between" }}>
                  <span style={{ width: "40px", height: "32px" }}></span>다음<img src={rightChevron} />
                </Link>
              </div>
            </div>
            <img src={testUser} width="350px" />
          </div>
        </div>
      </div>    
    </>
  );
}

export default Tutorial;
