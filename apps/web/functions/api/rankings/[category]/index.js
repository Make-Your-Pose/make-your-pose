export async function onRequestGet(context) {
  try {
    // Get the category from the path parameter
    const { category } = context.params;

    // Connect to D1 database
    const db = context.env.DB;

    if (!db) {
      return new Response(JSON.stringify({ error: "Database connection failed" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Query to get all tables in the database
    const { results: tables } = await db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table'"
    ).all();

    // Log all available tables to the console
    console.log("Available tables in the database:", tables);

    // Execute the query to get top 10 entries for the specified category
    const { results } = await db.prepare(
      "SELECT ID, Category, Username, Score FROM Leaderboards WHERE Category = ? ORDER BY Score DESC LIMIT 10"
    )
      .bind(category)
      .all();

    // Return the results as JSON
    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}