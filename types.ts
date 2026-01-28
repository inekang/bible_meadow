
export enum Emotion {
  ANGER = '분노',
  ANXIETY = '불안',
  HOPE = '희망',
  FEAR = '두려움',
  PEACE = '평화',
  STRESS = '스트레스',
  PRIDE = '자부심',
  DOUBT = '의심',
  JEALOUSY = '질투',
  JOY = '기쁨',
  HEALING = '치유',
  COURAGE = '용기',
  THANKS = '감사',
  STRENGTH = '힘',
  COMFORT = '위로'
}

export interface Verse {
  id: number;
  text: string;
  reference: string;
  category?: string;
  urls?: { uri: string; title: string }[];
}

export interface BibleBook {
  name: string;
  chapters: number;
  testament: '구약' | '신약';
}

export interface EmotionDetail {
  type: Emotion;
  prayer: string;
  verse: {
    reference: string;
    text: string;
  };
  meditationTip: string;
  icon: string;
  color: string;
}

export interface CatholicPrayer {
  title: string;
  content: string;
}

export type GameState = 
  | 'ONBOARDING' 
  | 'START' 
  | 'EMOTION_CARD' 
  | 'READING'      
  | 'MEDITATION_GUIDE' 
  | 'MEDITATION_PRAYER' 
  | 'EMOTION_DIARY'    
  | 'BIBLE_VIEW'
  | 'ACTIVITY';

export interface UserProgress {
  sheepName?: string;
  totalVersesRead: number;
  graceGems: number; // 은총 선물(보석) 카운트
  readVerseIds: number[];
  level: number;
  emotionHistory: { emotion: Emotion; date: string; note?: string }[];
  lastReadDate?: string;
  dailyStreak: number;
  reminderEnabled: boolean;
}
