export async function onRequest(context) {
  try {
    // Get the D1 database instance from the context
    const { env } = context;

    // Query to retrieve all tables from the sqlite_master view
    // This is a SQLite system table that contains information about all tables
    const query = "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'";

    // Execute the query
    const result = await env.DB.prepare(query).all();

    // Format the response with the list of tables
    return new Response(JSON.stringify({
      success: true,
      tables: result.results.map(row => row.name),
      count: result.results.length
    }), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Error handling
    console.error("Error listing D1 database tables:", error);

    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
