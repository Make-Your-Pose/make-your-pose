import { createActorContext } from '@xstate/react';
import { assign, setup } from 'xstate';

import { inspect } from './inspector';

type DevToolContext = {
  enableWebcam: boolean;
};

type DevToolEvents =
  | { type: 'TOGGLE_WEBCAM'; state: boolean }
  | { type: 'RESET_ALL' };

export const devtoolMachine = setup({
  types: {
    context: {} as DevToolContext,
    events: {} as DevToolEvents,
  },
}).createMachine({
  id: 'devtool',
  context: {
    enableWebcam: false,
  },
  initial: 'idle',
  states: {
    idle: {
      on: {
        TOGGLE_WEBCAM: {
          actions: assign({
            enableWebcam: ({ event }) => event.state,
          }),
        },
        RESET_ALL: {
          actions: assign({
            enableWebcam: false,
          }),
        },
      },
    },
  },
});

export const DevtoolMachineContext = createActorContext(devtoolMachine, {
  inspect,
});
