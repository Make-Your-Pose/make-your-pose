import { MemoryRouter, Route } from "@solidjs/router";
import Game from "./pages/game";
import Home from "./pages/home";
import Lobby from "./pages/lobby";
import Result from "./pages/result";

function App() {
	return (
		<MemoryRouter>
			<Route path="/" component={Home} />
			<Route path="/lobby" component={Lobby} />
			<Route path="/game" component={Game} />
			<Route path="/result" component={Result} />
		</MemoryRouter>
	);
}

export default App;
