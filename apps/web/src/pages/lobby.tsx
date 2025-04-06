import { css } from '~styled-system/css';
import { stack } from '~styled-system/patterns';
import bg1 from '../images/bg-1.png';
import { Link } from 'react-router';

const backgroundStyle = css({ display: "flex", justifyContent: "center", width: "100vw"});
const titleStyle = css({ justifyContent: "center", textAlign: "center", width: "40%", padding: "20px 0", marginBottom: "32px", textStyle: "3xl", fontWeight: "semibold", background: "linear-gradient(90deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.80) 13%, #FFF 45%, rgba(255, 255, 255, 0.80) 90%, rgba(255, 255, 255, 0.00) 100%)" });
const categoryCard = css({ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'baseline', width: '49%', height: '300px', bgSize: 'cover', bgPosition: 'center', borderRadius: '2xl', padding: '32px' });
const categoryName = css({ textStyle: '5xl', fontWeight: 'bold', mb: '4' });
const categoryNameEng = css({ textStyle: '2xl', fontWeight: 'bold' });

function Lobby() {
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
            marginTop: '40px'
          })}
        >
          <div className={titleStyle}>플레이 하고 싶은 카테고리를 선택하세요</div>
          <div
            className={css({
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '20px',
              width: '100%',
              padding: '0 10%',
              color: 'white',
            })}
          >
            <Link
              to="/game"
              className={`${categoryCard} categoryLink`}
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.0)), url(${bg1})`,
              }}
            >
              <div className={categoryName}>스포츠</div>
              <div className={categoryNameEng}>Sports</div>
            </Link>

            <div
              className={`${categoryCard} categoryLink`}
              style={{ backgroundColor: '#828282' }}
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng}></div>
            </div>

            <div
              className={`${categoryCard} categoryLink`}
              style={{ backgroundColor: '#828282' }}
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng}></div>
            </div>

            <div
              className={`${categoryCard} categoryLink`}
              style={{ backgroundColor: '#828282' }}
            >
              <div className={categoryName}>최종 전시 공개</div>
              <div className={categoryNameEng}></div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default Lobby;
