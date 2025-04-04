import { useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import Game from './pages/game';
import Home from './pages/home';
import Lobby from './pages/lobby';
import Result from './pages/result';
import WebcamLayout from './webcam/layout';
import { GestureProvider } from './webcam/GestureProvider';
import Tutorial from './pages/tutorial';
import './styles.css'

function FocusOnFirstElement() {
  const location = useLocation();

  useEffect(() => {
    // 페이지 이동 시 첫 번째 클릭 가능한 요소를 찾고 포커스
    const focusFirstElement = () => {
      setTimeout(() => {
        const firstClickable = document.querySelector('button, a, input, [tabindex]:not([tabindex="-1"])');
        if (firstClickable) {
          firstClickable.focus();
        }
      }, 1000); // 1초 딜레이
    };

    focusFirstElement();
  }, [location]);

  return null;
}

function App() {
  return (
    <GestureProvider>
    <MemoryRouter>
    <FocusOnFirstElement />
      <Routes>
      <Route index element={<Home />} />
      <Route path="tutorial" element={<Tutorial/>}/>
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/result" element={<Result />} />
        <Route element={<WebcamLayout />}>
          <Route path="/game" element={<Game />} />
        </Route>
      </Routes>
    </MemoryRouter>
    </GestureProvider>
  );
}

export default App;
