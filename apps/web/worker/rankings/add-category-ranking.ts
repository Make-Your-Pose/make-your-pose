import type { RequestHandler } from '../router';
interface RequestBody {
  id: string;
  score: number;
  category: string;
  username: string;
}

export const addCategoryRanking: RequestHandler = async (request, env) => {
  console.log('Attempting to add category ranking...');
  try {
    // Parse the request body
    const requestBody = await request.json<RequestBody>();
    console.log('Request body parsed:', requestBody);

    // Extract data from the request
    const { id, score, category, username } = requestBody;

    // Validate required parameters
    if (!id) {
      console.error('Validation failed: Parameter "id" is required');
      return new Response(
        JSON.stringify({ success: false, error: 'Parameter "id" is required' }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 },
      );
    }
    if (score === undefined || score === null) {
      console.error('Validation failed: Parameter "score" is required');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parameter "score" is required',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 },
      );
    }
    if (!category) {
      console.error('Validation failed: Parameter "category" is required');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parameter "category" is required',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 },
      );
    }
    if (!username) {
      console.error('Validation failed: Parameter "username" is required');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Parameter "username" is required',
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 400 },
      );
    }

    // Validate score (must be a number)
    if (Number.isNaN(Number(score))) {
      console.error('Validation failed: Score must be a number');
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Score must be a number',
        }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        },
      );
    }

    // D1 데이터베이스 접근
    const db = env.DB;

    // 데이터 삽입 쿼리 실행
    console.log(
      `Inserting ranking: ID=${id}, Score=${score}, Category=${category}, Username=${username}`,
    );
    const stmt = await db
      .prepare(
        'INSERT INTO Leaderboards (id, score, category, username) VALUES (?, ?, ?, ?)',
      )
      .bind(id, score, category, username);

    await stmt.run();
    console.log('Ranking successfully inserted.');

    // 성공 응답 반환
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id,
          score,
          category,
          username,
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 201,
      },
    );
  } catch (error) {
    console.error('Error adding category ranking:', error);
    // 오류 처리
    return new Response(
      JSON.stringify({
        error,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
};
