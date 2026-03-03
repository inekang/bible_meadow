// src/dailyGospel.ts
import { Verse } from "./types";

// 2026년 3월 매일미사 복음 환호성 데이터
// 출처: 가톨릭 굿뉴스 매일미사 (2026년 가해)
export const DAILY_GOSPEL_DB: Record<string, Verse> = {
  "2026-03-01": { id: 20260301, text: "빛나는 구름 속에서 성령이 나타나시고 아버지의 목소리가 들려왔네. 이는 내가 사랑하는 아들, 내 마음에 드는 아들이니, 너희는 그의 말을 들어라.", reference: "마태 17,5", category: "복음 환호성" },
  "2026-03-02": { id: 20260302, text: "주님, 당신 말씀은 영이며 생명이시옵니다. 당신께는 영원한 생명의 말씀이 있나이다.", reference: "요한 6,63.68", category: "복음 환호성" },
  "2026-03-03": { id: 20260303, text: "주님이 말씀하신다. 너희가 지은 모든 죄악을 떨쳐 버리고 새 마음과 새 영을 갖추어라.", reference: "에제 18,31", category: "복음 환호성" },
  "2026-03-04": { id: 20260304, text: "주님이 말씀하신다. 나는 세상의 빛이다. 나를 따르는 이는 생명의 빛을 얻으리라.", reference: "요한 8,12", category: "복음 환호성" },
  "2026-03-05": { id: 20260305, text: "바르고 착한 마음으로 하느님 말씀을 간직하여 인내로 열매를 맺는 사람들은 행복하여라!", reference: "루카 8,15", category: "복음 환호성" },
  "2026-03-06": { id: 20260306, text: "하느님은 세상을 너무나 사랑하신 나머지 외아들을 내주시어 그를 믿는 사람은 누구나 영원한 생명을 얻게 하셨네.", reference: "요한 3,16", category: "복음 환호성" },
  "2026-03-07": { id: 20260307, text: "일어나 아버지께 가서 말하리라. 아버지, 제가 하늘과 아버지께 죄를 지었나이다.", reference: "루카 15,18", category: "복음 환호성" }, //사순 제3주일

  "2026-03-08": { id: 20260308, text: "주님, 당신은 참으로 세상의 구원자이시니 저에게 영원히 목마르지 않을 생명의 물을 주소서.", reference: "요한 4,42.15", category: "복음 환호성" },
  "2026-03-09": { id: 20260309, text: "나 주님께 바라며 그분 말씀에 희망을 두네. 주님께는 자애가 있고 풍요로운 구원이 있네.", reference: "시편 130(129),5.7", category: "복음 환호성" },
  "2026-03-10": { id: 20260310, text: "주님이 말씀하신다. 나는 너그럽고 자비로우니 이제 마음을 다하여 나에게 돌아오너라.", reference: "요엘 2,12-13 ", category: "복음 환호성" },
  "2026-03-11": { id: 20260311, text: "주님, 당신 말씀은 영이며 생명이시옵니다. 당신께는 영원한 생명의 말씀이 있나이다.", reference: "요한 6,63.68", category: "복음 환호성" },
  "2026-03-12": { id: 20260312, text: "주님이 말씀하신다. 나는 너그럽고 자비로우니 이제 마음을 다하여 나에게 돌아오너라.", reference: "마태 4,17", category: "복음 환호성" },
  "2026-03-13": { id: 20260313, text: "주님이 말씀하신다. 회개하여라. 하늘 나라가 가까이 왔다.", reference: "요한 3,16", category: "복음 환호성" },
  "2026-03-14": { id: 20260314, text: "오늘 너희는 주님 목소리에 귀를 기울여라. 너희 마음을 무디게 하지 마라.", reference: "시편 95(94),7.8", category: "복음 환호성" } //사순 제4주일
};

// 날짜를 2자리 문자열로 포맷 (예: 3 → "03")
const padZero = (num: number): string => num.toString().padStart(2, '0');

// 오늘 날짜의 말씀을 안전하게 가져오는 함수
export const getTodayGospel = (): Verse => {
  const today = new Date();
  
  // 월과 일을 2자리로 패딩하여 키 생성 (예: "2026-03-03")
  const dateKey = `${today.getFullYear()}-${padZero(today.getMonth() + 1)}-${padZero(today.getDate())}`;
  
  console.log('🔍 오늘 날짜:', dateKey);
  
  // 1순위: 오늘 날짜 데이터가 있으면 반환
  if (DAILY_GOSPEL_DB[dateKey]) {
    console.log('✅ 오늘의 복음 환호성을 찾았습니다!');
    return DAILY_GOSPEL_DB[dateKey];
  }
  
  console.log('⚠️ 오늘 날짜 데이터 없음, 기본값 사용');
  
  // 2순위: 데이터가 없으면 '사순/연중' 시기에 따른 기본값 반환
  if (today.getMonth() === 1 && today.getDate() >= 18) {
      return {
        id: Date.now(),
        text: "사람은 빵만으로 살지 않고 하느님의 입에서 나오는 모든 말씀으로 산다.",
        reference: "마태 4,4",
        category: "복음 환호성"
      };
  }

  // 그 외(연중 시기) 기본값
  return {
    id: Date.now(),
    text: "행복하여라, 마음이 가난한 사람들! 하늘 나라가 그들의 것이다.",
    reference: "마태 5,3",
    category: "복음 환호성"
  };
};