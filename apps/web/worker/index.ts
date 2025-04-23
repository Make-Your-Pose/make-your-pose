import router from './router';

export default {
  fetch(request, env) {
    return router.fetch(request, env);
  },
} satisfies ExportedHandler<Env>;
