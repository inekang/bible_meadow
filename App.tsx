import React, { useState, useEffect, useRef } from 'react';
import { GameState, UserProgress, Emotion, Verse, EmotionDetail, CatholicPrayer } from './types';
import { BIBLE_VERSES } from './constants';
import { EMOTION_DB } from './emotionData';
import { CATHOLIC_PRAYERS } from './prayerData';
import { fetchDailyGospelAcclamation } from './services/geminiService';
import { storage } from './utils/storage';
import Meadow from './components/Meadow';
import SheepCharacter from './components/SheepCharacter';
import { SettingsPage } from './components/SettingsPage';
import { ProfilePage } from './components/ProfilePage';
import bgmPiano from './assets/sounds/bgm4.mp3';
import bgmNature from './assets/sounds/bgm3.mp3';
import bgmSing from "./assets/sounds/emao.mp3";

const App: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('sheep_bible_progress');
    const base: UserProgress = { 
      totalVersesRead: 0, 
      graceGems: 0,
      readVerseIds: [], 
      level: 0, 
      emotionHistory: [], 
      dailyStreak: 0, 
      reminderEnabled: false,
      // Profile data with defaults
      nickname: '',
      baptismalName: '',
      feastDay: '',
      startDate: ''
    };
    return saved ? { ...base, ...JSON.parse(saved) } : base;
  });

  const [bgm, setBgm] = useState<'none' | 'piano' | 'nature' |'sing'>('none');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;

    if (bgm === 'none') {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    } else {
      let selectedSrc = bgmPiano;
      if (bgm === 'nature') selectedSrc = bgmNature;
      if (bgm === 'sing') selectedSrc = bgmSing;

      audioRef.current.src = selectedSrc;
      audioRef.current.volume = 0.3; 
      audioRef.current.play().catch(e => console.log("자동 재생 정책에 의해 막힘:", e));
    }
  }, [bgm]);

  const [gameState, setGameState] = useState<GameState>(progress.sheepName ? 'START' : 'ONBOARDING');
  const [tempName, setTempName] = useState("");
  const [dailyVerse, setDailyVerse] = useState<Verse>(BIBLE_VERSES[0]); 
  const [currentVerse, setCurrentVerse] = useState<Verse>(BIBLE_VERSES[0]);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionDetail | null>(null);
  const [diaryText, setDiaryText] = useState(""); 
  const [readCount, setReadCount] = useState(0); 
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });
  
  const [selectedPrayer, setSelectedPrayer] = useState<CatholicPrayer>(CATHOLIC_PRAYERS[0]);
  const [isPrayerDrawerOpen, setIsPrayerDrawerOpen] = useState(false);
  
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [prayerWords, setPrayerWords] = useState<string[]>([]);
  const [highlightIndices, setHighlightIndices] = useState<Set<number>>(new Set());
  const recognitionRef = useRef<any>(null);
  
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [showMicPermissionAlert, setShowMicPermissionAlert] = useState(false);
  
  const [prayerTimer, setPrayerTimer] = useState(90); // 90초 타이머
  const timerRef = useRef<number | null>(null);

  // IndexedDB에서 데이터 로드
  useEffect(() => {
    const loadProgress = async () => {
      const saved = await storage.getProgress();
      if (saved) {
        setProgress(saved);
        if (saved.sheepName) {
          setGameState('START');
        }
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const loadDaily = async () => {
      try {
        const fetched = await fetchDailyGospelAcclamation();
        setDailyVerse(fetched);
      } catch (err) {
        console.error("Daily verse load failed", err);
      }
    };
    loadDaily();
  }, []);

  useEffect(() => {
    if (gameState === 'EMOTION_DIARY') {
      setDiaryText("");
    }
    // MEDITATION_PRAYER 진입 시 마이크 권한 상태 초기화 (사용자가 설정에서 권한 변경했을 수 있음)
    if (gameState === 'MEDITATION_PRAYER') {
      setMicPermissionDenied(false);
    }
  }, [gameState]);

  useEffect(() => {
    const words = selectedPrayer.content.split(/\s+/);
    setPrayerWords(words);
    setHighlightIndices(new Set());
    setRecognizedText("");
  }, [selectedPrayer]);

  // 타이머 기도 useEffect
  useEffect(() => {
    if (gameState === 'MEDITATION_SILENT') {
      setPrayerTimer(90); // 타이머 리셋
      timerRef.current = window.setInterval(() => {
        setPrayerTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            // 타이머 완료 처리
            setTimeout(() => {
              const updatedProgress = { 
                ...progress, 
                graceGems: (progress.graceGems || 0) + 10 
              };
              setProgress(updatedProgress);
              storage.saveProgress(updatedProgress);
              setGameState('EMOTION_DIARY');
              showToast("기도의 은총 선물을 받았습니다! 💎 +10");
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2000);
  };

  const stripMarkdown = (text: string) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleEmotionSelect = (emotion: Emotion) => {
    const detail = EMOTION_DB[emotion];
    if (detail) {
      setSelectedEmotion(detail);
      setCurrentVerse({
        id: Date.now(),
        text: detail.verse.text,
        reference: detail.verse.reference,
        category: '감정'
      });
      
      setSelectedPrayer({
        title: `${emotion} 기도`,
        content: detail.prayer
      });

      setReadCount(0);
      setGameState('READING');
    }
  };

  const shareVerseAsImage = async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#2E3192');
    gradient.addColorStop(1, '#4A4EAD');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    for (let i = 0; i < 100; i++) {
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height * 0.7, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.font = 'bold 40px Noto Sans KR';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText(stripMarkdown(currentVerse.reference), canvas.width / 2, 300);

    ctx.font = 'bold 64px Noto Sans KR';
    ctx.fillStyle = 'white';
    const text = stripMarkdown(currentVerse.text);
    const words = text.split(' ');
    let line = '';
    let y = 500;
    const lineHeight = 90;
    const maxWidth = 900;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    ctx.font = '30px Noto Sans KR';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText(`© ${progress.sheepName || '양떼들의'} 말씀읽기`, canvas.width / 2, canvas.height - 100);

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], 'bible-verse.png', { type: 'image/png' });
        
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '오늘의 성경 말씀',
            text: `[${stripMarkdown(currentVerse.reference)}] ${stripMarkdown(currentVerse.text)}`
          });
        } else {
          const shareText = `[${stripMarkdown(currentVerse.reference)}]\n${stripMarkdown(currentVerse.text)}\n\n- ${progress.sheepName || '양떼'}의 말씀읽기 중에서 -`;
          await navigator.share({ title: '오늘의 성경 말씀', text: shareText });
        }
      });
    } catch (e) {
      showToast("공유하기를 준비하는 중 문제가 생겼어요.");
    }
  };

  const startListening = async () => {
    // 마이크 권한 체크
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // 권한 확인만 하고 바로 종료
      setMicPermissionDenied(false);
    } catch (error: any) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setMicPermissionDenied(true);
        setShowMicPermissionAlert(true);
        return;
      }
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("이 브라우저는 음성 인식을 지원하지 않아요.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'ko-KR';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setMicPermissionDenied(true);
        setShowMicPermissionAlert(true);
      }
    };
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        interim += event.results[i][0].transcript;
      }
      setRecognizedText(interim);
      updateHighlights(interim);
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const updateHighlights = (text: string) => {
    const cleanedText = text.replace(/\s+/g, "");
    setHighlightIndices(prev => {
      const next = new Set(prev);
      prayerWords.forEach((word, idx) => {
        const cleanedWord = word.replace(/[.,!?]/g, "");
        if (cleanedText.includes(cleanedWord)) next.add(idx);
      });
      return next;
    });
  };

  const handleReadIncrement = () => {
    if (readCount < 3) {
      setReadCount(prev => prev + 1);
      if (readCount + 1 === 3) showToast("말씀을 3번 모두 정성껏 읽으셨습니다. ✨");
    }
  };

  const completePrayer = () => {
    stopListening();
    const updatedProgress = { ...progress, graceGems: (progress.graceGems || 0) + 10 };
    setProgress(updatedProgress);
    storage.saveProgress(updatedProgress);
    setGameState('EMOTION_DIARY');
    showToast("기도의 은총 선물을 받았습니다! 💎 +10");
  };

  const completeSilentPrayer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const updatedProgress = { ...progress, graceGems: (progress.graceGems || 0) + 10 };
    setProgress(updatedProgress);
    storage.saveProgress(updatedProgress);
    setGameState('EMOTION_DIARY');
    showToast("기도의 은총 선물을 받았습니다! 💎 +10");
  };

  const saveDiary = () => {
    const emotionType = selectedEmotion?.type || Emotion.PEACE;
    const note = diaryText || "말씀으로 평화를 찾았습니다.";
    const newEntry = { emotion: emotionType, timestamp: Date.now(), note };
    const updatedProgress = { 
      ...progress, 
      emotionHistory: [newEntry, ...progress.emotionHistory],
      totalVersesRead: progress.totalVersesRead + 1 
    };
    setProgress(updatedProgress);
    storage.saveProgress(updatedProgress);
    showToast("감정 일기를 소중히 봉헌했습니다. ✨");
    setGameState('START');
  };

  const handleProfileUpdate = (data: { nickname: string; baptismalName: string; feastDay: string; profileImage?: string }) => {
    const updatedProgress = { 
      ...progress, 
      ...data,
      sheepName: data.nickname // nickname이 변경되면 sheepName도 함께 업데이트
    };
    setProgress(updatedProgress);
    storage.saveProgress(updatedProgress);
    showToast("프로필이 업데이트되었습니다. ✨");
  };

  const isPrayerComplete = prayerWords.length > 0 && (highlightIndices.size / prayerWords.length) >= 0.8;

  return (
    <Meadow>
      <audio ref={audioRef} loop />
      <div className="w-full max-w-md h-full flex flex-col p-6 overflow-hidden relative">
        
        {/* Onboarding */}
        {gameState === 'ONBOARDING' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center relative">
            <SheepCharacter />
            <h1 className="text-3xl font-bold text-white mt-8 mb-4">반가워요!</h1>
            <input type="text" value={tempName} onChange={e => setTempName(e.target.value)} placeholder="양의 이름을 지어주세요" className="w-full bg-white/10 border-2 border-white/20 rounded-2xl px-6 py-4 text-white text-center mb-6 focus:outline-none" />
            <button 
              onClick={() => { 
                const startDate = new Date().toISOString();
                const newProgress = { ...progress, sheepName: tempName, nickname: tempName, startDate };
                setProgress(newProgress); 
                storage.saveProgress(newProgress);
                setGameState('START'); 
              }} 
              className="w-full bg-white text-[#2E3192] font-bold py-4 rounded-2xl"
            >
              시작하기
            </button>
            <div className="absolute bottom-4 w-full text-center text-[11px] font-medium text-white/30 tracking-tight">© 2026 AIitZ Ellie company</div>
          </div>
        )}
        
        {/* Start Screen */}
        {gameState === 'START' && (
          <div className="flex-1 flex flex-col items-center justify-start pt-4 relative animate-in fade-in duration-500">

            <div className="absolute top-0 left-0 z-20">
              <button
                onClick={() => setGameState('SETTINGS')} 
                className="bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/20 text-white shadow-lg active:scale-95 transition-all hover:bg-white/30"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="absolute top-0 right-0 flex flex-col gap-2 items-end z-20">
              <div className="bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 min-w-[70px] justify-center">
                <span className="text-[#6265B8] font-black text-xs">{progress.totalVersesRead}</span>
                <span className="text-[#FF5B5B] text-xs">❤️</span>
              </div>
              <div className="bg-white/95 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20 min-w-[70px] justify-center animate-in slide-in-from-right">
                <span className="text-[#00ADEF] font-black text-xs">{progress.graceGems || 0}</span>
                <div className="w-3 h-3 flex items-center justify-center">
                   <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 5L93.3013 30V70L50 95L6.69873 70V30L50 5Z" fill="#32D74B" stroke="#1D9F2C" strokeWidth="6"/>
                   </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center mb-6 mt-4">
              <div className="bg-[#6265B8]/80 backdrop-blur-md px-5 py-1.5 rounded-2xl border border-white/20 mb-4 shadow-xl">
                <span className="text-white font-bold text-xs">{progress.sheepName}</span>
              </div>
              <div className="mb-2 transform scale-105">
                <SheepCharacter />
              </div>
              <h2 className="text-xl font-bold text-white leading-tight drop-shadow-md">하느님과 대화를 시작해볼까요?</h2>
            </div>
            
            <div className="w-full bg-white/95 rounded-[40px] p-8 shadow-2xl flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <p className="text-indigo-400 text-[13px] font-bold tracking-tight">오늘의 말씀은</p>
                <p className="text-[#2E3192] text-xl font-bold tracking-tight">{stripMarkdown(dailyVerse.reference)}입니다</p>
              </div>
              <button 
                onClick={() => { setCurrentVerse(dailyVerse); setGameState('READING'); setReadCount(0); setSelectedEmotion(null); }}
                className="w-full bg-[#5100B3] text-white py-5 rounded-3xl font-bold text-base shadow-[0_8px_20px_-4px_rgba(81,0,179,0.4)] hover:bg-[#410090] active:scale-95 transition-all"
              >
                오늘의 말씀 읽기
              </button>
            </div>
          </div>
        )}

        {/* Settings Page */}
        {gameState === 'SETTINGS' && (
          <SettingsPage 
            onBack={() => setGameState('START')} 
            currentBgm={bgm}
            onBgmChange={setBgm}
          />
        )}

        {/* Profile Page */}
        {gameState === 'PROFILE' && (
          <ProfilePage
            onBack={() => setGameState('START')}
            profileData={{
              nickname: progress.nickname || progress.sheepName || '',
              baptismalName: progress.baptismalName || '',
              feastDay: progress.feastDay || '',
              startDate: progress.startDate || '',
              profileImage: progress.profileImage
            }}
            onProfileUpdate={handleProfileUpdate}
          />
        )}

        {/* Emotion Card Grid */}
        {gameState === 'EMOTION_CARD' && (
          <div className="flex-1 flex flex-col pt-8 animate-in fade-in h-full overflow-hidden">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setGameState('START')} className="text-white/60 flex items-center gap-1 active:scale-90 transition-all font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                뒤로
              </button>
              <h2 className="text-xl font-bold text-white">현재 어떤 마음인가요?</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-3 gap-3 pb-80">
                {Object.values(EMOTION_DB).map(emo => (
                  <button 
                    key={emo.type} 
                    onClick={() => handleEmotionSelect(emo.type)}
                    className="aspect-square bg-[#3B3E91]/60 rounded-[32px] flex flex-col items-center justify-center p-2 border border-white/5 hover:bg-[#3B3E91]/80 active:scale-90 transition-all"
                  >
                    <span className="text-3xl mb-2">{emo.icon}</span>
                    <span className="text-white text-[11px] font-bold">{emo.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reading Stage */}
        {gameState === 'READING' && (
          <div className="flex-1 flex flex-col pt-2 overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between mb-6 px-1">
               <button onClick={() => setGameState('START')} className="text-white/70 flex items-center gap-1 active:scale-90 transition-all text-sm font-bold">
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 홈으로
               </button>
               <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20">
                  <span className="text-white text-xs font-bold whitespace-nowrap">1단계. 말씀 읽기 ({readCount}/3)</span>
               </div>
               <button onClick={shareVerseAsImage} className="text-white/70 active:scale-90 transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
               </button>
            </div>
            <div className="text-center mb-8">
               <h3 className="text-white font-bold text-xl tracking-tight leading-none">{stripMarkdown(currentVerse.reference)}</h3>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 mb-10">
              <div className="flex flex-col items-center">
                <p className="text-3xl font-extrabold text-white text-center leading-[1.6] break-keep whitespace-pre-wrap">{stripMarkdown(currentVerse.text)}</p>
                <div className="h-20 w-full"></div>
              </div>
            </div>
            <div className="w-full px-2 pb-12 flex flex-col gap-4">
              {readCount < 3 ? (
                <button onClick={handleReadIncrement} className="w-full py-6 rounded-[32px] font-bold text-xl bg-white text-[#2E3192] shadow-2xl active:scale-95 transition-all">말씀 읽기 ({readCount}/3)</button>
              ) : (
                <button onClick={() => setGameState('MEDITATION_GUIDE')} className="w-full bg-[#17C172] text-white py-6 rounded-[32px] font-bold text-xl shadow-2xl active:scale-95 transition-all animate-in zoom-in">3번 읽기 완료</button>
              )}
              
              <button 
                onClick={shareVerseAsImage}
                className="w-full py-4 rounded-[28px] font-bold text-sm bg-white/10 text-white/80 border border-white/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                이미지로 친구와 공유하기
              </button>
            </div>
          </div>
        )}

        {/* Meditation Guide */}
        {gameState === 'MEDITATION_GUIDE' && (
          <div className="flex-1 flex flex-col pt-2 animate-in fade-in">
            <div className="w-full flex justify-start px-4 mb-4">
               <button 
                 onClick={() => { stopListening(); setGameState('START'); }}
                 className="text-white/70 flex items-center gap-1 active:scale-90 transition-all text-sm font-bold hover:text-white"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 홈으로
               </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 w-full">
                <div className="text-4xl mb-6 text-white">✝️</div>
                <h3 className="text-xl font-bold text-white mb-4">[묵상 도우미]</h3>
                <p className="text-white/80 leading-relaxed mb-8 break-keep">
                  {selectedEmotion?.meditationTip || "잠시 눈을 감고 말씀을 되새겨 보세요."}
                </p>
                <button onClick={() => setGameState('MEDITATION_PRAYER')} className="w-full bg-white text-[#2E3192] py-4 rounded-2xl font-bold active:scale-95 transition-all">
                  기도 시작하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Meditation Prayer - Voice Recognition */}
        {gameState === 'MEDITATION_PRAYER' && (
          <div className="flex-1 flex flex-col pt-2 overflow-hidden animate-in zoom-in relative">
            <div className="flex justify-between items-center mb-4 px-1">
               <button 
                 onClick={() => { stopListening(); setGameState('START'); }}
                 className="text-white/70 flex items-center gap-1 active:scale-90 transition-all text-sm font-bold hover:text-white"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 홈으로
               </button>

               <button 
                 onClick={() => { stopListening(); setIsPrayerDrawerOpen(true); }}
                 className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold active:scale-95 transition-all"
               >
                 다른 기도문 선택
               </button>
            </div>

            <div className="flex-1 flex flex-col items-center overflow-hidden">
               <h2 className="text-white text-xl font-bold mb-4 mt-2">
                 {isListening ? "주님께서 듣고 계셔요..." : "하느님께 기도를 드려볼까요?"}
               </h2>

               <div className="w-full flex-1 bg-[#3B3E91]/40 backdrop-blur-md border border-white/10 rounded-[40px] p-8 pb-10 flex flex-col items-center overflow-hidden relative">
                  <div className="w-12 h-1.5 bg-white/20 rounded-full mb-6 shrink-0"></div>
                  <h3 className="text-white text-2xl font-black mb-6 shrink-0">{selectedPrayer.title}</h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar w-full px-2">
                    <p className="text-lg leading-relaxed text-center whitespace-pre-wrap font-medium break-keep">
                      {prayerWords.map((word, i) => (
                        <span key={i} className={highlightIndices.has(i) ? "karaoke-active" : "karaoke-inactive"}>
                          {word}{" "}
                        </span>
                      ))}
                    </p>
                    <div className="h-10 w-full"></div>
                  </div>
                  
                  <div className="w-full flex flex-col gap-3 mt-8 shrink-0">
                    {!isPrayerComplete ? (
                      <button 
                        onClick={isListening ? stopListening : startListening}
                        className={`w-full py-4 rounded-2xl font-bold text-sm active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-[#2E3192]'}`}
                      >
                        {isListening ? (
                          <>
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            기도 중... (마침 버튼)
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/><path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/></svg>
                            기도 시작
                          </>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={completePrayer}
                        className="w-full bg-[#00ADEF] text-white py-4 px-6 rounded-full font-bold text-xl active:scale-95 transition-all shadow-[0_4px_0_0_#0087BA] flex items-center justify-center gap-3 btn-gem-active"
                      >
                        <span className="text-white drop-shadow-md tracking-tight font-black">은총 선물</span>
                        <div className="flex items-center gap-1.5 bg-white/20 px-2 py-0.5 rounded-full">
                          <svg width="20" height="20" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 5L93.3013 30V70L50 95L6.69873 70V30L50 5Z" fill="#32D74B" stroke="#1D9F2C" strokeWidth="8"/>
                            <path d="M50 5V95M6.69873 30L93.3013 70M6.69873 70L93.3013 30" stroke="white" strokeOpacity="0.4" strokeWidth="3"/>
                          </svg>
                          <span className="text-white text-xl font-black">+10</span>
                        </div>
                      </button>
                    )}
                    
                    {micPermissionDenied ? (
                      <button 
                        onClick={() => setShowMicPermissionAlert(true)}
                        className="w-full bg-yellow-500/80 text-white py-3 rounded-2xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        마이크가 안되요
                      </button>
                    ) : (
                      <button 
                        onClick={() => { stopListening(); setGameState('BIBLE_VIEW'); }}
                        className="w-full bg-[#5100B3]/30 text-white/70 py-3 rounded-2xl font-bold text-xs active:scale-95 transition-all"
                      >
                        나의 기록 보기
                      </button>
                    )}
                  </div>
               </div>
            </div>

            {isPrayerDrawerOpen && (
              <div className="fixed inset-0 z-[100] animate-in fade-in flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsPrayerDrawerOpen(false)}></div>
                <div className="relative bg-[#4A4EAD] rounded-t-[40px] p-6 pt-10 h-[80%] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full"></div>
                  <h4 className="text-white font-bold mb-6 px-2">다른 기도문을 선택해 보세요</h4>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-2 pb-4">
                    {selectedEmotion && (
                      <button 
                        onClick={() => { 
                          setSelectedPrayer({ title: `${selectedEmotion.type} 기도`, content: selectedEmotion.prayer }); 
                          setIsPrayerDrawerOpen(false); 
                        }}
                        className={`w-full text-left p-5 rounded-2xl font-bold transition-all ${selectedPrayer.title.includes(selectedEmotion.type) ? 'bg-white text-[#2E3192]' : 'bg-white/10 text-white'}`}
                      >
                        {selectedEmotion.type} 기도 (현재 테마)
                      </button>
                    )}
                    {CATHOLIC_PRAYERS.map((prayer, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedPrayer(prayer); setIsPrayerDrawerOpen(false); }}
                        className={`w-full text-left p-5 rounded-2xl font-bold transition-all ${selectedPrayer.title === prayer.title ? 'bg-white text-[#2E3192]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {prayer.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Silent Meditation with Timer */}
        {gameState === 'MEDITATION_SILENT' && (
          <div className="flex-1 flex flex-col pt-2 overflow-hidden animate-in fade-in relative">
            <div className="flex justify-between items-center mb-4 px-1">
               <button 
                 onClick={() => { 
                   if (timerRef.current) clearInterval(timerRef.current);
                   setGameState('START'); 
                 }}
                 className="text-white/70 flex items-center gap-1 active:scale-90 transition-all text-sm font-bold hover:text-white"
               >
                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                 홈으로
               </button>

               <button 
                 onClick={() => { 
                   if (timerRef.current) clearInterval(timerRef.current);
                   setIsPrayerDrawerOpen(true); 
                 }}
                 className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-white text-xs font-bold active:scale-95 transition-all"
               >
                 다른 기도문 선택
               </button>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center overflow-hidden px-6">
               <h2 className="text-white text-xl font-bold mb-8 text-center">
                 하느님께 마음으로 드려볼까요?
               </h2>

               {/* 양 캐릭터 */}
               <div className="mb-8 transform scale-110">
                 <SheepCharacter />
               </div>

               {/* 기도문 카드 */}
               <div className="w-full bg-[#3B3E91]/60 backdrop-blur-md border border-white/10 rounded-[32px] p-8 mb-8">
                  <h3 className="text-white text-xl font-black mb-4 text-center">{selectedPrayer.title}</h3>
                  <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                    <p className="text-white/90 text-sm leading-relaxed text-center whitespace-pre-wrap break-keep">
                      {selectedPrayer.content}
                    </p>
                  </div>
               </div>

               {/* 타이머 */}
               <div className="mb-8">
                 <div className="bg-white/10 backdrop-blur-md rounded-full px-6 py-3 border border-white/20">
                   <p className="text-white text-2xl font-black text-center">
                     {Math.floor(prayerTimer / 60)}:{String(prayerTimer % 60).padStart(2, '0')}
                   </p>
                 </div>
               </div>

               {/* 완료 버튼 */}
               <button 
                 onClick={completeSilentPrayer}
                 className="w-full bg-white text-[#2E3192] py-4 rounded-2xl font-bold text-base shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
               >
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                   <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                 </svg>
                 기도를 끝냈어요
               </button>
            </div>

            {isPrayerDrawerOpen && (
              <div className="fixed inset-0 z-[100] animate-in fade-in flex flex-col justify-end">
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsPrayerDrawerOpen(false)}></div>
                <div className="relative bg-[#4A4EAD] rounded-t-[40px] p-6 pt-10 h-[80%] overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/20 rounded-full"></div>
                  <h4 className="text-white font-bold mb-6 px-2">다른 기도문을 선택해 보세요</h4>
                  <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 px-2 pb-4">
                    {selectedEmotion && (
                      <button 
                        onClick={() => { 
                          setSelectedPrayer({ title: `${selectedEmotion.type} 기도`, content: selectedEmotion.prayer }); 
                          setIsPrayerDrawerOpen(false); 
                        }}
                        className={`w-full text-left p-5 rounded-2xl font-bold transition-all ${selectedPrayer.title.includes(selectedEmotion.type) ? 'bg-white text-[#2E3192]' : 'bg-white/10 text-white'}`}
                      >
                        {selectedEmotion.type} 기도 (현재 테마)
                      </button>
                    )}
                    {CATHOLIC_PRAYERS.map((prayer, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setSelectedPrayer(prayer); setIsPrayerDrawerOpen(false); }}
                        className={`w-full text-left p-5 rounded-2xl font-bold transition-all ${selectedPrayer.title === prayer.title ? 'bg-white text-[#2E3192]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                      >
                        {prayer.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Emotion Diary */}
        {gameState === 'EMOTION_DIARY' && (
          <div className="flex-1 flex flex-col pt-2 animate-in slide-in-from-bottom">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">말씀을 읽고 난 후의 마음</h2>
            <p className="text-white/40 text-sm mb-6 text-center">하느님께 드리고 싶은 한 마디를 적어보세요.</p>
            <textarea autoFocus className="flex-1 bg-white/10 border border-white/10 rounded-3xl p-6 text-white focus:outline-none focus:border-white/30 resize-none mb-6 custom-scrollbar" placeholder="여기에 적어보세요..." value={diaryText} onChange={(e) => setDiaryText(e.target.value)} />
            <button onClick={saveDiary} className="w-full bg-white text-[#2E3192] py-5 rounded-3xl font-bold text-lg mb-10 shadow-2xl active:scale-95 transition-all">봉헌하기</button>
          </div>
        )}

        {/* Bible View (Records) */}
        {gameState === 'BIBLE_VIEW' && (
          <div className="flex-1 flex flex-col pt-8 overflow-hidden animate-in fade-in h-full">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setGameState('START')} className="text-white/60 flex items-center gap-1 active:scale-90 transition-all font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
                뒤로
              </button>
              <h2 className="text-xl font-bold text-white">나의 봉헌 기록</h2>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-32 space-y-4">
              {progress.emotionHistory.length > 0 ? (
                progress.emotionHistory.map((entry, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md rounded-[32px] p-5 border border-white/5 flex gap-4 animate-in slide-in-from-right duration-300">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0" style={{ backgroundColor: EMOTION_DB[entry.emotion]?.color || 'rgba(255,255,255,0.1)' }}>{EMOTION_DB[entry.emotion]?.icon || '🕯️'}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white/90 font-bold text-sm">{entry.emotion}</span>
                        <span className="text-white/30 text-[10px]">{formatDate(new Date(entry.timestamp).toISOString())}</span>
                      </div>
                      <p className="text-white/60 text-xs leading-relaxed line-clamp-3 break-keep">{entry.note || "기록된 내용이 없습니다."}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                  <div className="opacity-40 grayscale mb-6"><SheepCharacter /></div>
                  <p className="text-white/50 text-sm leading-relaxed break-keep">아직 봉헌된 기록이 없어요.<br/>말씀을 읽고 마음을 나누어 보세요.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global Bottom Nav */}
        {(gameState === 'START' || gameState === 'BIBLE_VIEW' || gameState === 'EMOTION_CARD' || gameState === 'PROFILE') && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-sm bg-white/95 backdrop-blur-md shadow-2xl rounded-[40px] px-6 py-2.5 flex items-center justify-between z-50 border border-white/50 overflow-visible">
            <button 
              onClick={() => setGameState('BIBLE_VIEW')} 
              className={`transition-all p-2.5 rounded-2xl flex items-center justify-center ${gameState === 'BIBLE_VIEW' ? 'bg-[#FF5B5B]/10 text-[#FF5B5B]' : 'text-zinc-300 hover:text-zinc-400'}`}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            </button>
            <button 
              onClick={() => { setGameState('START'); setSelectedEmotion(null); }} 
              className={`transition-all p-3 rounded-2xl flex items-center justify-center ${gameState === 'START' ? 'bg-[#5100B3]/10 text-[#5100B3] scale-105' : 'text-zinc-300 hover:text-zinc-400'}`}
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </button>
            <button 
              onClick={() => setGameState('EMOTION_CARD')} 
              className={`transition-all p-2.5 rounded-2xl flex items-center justify-center ${gameState === 'EMOTION_CARD' ? 'bg-[#8B4513]/10' : 'text-zinc-300 hover:text-zinc-400'}`}
            >
               <svg width="29" height="34" viewBox="0 0 29 34" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all ${gameState === 'EMOTION_CARD' ? 'scale-105' : 'opacity-40 grayscale'}`}>
                  <g clipPath="url(#clip_nav_icon)">
                    <path d="M29 23.2V1.65714C29 0.621429 28.3786 0 27.3429 0H6.21429C2.69286 0 0 2.69286 0 6.21429V26.9286C0 30.45 2.69286 33.1429 6.21429 33.1429H27.3429C28.1714 33.1429 29 32.5214 29 31.4857V30.45C29 30.0357 28.7929 29.6214 28.3786 29.2071C28.1714 28.1714 28.1714 25.2714 28.3786 24.4429C28.7929 24.2357 29 23.8214 29 23.2ZM9.32143 9.32143C9.32143 8.7492 9.78491 8.28572 10.3571 8.28572H13.4643V5.17857C13.4643 4.60634 13.9278 4.14286 14.5 4.14286H16.5714C17.1437 4.14286 17.6071 4.60634 17.6071 5.17857V8.28572H20.7143C21.2865 8.28572 21.75 8.7492 21.75 9.32143V11.3929C21.75 11.9651 21.2865 12.4286 20.7143 12.4286H17.6071V19.6786C17.6071 20.2508 17.1437 20.7143 16.5714 20.7143H14.5C13.9278 20.7143 13.4643 20.2508 13.4643 19.6786V12.4286H10.3571C9.78491 12.4286 9.32143 11.9651 9.32143 11.3929V9.32143ZM24.65 29H6.21429C4.97143 29 4.14286 28.1714 4.14286 26.9286C4.14286 25.6857 5.17857 24.8571 6.21429 24.8571H24.65V29Z" fill={gameState === 'EMOTION_CARD' ? '#8B4513' : '#A1A1AA'}/>
                  </g>
                  <defs>
                    <clipPath id="clip_nav_icon">
                      <rect width="29" height="33.1429" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
            </button>
            <button 
              onClick={() => setGameState('PROFILE')} 
              className={`transition-all p-2.5 rounded-2xl flex items-center justify-center ${gameState === 'PROFILE' ? 'bg-[#5100B3]/10 text-[#5100B3]' : 'text-zinc-300 hover:text-zinc-400'}`}
            >
              <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </button>
          </div>
        )}

        {/* Toast */}
        <div className={`fixed bottom-28 left-1/2 -translate-x-1/2 z-[110] transition-all duration-300 pointer-events-none ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="bg-white/90 backdrop-blur-md px-8 py-3 rounded-full shadow-2xl border border-white/20">
            <p className="text-[#2E3192] font-black text-xs text-center">{toast.message}</p>
          </div>
        </div>

        {/* Microphone Permission Alert */}
        {showMicPermissionAlert && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-in fade-in">
            <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl animate-in slide-in-from-bottom-4">
              {/* 아이콘 */}
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
              </div>

              {/* 제목 */}
              <h3 className="text-xl font-bold text-[#2E3192] text-center mb-3">
                🎤 마이크 사용이 제한되어 있어요
              </h3>

              {/* 메시지 */}
              <p className="text-gray-600 text-center text-sm leading-relaxed mb-4 break-keep">
                기도문을 소리내어 읽으려면 마이크 권한이 필요해요.
                <br />
                <span className="font-bold text-purple-600">부모님께 도움을 요청해 주세요!</span>
              </p>

              {/* 부모님을 위한 안내 */}
              <div className="bg-purple-50 rounded-2xl p-4 mb-4">
                <p className="text-xs text-purple-900 font-bold mb-2">📱 부모님께</p>
                <ol className="text-xs text-purple-800 space-y-1 list-decimal list-inside">
                  <li>설정 → 스크린 타임</li>
                  <li>콘텐츠 및 개인정보 보호 제한</li>
                  <li>마이크 → 이 앱 허용</li>
                </ol>
              </div>

              {/* 대체 방법 */}
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-center text-purple-700 font-bold">
                  💕 걱정마세요!
                </p>
                <p className="text-xs text-center text-purple-600 mt-1">
                  마음으로 기도하셔도 하느님께 전해져요
                </p>
              </div>

              {/* 버튼 */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowMicPermissionAlert(false);
                    setGameState('MEDITATION_SILENT');
                  }}
                  className="w-full bg-[#5100B3] text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
                >
                  마음으로 기도하기
                </button>
                <button
                  onClick={() => setShowMicPermissionAlert(false)}
                  className="w-full bg-gray-100 text-gray-600 py-4 rounded-2xl font-bold active:scale-95 transition-all"
                >
                  나중에 하기
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Meadow>
  );
};

export default App;