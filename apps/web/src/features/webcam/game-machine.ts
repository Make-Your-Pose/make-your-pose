import { createMachine, assign } from 'xstate';

export const gameMachine = createMachine({

  types: {} as {
    context: {
      round: number;
      score: number;
      currentScore: number;
      totalRounds: number;
    };
    events:
      | { type: 'PASS'; score: number }
      | { type: 'FAIL' }
      | { type: 'GAME_OVER' };
  },

  id: 'game',
  initial: 'playing',
  context: {
    round: 0,
    score: 0,
    currentScore: 0,
    totalRounds: 9,
  },

  states: {
    playing: {
      on: {
        PASS: {
          target: 'showScore',
          actions: assign(({ context, event }) => ({
            score: context.score + event.score,
            currentScore: event.score,
          })),
        },
        FAIL: {
          target: 'showMiss',
          actions: assign({
            currentScore: () => 0,
          }),
        },
        GAME_OVER: 'gameOver',
      },
    },

    showScore: {
      after: {
        1000: {
          target: 'playing',
          actions: assign(({ context }) => ({
            round: context.round + 1,
            currentScore: 0,
          })),
        },
      },
    },

    showMiss: {
      after: {
        1000: {
          target: 'playing',
          actions: assign(({ context }) => ({
            round: context.round + 1,
            currentScore: 0,
          })),
        },
      },
    },

    gameOver: {
      type: 'final',
    },
  },
});