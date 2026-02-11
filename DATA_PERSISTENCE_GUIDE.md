# 데이터 영구 저장 가이드

아이들의 은총 점수가 재접속 시 초기화되는 문제를 해결하는 방법입니다.

## ✅ 현재 구현됨: IndexedDB + localStorage 이중 저장

`utils/storage.ts` 파일이 추가되었으며, 다음과 같이 작동합니다:

### 특징:
1. **IndexedDB** (메인 저장소)
   - 브라우저에서 가장 안정적인 저장 방식
   - iOS Safari에서도 잘 작동
   - 앱 삭제 전까지 영구 보존

2. **localStorage** (백업 저장소)
   - IndexedDB 실패 시 폴백으로 사용
   - 간단하고 빠름

3. **자동 복구**
   - IndexedDB 손상 시 localStorage에서 복구
   - localStorage만 있으면 IndexedDB에 자동 복사

### 사용법:
```typescript
import { storage } from './utils/storage';

// 저장
await storage.saveProgress(progress);

// 불러오기
const progress = await storage.getProgress();
```

---

## 🚀 추가 옵션: 클라우드 동기화 (선택사항)

완전히 안전한 데이터 보존을 위해 클라우드 저장소 사용을 권장합니다.

### 방법 1: Firebase (가장 간단)

#### 1. Firebase 프로젝트 생성
1. https://console.firebase.google.com/ 접속
2. 프로젝트 생성
3. Firestore Database 활성화

#### 2. 패키지 설치
```bash
npm install firebase
```

#### 3. 파일 생성: `utils/cloudStorage.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { storage } from './storage';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Device UUID 생성 (기기 식별용)
function getDeviceId(): string {
  let deviceId = localStorage.getItem('device_uuid');
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('device_uuid', deviceId);
  }
  return deviceId;
}

// 클라우드에 저장
export async function saveToCloud(progress: UserProgress) {
  const deviceId = getDeviceId();
  
  try {
    // 클라우드 저장
    await setDoc(doc(db, 'users', deviceId), {
      ...progress,
      lastUpdated: new Date().toISOString()
    });
    
    // 로컬도 저장
    await storage.saveProgress(progress);
    
    console.log('✅ 클라우드 저장 완료');
  } catch (error) {
    console.error('❌ 클라우드 저장 실패, 로컬만 저장:', error);
    await storage.saveProgress(progress);
  }
}

// 클라우드에서 불러오기
export async function loadFromCloud(): Promise<UserProgress | null> {
  const deviceId = getDeviceId();
  
  try {
    const docRef = doc(db, 'users', deviceId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const cloudData = docSnap.data() as UserProgress;
      console.log('✅ 클라우드에서 복구');
      
      // 로컬에도 저장
      await storage.saveProgress(cloudData);
      return cloudData;
    }
  } catch (error) {
    console.error('❌ 클라우드 로드 실패, 로컬 사용:', error);
  }
  
  // 클라우드 실패 시 로컬에서 불러오기
  return await storage.getProgress();
}
```

#### 4. App.tsx 수정
```typescript
import { saveToCloud, loadFromCloud } from './utils/cloudStorage';

// 초기 로드
useEffect(() => {
  const loadProgress = async () => {
    const saved = await loadFromCloud(); // 클라우드 우선
    if (saved) {
      setProgress(saved);
      if (saved.sheepName) setGameState('START');
    }
  };
  loadProgress();
}, []);

// 저장 시
const saveDiary = async () => {
  // ... progress 업데이트
  setProgress(updatedProgress);
  await saveToCloud(updatedProgress); // 클라우드 저장
  // ...
};
```

---

### 방법 2: Supabase (무료 PostgreSQL)

Supabase는 Firebase 대안으로 PostgreSQL 기반입니다.

```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://your-project.supabase.co',
  'your-anon-key'
);

export async function saveToSupabase(progress: UserProgress) {
  const deviceId = getDeviceId();
  
  const { error } = await supabase
    .from('user_progress')
    .upsert({ device_id: deviceId, ...progress });
    
  if (error) console.error('Supabase 저장 실패:', error);
}
```

---

## 📱 하이브리드 앱용: Capacitor Preferences

Capacitor/Cordova 사용 시 네이티브 저장소 사용:

```bash
npm install @capacitor/preferences
```

```typescript
import { Preferences } from '@capacitor/preferences';

export async function saveNative(progress: UserProgress) {
  await Preferences.set({
    key: 'sheep_bible_progress',
    value: JSON.stringify(progress)
  });
}

export async function loadNative(): Promise<UserProgress | null> {
  const { value } = await Preferences.get({ key: 'sheep_bible_progress' });
  return value ? JSON.parse(value) : null;
}
```

---

## 🎯 권장 설정

### 개인 앱 / 소규모
- ✅ **IndexedDB + localStorage** (현재 구현됨)
- 추가 설정 불필요
- 앱 삭제 전까지 안전

### 여러 기기에서 사용 / 백업 필요
- ✅ **Firebase + IndexedDB**
- 클라우드 동기화로 완벽한 보존
- 기기 변경해도 데이터 유지

---

## 🔍 디버깅

### 데이터 확인하기
```javascript
// 브라우저 콘솔에서
localStorage.getItem('sheep_bible_progress')

// IndexedDB 확인
// Chrome DevTools → Application → IndexedDB → SheepBibleDB
```

### 데이터 초기화 (테스트용)
```javascript
localStorage.clear();
indexedDB.deleteDatabase('SheepBibleDB');
```

---

## 💡 요약

| 방법 | 안정성 | 구현 난이도 | 비용 | 추천 |
|------|--------|-------------|------|------|
| IndexedDB (현재) | ⭐⭐⭐⭐ | ✅ 완료 | 무료 | ✅ 기본 |
| Firebase | ⭐⭐⭐⭐⭐ | 쉬움 | 무료~유료 | ✅✅ 최고 |
| Supabase | ⭐⭐⭐⭐⭐ | 보통 | 무료~유료 | ✅ 대안 |
| Capacitor | ⭐⭐⭐⭐⭐ | 쉬움 | 무료 | ✅ 네이티브 앱 |

**현재 상태로도 충분히 안전합니다!** 추가로 클라우드 동기화가 필요하면 Firebase 사용을 권장합니다.
