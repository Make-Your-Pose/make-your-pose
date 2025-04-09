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
       <GestureProvider>
        <BrowserRouter>
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
