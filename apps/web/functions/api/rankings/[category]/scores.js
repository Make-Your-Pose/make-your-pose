// UUID 생성 함수
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// 랜덤 점수 생성 함수 (1-100 사이)
function generateRandomScore() {
  return Math.floor(Math.random() * 100) + 1;
}

export async function onRequestPost(context) {
  try {
    // UUID 생성
    const id = generateUUID();
    // 랜덤 점수 생성
    const score = generateRandomScore();
    // 카테고리 고정값
    const category = 'sports';
    // Username은 ID와 동일하게 설정
    const username = id;

    // D1 데이터베이스 접근
    const db = context.env.DB;

    // 데이터 삽입 쿼리 실행
    const stmt = await db
      .prepare(
        'INSERT INTO scores (id, score, category, username) VALUES (?, ?, ?, ?)',
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
