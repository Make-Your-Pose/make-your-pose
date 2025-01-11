import { MemoryRouter, Route, Routes } from 'react-router';

import Game from './pages/game';
import Home from './pages/home';
import Lobby from './pages/lobby';
import Result from './pages/result';
import WebcamLayout from './webcam/layout';

function App() {
  return (
    <MemoryRouter>
      <Routes>
        <Route element={<WebcamLayout />}>
          <Route index element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
