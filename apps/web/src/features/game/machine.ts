import { assign, setup } from 'xstate';

export const gameMachine = setup({
  types: {
    context: {} as {
      hint: boolean[];
      round: number;
      score: number;
      maxRound: number;
    },
    events: {} as
      | { type: 'timeout' }
      | { type: 'pass'; score: number }
      | { type: 'fail' }
      | { type: 'next' },
  },
  actions: {
    nextHint: assign({
      hint: ({ context }) => {
        const nextHint = context.hint.slice();
        const falseIndices = nextHint
          .map((value, index) => (!value ? index : -1))
          .filter((index) => index !== -1);
        if (falseIndices.length > 0) {
          const randomFalseIndex =
            falseIndices[Math.floor(Math.random() * falseIndices.length)];
          nextHint[randomFalseIndex] = true;
        }
        return nextHint;
      },
    }),
    nextRound: assign({
      hint: () => [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
      round: ({ context }) => context.round + 1,
    }),
  },
  guards: {
    isRoundFinished: ({ context }) => context.hint.every((hint) => hint),
    isGameFinished: ({ context }) => context.round >= context.maxRound,
    canProceedNextRound: ({ context }) => context.round + 1 < context.maxRound,
  },
  delays: {
    playDelay: 1000,
    hintTimeout: 3000,
    nextRoundDelay: 3000,
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswDoAOYB2EAlnlAMQAesALilVigGZ0BOAFNgDYoCeAImF24BKUqgw58REgG0ADAF1EobAHtYhKoRV4lIcogCMAViOYATAE4AbAA4A7EYA0IbogDMdq5jc2zNg3bGgVa2AL6hzmJYnDzEZNgosLByikggquqa2rr6CFayZpiyxlZmTi7uIZgALLKlRtVWRsFhESBROIJxpAwohBwpuhkaWjppufmFxUb1zq4IZos1Rm4Glk0tNuGR6NFdJBTUtPRMYGwAFsRUACqEGCoArlQiHTHccYNpw1ljoLnNNhqFg8NlkKzsFlk1TMc0MdkKdlkNnyFjMslkbmqwIM23au06sQOlBodEwjBYrEueBudzAj2eonxbw+BlSyjUI2y40Qi0KPjsbkxRgMBkFgVhCACmAMVnhIVkFnsFka1VxHRQeFgAHczocSScKXgwOQqAAlR4EfiCF74jXas6fdmZUY5RDw0wGaazCoLeGYCwrNbWZoy1o7cRa5jaMjE45k05sI0m80PS0CHg2iNRmQKIYcn6uhCeaqYGwmNYGCzwxWYiUQ8weMxufIhEy1NzhNp4FQQOC6KJ551cv6IAC0Vglo8R3jcZjs1WqnpsFhlTbVTMkcUHnN+ekQ0IlHlMPj8ASCoa2bVe+yg24L3IQJ8wVgDqzKh4c3l8-kCIZCl-DehNR1Zg7xdB8V1MKxqhsaoj0PWDzAsZUbBPHxBSMdcs2jMDhz3SUCgsTAjDKFdoKxTE7AlJs3GfE8DGXHxZGLTDOyAA */
  id: 'game',
  context: {
    hint: [false, false, false, false, false, false, false, false, false],
    round: 0,
    score: 0,
    maxRound: 1,
  },
  initial: 'pending',
  states: {
    pending: {
      after: {
        playDelay: {
          target: 'playing',
        },
      },
    },
    playing: {
      entry: ['nextHint'],
      on: {
        pass: {
          target: 'answer',
          actions: assign({
            score: ({ context, event }) => context.score + event.score,
          }),
        },
        fail: {
          target: 'wrong',
        },
        next: [
          {
            guard: 'isRoundFinished',
            target: 'wrong',
          },
          {
            actions: ['nextHint'],
          },
        ],
      },
    },
    answer: {
      after: {
        nextRoundDelay: [
          {
            guard: 'canProceedNextRound',
            target: 'playing',
            actions: ['nextRound'],
          },
          {
            target: 'gameOver',
          },
        ],
      },
    },
    wrong: {
      after: {
        nextRoundDelay: [
          {
            guard: 'canProceedNextRound',
            target: 'playing',
            actions: ['nextRound'],
          },
          {
            target: 'gameOver',
          },
        ],
      },
    },
    gameOver: {
      type: 'final',
    },
  },
});
