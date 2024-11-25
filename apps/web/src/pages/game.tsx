import { useNavigate } from "@solidjs/router";
import { createSignal, onCleanup, onMount } from "solid-js";
import { css, cx } from "~styled-system/css";
import { container, hstack } from "~styled-system/patterns";

function Game() {
	let stream: MediaStream | null = null;
	let videoRef: HTMLVideoElement | undefined;
	let canvasRef: HTMLCanvasElement | undefined;
	const [score, setScore] = createSignal(0);
	const navigate = useNavigate();

	onMount(() => {
		const video = videoRef;
		const canvas = canvasRef;
		const context = canvas?.getContext("2d");

		if (navigator.mediaDevices.getUserMedia) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then((mediaStream) => {
					stream = mediaStream;
					if (video) {
						video.srcObject = stream;
						video.play();
					}
				})
				.catch((err) => {
					console.error("Error accessing webcam: ", err);
				});
		}

		const render = () => {
			if (video && context && canvas) {
				context.drawImage(video, 0, 0, canvas.width, canvas.height);
				requestAnimationFrame(render);
			}
		};

		render();
	});

	onCleanup(() => {
		if (stream) {
			for (const track of stream.getTracks()) {
				track.stop();
			}
		}
	});

	const addScore = () => {
		setScore(score() + 100);
	};

	const endGame = () => {
		navigate("/result", { state: { score: score() } });
	};

	return (
		<div class={container()}>
			{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
			<video ref={videoRef} style={{ display: "none" }} />
			<canvas ref={canvasRef} width="640" height="480" />
			<div class={cx(hstack(), css({ my: "8" }))}>
				<button
					type="button"
					class={css({
						bg: "blue.500",
						p: "2",
					})}
					onClick={addScore}
				>
					Add 100 to Score
				</button>
				<button
					type="button"
					class={css({
						bg: "blue.500",
						p: "2",
					})}
					onClick={endGame}
				>
					End
				</button>
			</div>
			<div>Score: {score()}</div>
		</div>
	);
}

export default Game;
