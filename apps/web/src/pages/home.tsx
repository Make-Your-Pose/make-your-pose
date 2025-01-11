import { Link } from 'react-router';
import { css } from '~styled-system/css';
import { container, vstack } from '~styled-system/patterns';

function Home() {
  return (
    <div className={container()}>
      <div className={vstack()}>
        <div className={css({ my: '40', textStyle: '4xl' })}>
          Make Your Pose
        </div>
        <Link to="/lobby" className={css({ color: 'blue.500' })}>
          시작하기
        </Link>
      </div>
    </div>
  );
}

export default Home;
