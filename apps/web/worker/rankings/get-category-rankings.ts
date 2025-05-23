import type { RequestHandler } from '../router';

export const getCategoryRankings: RequestHandler = async (request, env) => {
  try {
    // Get the category from the path parameter
    const { category } = request.params;
    console.log(`Fetching rankings for category: ${category}`);

    // Connect to D1 database
    const db = env.DB;

    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database connection failed' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    // Execute the query to get top 10 entries for the specified category
    const { results } = await db
      .prepare(
        'SELECT ID, Category, Username, Score FROM Leaderboards WHERE Category = ? ORDER BY Score DESC',
      )
      .bind(category)
      .all();

    console.log(
      `Successfully fetched ${results?.length ?? 0} rankings for category: ${category}`,
    );

    // Return the results as JSON
    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching category rankings:', error);
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
