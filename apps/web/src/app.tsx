import { MemoryRouter, Route, Routes } from 'react-router';

import Game from './pages/game';
import Home from './pages/home';
import Lobby from './pages/lobby';
import Result from './pages/result';
import WebcamLayout from './webcam/layout';
import { GestureProvider } from './webcam/GestureProvider';
import Tutorial from './pages/tutorial';

function App() {
  return (
    <GestureProvider>
    <MemoryRouter>
      <Routes>
        <Route element={<WebcamLayout />}>
          <Route index element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="tutorial" element={<Tutorial/>}/>
        </Route>
      </Routes>
    </MemoryRouter>
    </GestureProvider>
  );
}

export default App;
