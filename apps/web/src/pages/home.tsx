import React from "react";
import { Link } from "react-router"; 
import { css } from "~styled-system/css";
import { stack } from '~styled-system/patterns';
import { useGesture } from "../features/webcam/GestureProvider";
import bg1 from '../images/bg-1.png';

const backgroundStyle = css({ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", height: "100vh", backgroundColor: "gray" });
const titleStyle = css({ justifyContent: "center", textAlign: "center", width: "48vw", padding: "20px 0", marginBottom: "100px", textStyle: "3xl", fontWeight: "semibold", background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)" });
const button = css({ display: "flex", width: "20vw", padding: "20px 24px", justifyContent: "center", borderRadius: "12px", backgroundColor: "#eeeeee", marginTop: "30px", fontSize: "3xl", fontWeight: "semibold" });

function Home() {
  const { buttonRefs } = useGesture(); 

  return (
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
        <div className={css({ textStyle: "8xl", color: "#fff", fontWeight: 'semibold', marginBottom: '50px' })}>Make Your Pose</div>
        <div className={titleStyle}>쌍따봉 포즈를 취하여 게임을 시작하세요</div>
        <Link className={button} ref={(el) => buttonRefs.current[0] = el} to="/tutorial">
          START
        </Link>
      </div>
    </div>
  );
}

export default Home;
