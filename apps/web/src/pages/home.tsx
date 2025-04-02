import React from "react";
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { container, vstack } from "~styled-system/patterns";
import { useGesture } from "../webcam/GestureProvider";

function Home() {
  const { buttonRefs } = useGesture(); 

  return (
    <div className={container()}>
      <div className={vstack()}>
        <div className={css({ my: "40", textStyle: "4xl" })}>Make Your Pose</div>
        <Link ref={(el) => buttonRefs.current[0] = el} to="/tutorial" className="gesture-button">
          시작하기
        </Link>
      </div>
    </div>
  );
}

export default Home;
