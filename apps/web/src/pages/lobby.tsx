import { A } from "@solidjs/router";
import { For, createSignal } from "solid-js";
import { css, cx } from "~styled-system/css";
import { center, container, hstack } from "~styled-system/patterns";

function Lobby() {
	const [items] = createSignal(["sports", "meme", "yoga"]);

	return (
		<div class={cx(container(), center())}>
			<ul
				class={cx(
					hstack(),
					css({
						my: "4",
					}),
				)}
			>
				<For each={items()}>
					{(item) => (
						<li>
							<A
								href="/game"
								class={css({
									display: "block",
									px: "4",
									py: "3",
									bg: "gray.100",
									border: "1px solid",
									borderColor: "blue.500",
								})}
							>
								{item}
							</A>
						</li>
					)}
				</For>
			</ul>
		</div>
	);
}

export default Lobby;
