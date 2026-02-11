
import { Verse, BibleBook } from './types';

export const CATHOLIC_BIBLE: BibleBook[] = [
  // 구약성경 (Pentateuch)
  { name: '창세기', chapters: 50, testament: '구약' },
  { name: '탈출기', chapters: 40, testament: '구약' },
  { name: '레위기', chapters: 27, testament: '구약' },
  { name: '민수기', chapters: 36, testament: '구약' },
  { name: '신명기', chapters: 34, testament: '구약' },
  // 역사서 (Partial)
  { name: '여호수아기', chapters: 24, testament: '구약' },
  { name: '판관기', chapters: 21, testament: '구약' },
  { name: '룻기', chapters: 4, testament: '구약' },
  { name: '사무엘기 상권', chapters: 31, testament: '구약' },
  { name: '사무엘기 하권', chapters: 24, testament: '구약' },
  // 시서와 지혜서
  { name: '시편', chapters: 150, testament: '구약' },
  { name: '잠언', chapters: 31, testament: '구약' },
  // 신약성경 (Gospels)
  { name: '마태오 복음서', chapters: 28, testament: '신약' },
  { name: '마르코 복음서', chapters: 16, testament: '신약' },
  { name: '루카 복음서', chapters: 24, testament: '신약' },
  { name: '요한 복음서', chapters: 21, testament: '신약' },
  { name: '사도행전', chapters: 28, testament: '신약' },
  { name: '로마 신자들에게 보낸 서간', chapters: 16, testament: '신약' },
  { name: '요한 묵시록', chapters: 22, testament: '신약' }
];

export const BIBLE_VERSES: Verse[] = [
  { "id": 1, "text": "하느님은 사랑이십니다.", "reference": "1요한 4:8", "category": "새싹" },
  { "id": 2, "text": "주님은 나의 목자, 나는 아쉬울 것 없어라.", "reference": "시편 23:1", "category": "새싹" },
  { "id": 16, "text": "고생하며 무거운 짐을 진 너희는 모두 나에게 오너라. 내가 너희에게 안식을 주겠다.", "reference": "마태 11:28", "category": "열매" },
  { "id": 17, "text": "사실 하늘 나라는 이 어린이들과 같은 사람들의 것이다.", "reference": "마태 19:14", "category": "열매" },
  { "id": 18, "text": "사람은 빵만으로 살지 않고 하느님의 입에서 나오는 모든 말씀으로 산다.", "reference": "마태 4:4", "category": "열매" }
];



export const LEVEL_REQUIREMENTS = [10, 25, 50, 100];
