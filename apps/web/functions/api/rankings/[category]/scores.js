// UUID 생성 함수
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export async function onRequestPost(context) {
  try {
    // Parse the request body
    const requestBody = await context.request.json();

    // Extract data from the request or use defaults
    const id = generateUUID();
    const score = requestBody.score || 0;
    const category = requestBody.category || 'sports';
    const username = requestBody.username || 'Anonymous';

    // Validate score (must be a number)
    if (Number.isNaN(Number(score))) {
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
    const db = context.env.DB;

    // 데이터 삽입 쿼리 실행
    const stmt = await db
      .prepare(
        'INSERT INTO Leaderboards (id, score, category, username) VALUES (?, ?, ?, ?)',
      )
      .bind(id, score, category, username);

    const result = await stmt.run();

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
    // 오류 처리
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
}
