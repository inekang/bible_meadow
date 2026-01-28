
import { GoogleGenAI, Type } from "@google/genai";
import { Verse } from "../types";

const cleanJsonResponse = (text: string) => {
  return text.replace(/```json/g, "").replace(/```/g, "").trim();
};

export const fetchBibleChapterVerses = async (book: string, chapter: number): Promise<Verse[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `한국 천주교 성경(CBCK) '${book} ${chapter}장'의 주요 구절들을 3~5개 정도 추출해 주세요. 
      각 구절은 반드시 원문 그대로여야 합니다.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              reference: { type: Type.STRING }
            },
            required: ["text", "reference"]
          }
        }
      }
    });

    const results = JSON.parse(cleanJsonResponse(response.text || "[]"));
    return results.map((r: any, idx: number) => ({
      id: Date.now() + idx,
      text: r.text,
      reference: r.reference,
      category: '성경'
    }));
  } catch (error) {
    console.error("Failed to fetch bible verses", error);
    return [];
  }
};

export const fetchDailyGospelAcclamation = async (): Promise<Verse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const today = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `오늘(${today})의 한국 천주교 매일미사 '복음' 구절 정보를 찾아주세요. 
      [본문] {구절 내용} [출처] {루카복음 10,1-9 와 같은 형식의 장절 정보} 형식으로 알려주세요.`,
      config: { tools: [{ googleSearch: {} }] },
    });
    
    const text = response.text || "";
    const textMatch = text.match(/\[본문\]\s*(.+?)(?=\s*\[출처\]|$)/s);
    const refMatch = text.match(/\[출처\]\s*(.+?)$/);
    
    return {
      id: Date.now(),
      text: textMatch ? textMatch[1].trim() : "너희는 온 세상에 가서 복음을 선포하여라.",
      reference: refMatch ? refMatch[1].trim() : "마르 16,15"
    };
  } catch (error) {
    return { id: 1, text: "사람은 빵만으로 살지 않고 하느님의 입에서 나오는 모든 말씀으로 산다.", reference: "마태 4,4" };
  }
};
