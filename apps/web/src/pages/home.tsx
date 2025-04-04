import React from "react";
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { useGesture } from "../webcam/GestureProvider";

const backgroundStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", height: "100vh", backgroundColor: "gray" });
const titleStyle = css({ justifyContent: "center", textAlign: "center", width: "40%", padding: "20px 0", marginBottom: "32px", textStyle: "3xl", fontWeight: "semibold", background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)" });
const button = css({ display: "flex", width: "200px", padding: "20px 24px", justifyContent: "center", borderRadius: "12px", backgroundColor: "#eeeeee", marginTop: "30px", fontSize: "3xl", fontWeight: "semibold" });

function Home() {
  const { buttonRefs } = useGesture(); 

  return (
    <div className={backgroundStyle}>
    {/* <div className={container()}> */}
      {/* <div className={vstack()}> */}
        <div className={css({ my: "40", textStyle: "7xl", color: "#fff", fontWeight: 'semibold' })}>Make Your Pose</div>
        <div className={titleStyle}>쌍따봉 포즈를 취하여 게임을 시작하세요</div>
        <Link className={button} ref={(el) => buttonRefs.current[0] = el} to="/tutorial">
          START
        </Link>
      {/* </div> */}
    </div>
  );
}

export default Home;
