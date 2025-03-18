export default {
  async fetch(request, env, ctx): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/leaderboards') {
      // If you did not use `DB` as your binding name, change it here
      const { results } = await env.DB.prepare(
        'SELECT * FROM Leaderboards',
      ).all();
      return Response.json(results);
    }

    return new Response('Hello World!');
  },
} satisfies ExportedHandler<Env>;
