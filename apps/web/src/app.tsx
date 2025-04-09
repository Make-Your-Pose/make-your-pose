import { BrowserRouter, Route, Routes } from 'react-router';
import Game from './pages/game';
import Home from './pages/home';
import Tutorial from './pages/tutorial';
import Lobby from './pages/lobby';
import Result from './pages/result';
import { DevtoolMachineContext } from './features/devtool/machine';
import { GlobalLayout } from './features/webcam/components/layout';
import { GestureProvider } from './features/webcam/GestureProvider';
import './styles.css'

function App() {
  return (
    <DevtoolMachineContext.Provider>
        <BrowserRouter>
          <Routes>
            <Route element={<GlobalLayout />}>
              <Route index element={<GestureProvider><Home /></GestureProvider>} />
              <Route path="tutorial" element={<GestureProvider><Tutorial /></GestureProvider>}/>
              <Route path="/lobby" element={<GestureProvider><Lobby /></GestureProvider>} />
              <Route path="/game" element={<Game />} />
              <Route path="/result" element={<GestureProvider><Result /></GestureProvider>} />
            </Route>
          </Routes>
        </BrowserRouter>
    </DevtoolMachineContext.Provider>
  );
}

export default App;
