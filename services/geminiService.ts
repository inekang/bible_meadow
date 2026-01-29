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
// 기능 2: 오늘의 복음 (AI 랜덤 추천 방식)
// * RSS 크롤링 없이, AI가 상황에 맞는 복음 말씀을 랜덤으로 추천합니다.
// ---------------------------------------------------------
export const fetchDailyGospelAcclamation = async (): Promise<Verse> => {
  try {
    // 1. AI에게 랜덤 추천 요청 프롬프트 작성
    const promptText = `
      한국 천주교 성경(CBCK)의 '4복음서(마태오, 마르코, 루카, 요한)' 중에서
      오늘 하루 힘이 되고 위로가 되는 말씀을 하나만 랜덤으로 추천해줘.
      
      [조건]
      1. 너무 유명한 구절보다는 묵상하기 좋은 구절로 선택해줘.
      2. 내용은 반드시 한국어 성경 원문 그대로여야 해.
      3. 응답은 오직 JSON 형식({"text": "...", "reference": "..."})으로만 해줘.
      
      예시:
      {"text": "고생하며 무거운 짐을 진 너희는 모두 나에게 오너라. 내가 너희에게 안식을 주겠다.", "reference": "마태오 복음 11장 28절"}
    `;

    // 2. AI 응답 생성
    const result = await model.generateContent(promptText);
    const responseText = result.response.text();
    const jsonResult = JSON.parse(cleanJsonResponse(responseText));

    // 3. 결과 반환
    return {
      id: Date.now(),
      text: jsonResult.text,
      reference: jsonResult.reference,
      category: "오늘의 복음"
    };

  } catch (error) {
    console.error("AI 말씀 추천 실패:", error);
    // 4. 실패 시 기본 말씀 반환 (안전장치)
    return {
      id: Date.now(),
      text: "너희는 세상의 빛이다. 산 위에 자리 잡은 고을은 감추어질 수 없다.",
      reference: "마태오 복음 5장 14절",
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