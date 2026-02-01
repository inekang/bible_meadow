
import { Emotion, EmotionDetail } from './types';

export const EMOTION_DB: Record<Emotion, EmotionDetail> = {
  [Emotion.HOPE]: {
    type: Emotion.HOPE,
    icon: '☀️',
    color: '#FFF9E5',
    prayer: "하느님, 제 마음을 하늘에 고정시키시고, 성인들의 기쁨처럼 실망 없는 희망으로 채우소서. 주님의 은총으로 어두운 밤을 넘어 당신 현존에 이르게 하소서.",
    verse: {
      reference: "히브리 6,19",
      text: "우리가 가진 희망은 영혼의 닻과 같아, 이 희망은 우리를 들어가게 하는 베일 안쪽, 즉 성소까지 닿아 있다."
    },
    meditationTip: "어두운 밤 속 고정된 희망을 강조합니다. '닻' 이미지를 상상하며 기도해 보세요."
  },
  [Emotion.FEAR]: {
    type: Emotion.FEAR,
    icon: '🌙',
    color: '#E9EAFF',
    prayer: "주님, 수많은 두려움이 나를 에워싸오나, 당신의 말씀으로 제 마음을 밝히소서. '주의 말씀은 빛'이니, 어둠 속에서 평화로 인도하소서.",
    verse: {
      reference: "시편 27,1",
      text: "주님은 나의 빛이요 나의 구원이시니 내가 누구를 두려워하랴? 주님은 나의 생명의 요새이시니 내가 무엇을 무서워하랴?"
    },
    meditationTip: "기도 중 호흡하며 '빛'으로 불안을 비추어 보세요. 시편 환호성을 되새기면 좋습니다."
  },
  [Emotion.PEACE]: {
    type: Emotion.PEACE,
    icon: '🍃',
    color: '#E5F9F0',
    prayer: "평화의 왕이신 주님, 제 영혼에 당신의 평화를 주소서. 주님의 말씀처럼 감사로 마음을 열고, 모든 근심을 당신께 맡깁니다.",
    verse: {
      reference: "요한 14,27",
      text: "평화를 빼앗기지 않도록 내가 너희에게 평화를 남겨 주고 준다. 세상이 주는 것처럼 내가 너희에게 주는 것이 아니다."
    },
    meditationTip: "평화 기도 후 침묵과 함께 성체 조배를 한다면 더욱 좋아요."
  },
  [Emotion.STRESS]: {
    type: Emotion.STRESS,
    icon: '🌪️',
    color: '#F0F0F0',
    prayer: "성령이시여, 일상의 압박과 불안을 정화하시고, 주님 현존 안에서 쉬게 하소서. 감사로 기도하나이다: 당신이 함께하시니 두렵지 않나이다.",
    verse: {
      reference: "필립 4,6-7",
      text: "아무것도 염려하지 말고 다만 모든 일에 감사하면서 기도와 간청으로 너희 요청을 하느님께 알려라. 그리하면 모든 지각에 뛰어난 하느님의 평화가 너희 마음과 생각을 지켜 주실 것이다."
    },
    meditationTip: "떠오르는 감사할 일들을 떠올려보고 하느님께 감사의 마음을 전합니다."
  },
  [Emotion.PRIDE]: {
    type: Emotion.PRIDE,
    icon: '👑',
    color: '#FFF2E5',
    prayer: "겸손하신 주님, 제 자부심을 녹이시고, 당신 말씀 앞에 무릎 꿇게 하소서. 미사 환호성처럼 당신 영광만 노래하게 하소서.",
    verse: {
      reference: "야고보 4,6.10",
      text: "하느님께서는 교만한 자를 미워하시고 겸손한 자에게 은총을 주신다. 주님 앞에 굴복하라. 그러면 그분께서 너희를 일으켜 세워 주실 것이다."
    },
    meditationTip: "무릎을 꿇고 기도를 해보세요. 나를 낮추는 겸손에 도움이 됩니다."
  },
  [Emotion.DOUBT]: {
    type: Emotion.DOUBT,
    icon: '❓',
    color: '#F5F5F5',
    prayer: "하느님, 기도의 유익성을 의심할 때 겸손과 신뢰로 응답하게 하소서. 당신 말씀처럼 '작은 믿음아, 어찌 의심하느냐' 하시며 제 마음을 굳건케 하소서.",
    verse: {
      reference: "마르코 9,24",
      text: "제자가 소리쳐 말했다. '제가 믿나이다. 불신을 도와주소서.'"
    },
    meditationTip: "의심 기도 중 다윗이 외쳤던 것처럼 믿음으로 시작하여 하느님 현존을 느껴보세요."
  },
  [Emotion.JEALOUSY]: {
    type: Emotion.JEALOUSY,
    icon: '🌵',
    color: '#F5FFE5',
    prayer: "주님, 질투의 유혹을 물리치시고, 형제의 은사를 함께 기뻐하게 하소서. 우리는 같은 배를 타고 같은 항구로 가나이다.",
    verse: {
      reference: "시편 37,1",
      text: "악인을 부러워하지 말고 불의를 행하는 자들을 시기하지 마라."
    },
    meditationTip: "타인의 기쁨을 나의 기쁨으로 봉헌하는 마음을 가져보세요."
  },
  [Emotion.JOY]: {
    type: Emotion.JOY,
    icon: '🎈',
    color: '#FFF9E5',
    prayer: "항상 기쁨으로 기도하나이다. 주님의 완전한 기쁨으로 제 마음을 채우시고, 슬픔 속에서도 감사하게 하소서.",
    verse: {
      reference: "네헤미야 8,10",
      text: "슬퍼하지 마라. 주님을 기뻐하라. 그분이 너희 힘이 되신다."
    },
    meditationTip: "주님이 주시는 기쁨이 내 삶의 가장 큰 힘임을 고백해 보세요."
  },
  [Emotion.HEALING]: {
    type: Emotion.HEALING,
    icon: '🩹',
    color: '#E5FFF5',
    prayer: "기도의 열쇠로 하늘 은총을 주소서. 성령의 인도로 제 영혼과 몸의 치유를 주시고, 사탄의 유혹에서 자유롭게 하소서.",
    verse: {
      reference: "야고보 5,15",
      text: "믿음의 기도는 병든 이를 구원하리라. 만일 죄를 지었다면 용서받을 것이다."
    },
    meditationTip: "하느님의 치유하는 광선이 나를 감싸고 있다고 느껴보세요."
  },
  [Emotion.COURAGE]: {
    type: Emotion.COURAGE,
    icon: '🦁',
    color: '#FFECE5',
    prayer: "기도의 전투에서 인내와 용기를 주소서. 당신 불꽃처럼 제 영혼을 불태우시고, 두려움 없이 현존 안으로 나아가게 하소서.",
    verse: {
      reference: "여호수아 1,9",
      text: "내가 네게 명한 것 곧 강하고 담대하라. 두려워하거나 낙심하지 마라. 네가 어디로 가든지 네 하느님 주님이 너와 함께 하신다."
    },
    meditationTip: "어떤 상황에서도 주님이 내 편이심을 굳게 믿으며 기도하세요."
  },
  [Emotion.THANKS]: {
    type: Emotion.THANKS,
    icon: '🙏',
    color: '#FFF2E5',
    prayer: "하느님, 오늘 저에게 주신 모든 은총에 감사드립니다. 주님의 사랑이 제 삶에 가득함을 고백합니다.",
    verse: {
      reference: "1테살 5,18",
      text: "모든 일에 감사하십시오. 이것이 그리스도 예수님 안에서 살아가는 여러분에게 바라는 하느님의 뜻입니다."
    },
    meditationTip: "오늘 하루 감사했던 일 세 가지를 떠올려 보세요."
  },
  [Emotion.STRENGTH]: {
    type: Emotion.STRENGTH,
    icon: '💪',
    color: '#E5F0FF',
    prayer: "주님, 저에게 힘을 주소서. 제 약함을 당신의 강함으로 채우시고, 어떤 어려움도 이겨낼 용기를 주소서.",
    verse: {
      reference: "필립 4,13",
      text: "나에게 힘을 주시는 분 안에서 나는 모든 것을 할 수 있습니다."
    },
    meditationTip: "주님이 주시는 힘이 내 몸을 감싸고 있다고 느껴보세요."
  },
  [Emotion.COMFORT]: {
    type: Emotion.COMFORT,
    icon: '✨',
    color: '#F5E5FF',
    prayer: "주님, 지친 제 마음을 위로해 주소서. 당신의 품 안에서 참된 안식을 누리게 하소서.",
    verse: {
      reference: "마태 11,28",
      text: "고생하며 무거운 짐을 진 너희는 모두 나에게 오너라. 내가 너희에게 안식을 주겠다."
    },
    meditationTip: "하느님의 따뜻한 포옹 속에 있다고 상상해 보세요."
  },
  [Emotion.ANGER]: {
    type: Emotion.ANGER,
    icon: '🔥',
    color: '#FFE5E5',
    prayer: "주님, 제 안의 분노를 가라앉혀 주소서. 당신의 온유함을 닮아 평안을 찾게 하소서.",
    verse: {
      reference: "에페 4,26",
      text: "화가 나더라도 죄를 짓지 마십시오. 해가 질 때까지 노여움을 품고 있지 마십시오."
    },
    meditationTip: "분노의 감정을 하느님께 솔직하게 털어놓으세요."
  },
  [Emotion.ANXIETY]: {
    type: Emotion.ANXIETY,
    icon: '🌊',
    color: '#E5F0FF',
    prayer: "근심에 싸인 제 마음을 당신께 맡깁니다. 당신은 저의 반석이시요 구원이십니다.",
    verse: {
      reference: "시편 55,23",
      text: "네 무거운 짐 주님께 맡겨 드려라. 그분께서 너를 붙들어 주시리라."
    },
    meditationTip: "불안한 마음을 물 위에 띄워 보내는 상상을 하세요."
  },
  [Emotion.TIRED]: {
    type: Emotion.TIRED,
    icon: '🫩',
    color: '#FFF9E5',
    prayer: "하느님, 제 지친 마음을 당신께 맡깁니다. 당신 뜻대로 새 힘 주소서.",
    verse: {
      reference: "이사야서 40,31",
      text: "주님께 바라는 이들은 새 힘을 얻고 독수리처럼 날개치며 올라간다. 그들은 뛰어도 지칠 줄 모르고 걸어도 피곤한 줄 모른다."
    },
    meditationTip: "편안히 앉아 깊이 숨쉬며 몸의 피로를 느끼세요. 주변 소음을 내려놓고 하느님 앞에 서는 독수리처럼 자유로워지는 상상을 해보세요"
  },
  [Emotion.COMPASSION]: {
    type: Emotion.COMPASSION,
    icon: '💖',
    color: '#FFF9E5',
    prayer: "하느님, 자비의 문으로 인도해주소서.가난한 이에게 자비를 베푸는 당신 모습을 본받아 저도 사랑과 연민으로 살아가게 하소서.",
    verse: {
      reference: "루카 1,50",
      text: "그분의 이름은 거룩하고 그분의 자비는 대대로 당신을 경외하는 이들에게 미칩니다."
    },
    meditationTip: "조용히 앉아 호흡하며 마음을 가다듬으세요. 구절을 미리 떠올리며 자비의 기대감을 품으세요."
  },
};

export const MEDITATION_COMMON_PRAYER = "주님, 당신의 부활의 기쁨으로 제 영혼을 밝히소서. 당신 영광을 위해 제 모든 것을 사용하게 하시고, 당신 현존에서 영적 기쁨을 누리게 하소서. 아멘.";
