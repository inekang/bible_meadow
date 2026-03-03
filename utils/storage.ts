import { UserProgress } from '../types';

const DB_NAME = 'SheepBibleDB';
const STORE_NAME = 'userProgress';
const DB_VERSION = 1;

class StorageManager {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
    });
  }

  async saveProgress(progress: UserProgress): Promise<void> {
    try {
      if (!this.db) await this.init();
      
      return new Promise((resolve, reject) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.put({ id: 'userProgress', ...progress });
        
        request.onsuccess = () => {
          // localStorage도 백업으로 사용
          localStorage.setItem('sheep_bible_progress', JSON.stringify(progress));
          console.log('✅ Progress saved to IndexedDB and localStorage');
          resolve();
        };
        request.onerror = () => {
          console.error('IndexedDB save failed, using localStorage fallback');
          localStorage.setItem('sheep_bible_progress', JSON.stringify(progress));
          resolve(); // localStorage는 성공했으므로 resolve
        };
      });
    } catch (error) {
      console.error('Storage error:', error);
      // 최후의 수단: localStorage만 사용
      localStorage.setItem('sheep_bible_progress', JSON.stringify(progress));
    }
  }

  async getProgress(): Promise<UserProgress | null> {
    try {
      if (!this.db) await this.init();
      
      return new Promise((resolve) => {
        const transaction = this.db!.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get('userProgress');
        
        request.onsuccess = () => {
          const data = request.result;
          if (data) {
            const { id, ...progress } = data;
            console.log('✅ Progress loaded from IndexedDB');
            
            // localStorage도 동기화
            localStorage.setItem('sheep_bible_progress', JSON.stringify(progress));
            resolve(progress);
          } else {
            // IndexedDB에 없으면 localStorage 확인
            const localData = localStorage.getItem('sheep_bible_progress');
            if (localData) {
              const progress = JSON.parse(localData);
              console.log('⚠️ Progress loaded from localStorage fallback');
              // IndexedDB에도 저장
              this.saveProgress(progress);
              resolve(progress);
            } else {
              resolve(null);
            }
          }
        };
        
        request.onerror = () => {
          console.error('IndexedDB load failed, using localStorage fallback');
          const localData = localStorage.getItem('sheep_bible_progress');
          resolve(localData ? JSON.parse(localData) : null);
        };
      });
    } catch (error) {
      console.error('Storage error:', error);
      // 에러 시 localStorage 폴백
      const localData = localStorage.getItem('sheep_bible_progress');
      return localData ? JSON.parse(localData) : null;
    }
  }
}

export const storage = new StorageManager();
