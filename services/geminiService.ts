import { GoogleGenerativeAI } from "@google/generative-ai";
import { Verse } from "../types";

// 1. 공통 설정: API 키와 모델 초기화
// 주의: 여기서 import.meta.env.VITE_GEMINI_API_KEY를 사용합니다.
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// 모델 이름을 'gemini-1.5-flash'로 설정 (가장 안정적)
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 헬퍼: JSON 응답에서 불필요한 기호 제거
const cleanJsonResponse = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

// ---------------------------------------------------------
// 기능 1: 성경 구절 가져오기
// ---------------------------------------------------------
export const fetchBibleChapterVerses = async (book: string, chapter: number): Promise<Verse[]> => {
  try {
    const result = await model.generateContent(`
      한국 천주교 성경(CBCK) '${book} ${chapter}장'의 주요 구절들을 3~5개 정도 추출해 주세요. 
      각 구절은 반드시 원문 그대로여야 합니다.
      결과는 오직 JSON 배열 형식으로만 출력해 주세요. 예: [{"text": "...", "reference": "..."}]
    `);

    const responseText = result.response.text();
    const results = JSON.parse(cleanJsonResponse(responseText));

    return results.map((r: any, idx: number) => ({
      id: Date.now() + idx,
      text: r.text,
      reference: r.reference,
      category: '성경'
    }));
  } catch (error) {
    console.error("성경 구절 가져오기 실패:", error);
    return [];
  }
};

// ---------------------------------------------------------
// 기능 2: 오늘의 복음 환호성 (RSS + AI 요약)
// * 무료 티어라 Google Search 대신 RSS를 사용합니다.
// ---------------------------------------------------------
export const fetchDailyGospelAcclamation = async (): Promise<Verse> => {
  let promptText = "";

  try {
    // 1. 가톨릭 굿뉴스 RSS 가져오기
    const RSS_URL = "https://maria.catholic.or.kr/mi_pr/rss/rss_view.asp?s_code=1001";
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
    
    const rssResponse = await fetch(API_URL);
    if (!rssResponse.ok) throw new Error("RSS 서버 응답 오류");

    const rssData = await rssResponse.json();
    if (!rssData.items || rssData.items.length === 0) throw new Error("RSS 데이터 없음");
    
    // 2. 성공 시: RSS 내용에서 복음 환호성 찾기
    promptText = `
      아래 텍스트는 '오늘의 매일미사' 전체 내용이야. 
      여기서 [복음 환호성] 부분을 찾아서 그 안의 '내용'과 '출처(장절)'를 추출해줘.
      반드시 JSON 형식({"text": "...", "reference": "..."})으로만 답변해.
      
      [데이터]
      ${rssData.items[0].description}
    `;

  } catch (rssError) {
    console.warn("RSS 실패, AI 추천으로 대체합니다.", rssError);
    // 3. 실패 시: AI에게 위로의 말씀 추천 요청 (앱이 안 꺼지게 방어)
    promptText = `
      오늘은 매일미사 정보를 가져올 수 없어.
      대신 힘들거나 지친 사람에게 힘이 되는 '짧은 성경 구절' 하나를 랜덤으로 추천해줘.
      반드시 JSON 형식({"text": "...", "reference": "..."})으로 답변해줘.
    `;
  }

  try {
    const result = await model.generateContent(promptText);
    const jsonResult = JSON.parse(cleanJsonResponse(result.response.text()));

    return {
      id: Date.now(),
      text: jsonResult.text.replace(/알렐루야/g, '').trim(), // 알렐루야 중복 제거
      reference: jsonResult.reference,
      category: "복음 환호성"
    };
  } catch (aiError) {
    console.error("AI 응답 실패:", aiError);
    return {
      id: Date.now(),
      text: "사람은 빵만으로 살지 않고 하느님의 입에서 나오는 모든 말씀으로 산다.",
      reference: "마태 4,4",
      category: "기본 말씀"
    };
  }
};

// ---------------------------------------------------------
// 기능 3: 성경 읽기 검사 (STT 판정)
// ---------------------------------------------------------
export const verifyBibleReading = async (originalText: string, transcript: string): Promise<{ isCorrect: boolean; feedback: string }> => {
  try {
    const result = await model.generateContent(`
      역할: 너는 친절한 성경 선생님이야.
      상황: 사용자가 성경 구절을 소리 내어 읽었어.
      
      [원문]: "${originalText}"
      [사용자가 읽은 말]: "${transcript}"
      
      판정 기준:
      1. 조사가 조금 틀리거나 말실수는 괜찮아. 의미가 맞으면 'true'.
      2. 아예 다른 말을 하거나 너무 많이 틀렸으면 'false'.
      
      출력 형식(JSON):
      {
        "isCorrect": true 또는 false,
        "feedback": "따뜻하고 구체적인 피드백 한 문장 (존댓말)"
      }
    `);

    return JSON.parse(cleanJsonResponse(result.response.text()));
  } catch (error) {
    console.error("판정 실패:", error);
    return { isCorrect: true, feedback: "잘 읽으셨습니다! (AI 연결 불안정으로 자동 통과)" };
  }
};