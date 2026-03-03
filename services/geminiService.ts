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


// export const fetchBibleChapterVerses = async (book: string, chapter: number): Promise<Verse[]> => {
//   try {
//     const result = await model.generateContent(`
//       한국 천주교 성경(CBCK) '${book} ${chapter}장'의 주요 구절들을 3~5개 정도 추출해 주세요. 
//       각 구절은 반드시 원문 그대로여야 합니다.
//       결과는 오직 JSON 배열 형식으로만 출력해 주세요. 예: [{"text": "...", "reference": "..."}]
//     `);

//     const responseText = result.response.text();
//     const results = JSON.parse(cleanJsonResponse(responseText));

//     return results.map((r: any, idx: number) => ({
//       id: Date.now() + idx,
//       text: r.text,
//       reference: r.reference,
//       category: '성경'
//     }));
//   } catch (error) {
//     console.error("성경 구절 가져오기 실패:", error);
//     return [];
//   }
// };

// // ---------------------------------------------------------
// // 기능 2: 오늘의 복음 (RSS 기반 + AI 정제)
// // * 가톨릭 굿뉴스 RSS를 가져와서 AI가 복음환호성 부분만 추출합니다.
// // ---------------------------------------------------------
// export const fetchDailyGospelAcclamation = async (): Promise<Verse> => {
//   let promptText = "";

//   try {
//     // 1. 가톨릭 굿뉴스 매일미사 RSS 가져오기 (rss2json 변환기 사용)
//     const RSS_URL = "https://maria.catholic.or.kr/mi_pr/rss/rss_view.asp?s_code=1001";
//     // RSS를 JSON으로 바꿔주는 무료 API 사용
//     const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;
    
//     const rssResponse = await fetch(API_URL);
//     if (!rssResponse.ok) throw new Error("RSS 서버 응답 오류");

//     const rssData = await rssResponse.json();
//     if (!rssData.items || rssData.items.length === 0) throw new Error("RSS 데이터 없음");
    
//     // 2. RSS 설명(HTML)에서 '복음' 내용을 추출하도록 프롬프트 작성
//     // 주의: RSS 데이터는 HTML 태그가 섞여 있어서 AI에게 정제를 맡깁니다.
//     promptText = `
//       아래 [데이터]는 오늘 천주교 매일미사의 전체 내용이야. HTML 태그가 섞여 있어.
      
//       여기서 **[복음환호성]** 파트를 찾아서 다음 두 가지를 추출해줘:
//       1. **출처**: (예: 마태오 복음 5장 1-12절)
//       2. **내용**: (성경 본문 내용만 깔끔하게)
      
//       [조건]
//       - '알렐루야'빼고 '복음 환호성'만 찾아줘.
//       - 응답은 오직 JSON 형식({"text": "...", "reference": "..."})으로만 해줘.
      
//       [데이터]
//       ${rssData.items[0].description}
//     `;

//   } catch (rssError) {
//     console.warn("RSS 가져오기 실패, AI 랜덤 추천으로 대체합니다.", rssError);
    
//     // 3. 실패 시: AI가 랜덤으로 위로의 말씀을 추천 (Fallback)
//     promptText = `
//       오늘은 매일미사 정보를 가져올 수 없어.
//       대신 힘들거나 지친 사람에게 힘이 되는 '4복음서의 말씀' 하나를 랜덤으로 추천해줘.
//       반드시 JSON 형식({"text": "...", "reference": "..."})으로 답변해줘.
//     `;
//   }

//   try {
//     // 4. Gemini에게 요청
//     const result = await model.generateContent(promptText);
//     const responseText = result.response.text();
//     const jsonResult = JSON.parse(cleanJsonResponse(responseText));

//     return {
//       id: Date.now(),
//       text: jsonResult.text,
//       reference: jsonResult.reference,
//       category: "오늘의 복음"
//     };

//   } catch (aiError) {
//     console.error("AI 응답 실패:", aiError);
//     // 5. 최후의 수단 (AI도 실패했을 때)
//     return {
//       id: Date.now(),
//       text: "행복하여라, 마음이 가난한 사람들! 하늘 나라가 그들의 것이다.",
//       reference: "마태오 복음 5장 3절",
//       category: "기본 말씀"
//     };
//   }
// };

import { getTodayGospel } from "../dailyGospel"; // 경로 확인

export const fetchDailyGospelAcclamation = async (): Promise<Verse> => {
  // 복잡한 AI, RSS 필요 없이 그냥 가져오면 끝!
  return getTodayGospel();
};