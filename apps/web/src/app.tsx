import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router';

import Game from './pages/game';
import Home from './pages/home';
import Tutorial from './pages/tutorial';
import Lobby from './pages/lobby';
import Result from './pages/result';
import { DevtoolMachineContext } from './features/devtool/machine';
import { GlobalLayout } from './features/webcam/components/layout';
import { GestureProvider } from './webcam/GestureProvider';
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
    <DevtoolMachineContext.Provider>
       <GestureProvider>
        <BrowserRouter>
        <FocusOnFirstElement />
          <Routes>
            <Route element={<GlobalLayout />}>
              <Route index element={<Home />} />
              <Route path="tutorial" element={<Tutorial/>}/>
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/game" element={<Game />} />
              <Route path="/result" element={<Result />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </GestureProvider>  
    </DevtoolMachineContext.Provider>
  );
}

export default App;
