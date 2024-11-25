import { A } from "@solidjs/router";
import { css } from "~styled-system/css";
import { container, vstack } from "~styled-system/patterns";

function Home() {
	return (
		<div class={container()}>
			<div class={vstack()}>
				<div class={css({ my: "40", textStyle: "4xl" })}>Make Your Pose</div>
				<A href="/lobby" class={css({ color: "blue.500" })}>
					시작하기
				</A>
			</div>
		</div>
	);
}

export default Home;
