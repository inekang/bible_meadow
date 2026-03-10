import { Preferences } from '@capacitor/preferences';

// ✅ 익명 사용자 ID (첫 실행 시 자동 생성)
export async function getOrCreateUserId(): Promise<string> {
  const { value } = await Preferences.get({ key: 'sheep_user_id' });
  if (value) return value;

  const newId = crypto.randomUUID();
  await Preferences.set({ key: 'sheep_user_id', value: newId });
  return newId;
}

// 저장
export async function saveProgress(progress: object) {
  await Preferences.set({
    key: 'sheep_bible_progress',
    value: JSON.stringify(progress)
  });
}

// 불러오기
export async function loadProgress() {
  const { value } = await Preferences.get({ key: 'sheep_bible_progress' });
  return value ? JSON.parse(value) : null;
}