import React from "react";
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { container, vstack } from "~styled-system/patterns";
import { useGesture } from "../webcam/GestureProvider"; // ✅ 제스처 컨텍스트 사용

function Home() {
  const { buttonRef } = useGesture(); 

  return (
    <div className={container()}>
      <div className={vstack()}>
        <div className={css({ my: "40", textStyle: "4xl" })}>Make Your Pose</div>
        <Link ref={buttonRef} to="/lobby" className="gesture-button">
          시작하기
        </Link>
      </div>
    </div>
  );
}

export default Home;
