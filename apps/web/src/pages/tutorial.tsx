import React, { useEffect, useState } from 'react';
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { useGesture } from "../webcam/GestureProvider";
import rightThumb from "../images/right-thumb.png";
import leftThumb from "../images/left-thumb.png";
import bothThumbs from "../images/both-thumbs.png";
import testUser from "../images/test-user.png";
import rightChevron from "../images/right-arrow-chevron.png";

const backgroundStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100vh", textAlign: "center", padding: "40px 0", backgroundColor: "gray" });
const titleStyle = css({ justifyContent: "center", textAlign: "center", width: "40%", padding: "20px 0", marginBottom: "32px", textStyle: "3xl", fontWeight: "semibold", background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)" });
const containerStyle = css({ display: "flex", flexDirection: "row", alignItems: "stretch", gap: "48px", width: "80vw", height: "80%" });
const boxStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", flex: 1, height: "100%", backgroundColor: "white", padding: "24px", borderRadius: "20px", boxShadow: "lg" });
const imageStyle = css({ marginBottom: "32px" });
const textStyle = css({ textAlign: "center", fontSize: "3xl", fontWeight: "semibold" });
const buttonsBoxStyle = css({ display: 'flex', flexDirection: "row", gap: "12px", width: "100%" });
const button = css({ display: "flex", width: "100%", padding: "20px 24px", justifyContent: "space-between", alignItems: "center", borderRadius: "12px", backgroundColor: "#eeeeee", marginTop: "30px", fontSize: "3xl", fontWeight: "semibold" });

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
        <div className={titleStyle}>게임 조작 방법 안내</div>
        <div className={containerStyle}>
            <div className={boxStyle}>
                <div style={{ display: "flex", flexDirection: "column", height: "100%", alignItems: "center", justifyContent: "center" }}>
                    <div className={imageStyle}>
                    <img src={currentPage.image} alt="gesture" style={{ height: "300px" }} />
                    </div>
                    <div className={textStyle}>{currentPage.description}</div>
                </div>
                <div className={buttonsBoxStyle}>
                    <Link className={button} ref={(el) => buttonRefs.current[0] = el} to="/lobby" style={{ justifyContent: "space-between" }}>
                    <span style={{ width: "40px", height: "40px" }}></span>다음<img src={rightChevron}/></Link>
                </div>
            </div>
            <img src={testUser} width="350px"/>
        </div>
    </div>    
    </>
    );
  }
  
  export default Tutorial;