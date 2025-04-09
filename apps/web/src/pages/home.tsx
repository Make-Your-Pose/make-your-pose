import { Link } from "react-router";
import { css } from "~styled-system/css";
import { stack } from "~styled-system/patterns";
import bg1 from "../images/bg-1.png";

const backgroundStyle = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100vh",
  backgroundColor: "gray",
});

const titleStyle = css({
  padding: "20px 100px",
  marginBottom: "32px",
  textStyle: "3xl",
  fontWeight: "semibold",
  lineHeight: "1.5",
  letterSpacing: "0.5",
  textAlign: "center",
  background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)",
  justifyContent: "center",
});

const button = css({
  display: "flex",
  width: "20vw",
  padding: "20px 24px",
  justifyContent: "center",
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  marginTop: "30px",
  fontSize: "3xl",
  fontWeight: "semibold",
});

function Home() {
  return (
    <div className={backgroundStyle}>
      <div
        className={css({
          position: "fixed",
          width: "100vw",
          height: "100vh",
          left: "0",
          top: "0",
          bgSize: "cover",
          bgPosition: "center",
          filter: "auto",
          blur: "3xl",
        })}
        style={{
          backgroundImage: `url(${bg1})`,
        }}
      />
      <div
        className={stack({
          position: "relative",
          width: "100vw",
          left: "0",
          top: "0",
          alignItems: "center",
          paddingInline: "0rem",
        })}
      >
        <div className={css({ textStyle: "9xl", color: "#fff", fontWeight: "semibold", marginBottom: "100px" })}>
          Make Your Pose
        </div>
        <div className={titleStyle}>오른쪽 검지 손가락을 들어  START 버튼 위에 위치 시키세요</div>
        <Link
          className={button}
          to="/tutorial"
        >
          START
        </Link>
      </div>
    </div>
  );
}

export default Home;
