// Game state types
export type GameState = 
  | 'ONBOARDING' 
  | 'START' 
  | 'SETTINGS'
  | 'PROFILE'
  | 'EMOTION_CARD' 
  | 'READING' 
  | 'MEDITATION_GUIDE' 
  | 'MEDITATION_PRAYER'
  | 'MEDITATION_SILENT' 
  | 'EMOTION_DIARY' 
  | 'BIBLE_VIEW';

export enum Emotion {
  ANGER = '분노',
  ANXIETY = '불안',
  HOPE = '희망',
  FEAR = '두려움',
  PEACE = '근심',
  STRESS = '스트레스',
  PRIDE = '교만',
  DOUBT = '의심',
  JEALOUSY = '질투',
  JOY = '기쁨',
  HEALING = '치유',
  COURAGE = '용기',
  THANKS = '감사',
  WEAKNESS = '약함',
  COMFORT = '위로',
  TIRED = '지침',
  COMPASSION = '연민',
  LONELYNESS = '외로움'
}

export interface Verse {
  id: number;
  text: string;
  reference: string;
  category: string;
}

export interface EmotionDetail {
  type: Emotion;
  icon: string;
  color: string;
  verse: {
    text: string;
    reference: string;
  };
  prayer: string;
  meditationTip: string;
  
}

export interface EmotionEntry {
  emotion: Emotion;
  timestamp: number;
  note?: string;
}

export interface UserProgress {
  sheepName?: string;
  totalVersesRead: number;
  graceGems?: number;
  readVerseIds: number[];
  level: number;
  emotionHistory: EmotionEntry[];
  dailyStreak: number;
  reminderEnabled: boolean;
  // Profile fields
  nickname?: string;
  baptismalName?: string;
  feastDay?: string;
  startDate?: string;
   profileImage?: string;
}

export interface CatholicPrayer {
  title: string;
  content: string;
}
