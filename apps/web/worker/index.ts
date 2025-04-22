import router from './router';

export default {
  fetch(request) {
    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
