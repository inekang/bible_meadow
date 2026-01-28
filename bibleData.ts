
import { BibleBook } from './types';

export const CATHOLIC_BIBLE_DB: BibleBook[] = [
  // 구약 성경 (46권)
  { name: '창세기', chapters: 50, testament: '구약' },
  { name: '탈출기', chapters: 40, testament: '구약' },
  { name: '레위기', chapters: 27, testament: '구약' },
  { name: '민수기', chapters: 36, testament: '구약' },
  { name: '신명기', chapters: 34, testament: '구약' },
  { name: '여호수아기', chapters: 24, testament: '구약' },
  { name: '판관기', chapters: 21, testament: '구약' },
  { name: '룻기', chapters: 4, testament: '구약' },
  { name: '사무엘기 상권', chapters: 31, testament: '구약' },
  { name: '사무엘기 하권', chapters: 24, testament: '구약' },
  { name: '열왕기 상권', chapters: 22, testament: '구약' },
  { name: '열왕기 하권', chapters: 25, testament: '구약' },
  { name: '역대기 상권', chapters: 29, testament: '구약' },
  { name: '역대기 하권', chapters: 36, testament: '구약' },
  { name: '에즈라기', chapters: 10, testament: '구약' },
  { name: '느헤미야기', chapters: 13, testament: '구약' },
  { name: '토빗기', chapters: 14, testament: '구약' },
  { name: '유딧기', chapters: 16, testament: '구약' },
  { name: '에스테르기', chapters: 10, testament: '구약' },
  { name: '마카베오기 상권', chapters: 16, testament: '구약' },
  { name: '마카베오기 하권', chapters: 15, testament: '구약' },
  { name: '욥기', chapters: 42, testament: '구약' },
  { name: '시편', chapters: 150, testament: '구약' },
  { name: '잠언', chapters: 31, testament: '구약' },
  { name: '코헬렛', chapters: 12, testament: '구약' },
  { name: '아가', chapters: 8, testament: '구약' },
  { name: '지혜서', chapters: 19, testament: '구약' },
  { name: '집회서', chapters: 51, testament: '구약' },
  { name: '이사야서', chapters: 66, testament: '구약' },
  { name: '예레미야서', chapters: 52, testament: '구약' },
  { name: '애가', chapters: 5, testament: '구약' },
  { name: '바룩서', chapters: 6, testament: '구약' },
  { name: '에제키엘서', chapters: 48, testament: '구약' },
  { name: '다니엘서', chapters: 14, testament: '구약' },
  { name: '호세아서', chapters: 14, testament: '구약' },
  { name: '요엘서', chapters: 4, testament: '구약' },
  { name: '아모스서', chapters: 9, testament: '구약' },
  { name: '오바디야서', chapters: 1, testament: '구약' },
  { name: '요나서', chapters: 4, testament: '구약' },
  { name: '미카서', chapters: 7, testament: '구약' },
  { name: '나훔서', chapters: 3, testament: '구약' },
  { name: '하바쿡서', chapters: 3, testament: '구약' },
  { name: '스판야서', chapters: 3, testament: '구약' },
  { name: '하까이서', chapters: 2, testament: '구약' },
  { name: '즈카르야서', chapters: 14, testament: '구약' },
  { name: '말라키서', chapters: 3, testament: '구약' },

  // 신약 성경 (27권)
  { name: '마태오 복음서', chapters: 28, testament: '신약' },
  { name: '마르코 복음서', chapters: 16, testament: '신약' },
  { name: '루카 복음서', chapters: 24, testament: '신약' },
  { name: '요한 복음서', chapters: 21, testament: '신약' },
  { name: '사도행전', chapters: 28, testament: '신약' },
  { name: '로마 신자들에게 보낸 서간', chapters: 16, testament: '신약' },
  { name: '코린토 신자들에게 보낸 첫째 서간', chapters: 16, testament: '신약' },
  { name: '코린토 신자들에게 보낸 둘째 서간', chapters: 13, testament: '신약' },
  { name: '갈라티아 신자들에게 보낸 서간', chapters: 6, testament: '신약' },
  { name: '에페소 신자들에게 보낸 서간', chapters: 6, testament: '신약' },
  { name: '필리피 신자들에게 보낸 서간', chapters: 4, testament: '신약' },
  { name: '콜로새 신자들에게 보낸 서간', chapters: 4, testament: '신약' },
  { name: '테살로니카 신자들에게 보낸 첫째 서간', chapters: 5, testament: '신약' },
  { name: '테살로니카 신자들에게 보낸 둘째 서간', chapters: 3, testament: '신약' },
  { name: '티모테오에게 보낸 첫째 서간', chapters: 6, testament: '신약' },
  { name: '티모테오에게 보낸 둘째 서간', chapters: 4, testament: '신약' },
  { name: '티토에게 보낸 서간', chapters: 3, testament: '신약' },
  { name: '필레몬에게 보낸 서간', chapters: 1, testament: '신약' },
  { name: '히브리인들에게 보낸 서간', chapters: 13, testament: '신약' },
  { name: '야고보 서간', chapters: 5, testament: '신약' },
  { name: '베드로 첫째 서간', chapters: 5, testament: '신약' },
  { name: '베드로 둘째 서간', chapters: 3, testament: '신약' },
  { name: '요한 첫째 서간', chapters: 5, testament: '신약' },
  { name: '요한 둘째 서간', chapters: 1, testament: '신약' },
  { name: '요한 셋째 서간', chapters: 1, testament: '신약' },
  { name: '유다 서간', chapters: 1, testament: '신약' },
  { name: '요한 묵시록', chapters: 22, testament: '신약' }
];

// 자주 읽는 구절 로컬 캐시 (초기 로딩 속도 최적화)
export const SEED_VERSES: Record<string, any[]> = {
  "창세기 1": [
    { id: 1001, text: "한처음에 하느님께서 하늘과 땅을 창조하셨다.", reference: "창세 1,1" },
    { id: 1002, text: "하느님께서 말씀하시기를 “빛이 생겨라.” 하시자 빛이 생겼다.", reference: "창세 1,3" },
    { id: 1003, text: "하느님께서 보시니 손수 만드신 모든 것이 참 좋았다.", reference: "창세 1,31" }
  ],
  "시편 1": [
    { id: 1004, text: "행복하여라! 악인들의 뜻에 따라 걷지 않는 사람.", reference: "시편 1,1" },
    { id: 1005, text: "오히려 주님의 가르침을 즐기며 밤낮으로 그 가르침을 되새기는 사람.", reference: "시편 1,2" },
    { id: 1006, text: "그는 시냇가에 심겨 제때에 열매를 내며 잎이 시들지 않는 나무와 같아 하는 일마다 잘되리라.", reference: "시편 1,3" }
  ],
  "마태오 복음서 1": [
    { id: 1007, text: "다윗의 자손이시며 아브라함의 자손이신 예수 그리스도의 족보.", reference: "마태 1,1" },
    { id: 1008, text: "아브라함은 이사악을 낳고 이사악은 야곱을 낳았으며 야곱은 유다와 그 형제들을 낳았다.", reference: "마태 1,2" },
    { id: 1009, text: "유다는 타마르에게서 페레츠와 제라를 낳고 페레츠는 헤츠론을 낳았으며 헤츠론은 람을 낳았다.", reference: "마태 1,3" }
  ],
  "마르코 복음서 1": [
    { id: 1010, text: "하느님의 아드님 예수 그리스도의 복음의 시작.", reference: "마르 1,1" },
    { id: 1011, text: "때가 차서 하느님의 나라가 가까이 왔다. 회개하고 복음을 믿어라.", reference: "마르 1,15" },
    { id: 1012, text: "예수님께서는 곧바로 제자들을 부르셨다.", reference: "마르 1,20" }
  ],
  "루카 복음서 1": [
    { id: 1013, text: "기뻐하여라, 은총이 가득한 이여, 주님께서 너와 함께 계시다.", reference: "루카 1,28" },
    { id: 1014, text: "보십시오, 저는 주님의 종입니다. 말씀하신 대로 저에게 이루어지기를 바랍니다.", reference: "루카 1,38" },
    { id: 1015, text: "내 영혼이 주님을 찬송하고 내 마음이 나의 구원자 하느님 안에서 기뻐 뛰니.", reference: "루카 1,46-47" }
  ],
  "요한 복음서 1": [
    { id: 1016, text: "한처음에 말씀이 계셨다. 말씀은 하느님과 함께 계셨는데 말씀은 하느님이셨다.", reference: "요한 1,1" },
    { id: 1017, text: "그분 안에서 생명이 있었으니 그 생명은 사람들의 빛이었다.", reference: "요한 1,4" },
    { id: 1018, text: "말씀이 사람이 되시어 우리 가운데 사셨다. 우리는 그분의 영광을 보았다.", reference: "요한 1,14" }
  ]
};
