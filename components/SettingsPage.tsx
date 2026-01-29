import React from 'react';

type SettingsPageProps = {
  onBack: () => void;
  currentBgm: 'none' | 'piano' | 'nature' | 'sing';
  onBgmChange: (bgm: 'none' | 'piano' | 'nature' | 'sing') => void;
};

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, currentBgm, onBgmChange }) => {
  return (
    <div className="w-full h-full flex flex-col pt-8 animate-in slide-in-from-right">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <button 
          onClick={onBack} 
          className="text-white/60 flex items-center gap-1 active:scale-90 transition-all font-bold"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/>
          </svg>
          뒤로
        </button>
        <h2 className="text-xl font-bold text-white">설정</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10 space-y-6">
        
        {/* 1. 언어 설정 */}
        <section>
          <h3 className="text-white/60 text-xs font-bold mb-2 ml-2">언어 설정</h3>
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-xl shadow-inner">
                🇰🇷
              </div>
              <div>
                <p className="font-bold text-[#2E3192]">한국어</p>
                <p className="text-[11px] text-gray-500">현재 한국어만 지원됩니다</p>
              </div>
            </div>
            <div className="text-[#2E3192]">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </section>

        {/* 2. 배경음악 선택 */}
        <section>
          <h3 className="text-white/60 text-xs font-bold mb-2 ml-2">배경음악</h3>
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] overflow-hidden shadow-lg">
            {[
              { id: 'none', label: '사용 안 함', icon: '🔇' },
              { id: 'piano', label: '잔잔한 피아노', icon: '🎹' },
              { id: 'nature', label: '즐거운 기타음악', icon: '🌿' },
              { id:'sing', label: '엠마오로 가는 고양이', icon: ' 🎵' },
            ].map((option, index) => (
              <button
                key={option.id}
                onClick={() => onBgmChange(option.id as any)}
                className={`w-full flex items-center justify-between p-5 transition-colors ${
                  index !== 2 ? 'border-b border-gray-100' : ''
                } active:bg-gray-100`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{option.icon}</span>
                  <span className="text-gray-700 font-bold text-sm">{option.label}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  currentBgm === option.id ? 'border-[#2E3192]' : 'border-gray-300'
                }`}>
                  {currentBgm === option.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#2E3192]" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 3. 개발자 소개 및 연락처 */}
        <section>
          <h3 className="text-white/60 text-xs font-bold mb-2 ml-2">앱 정보</h3>
          <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-6 shadow-lg text-center">
            
            {/* 프로필 아이콘 */}
            <div className="w-16 h-16 bg-[#2E3192]/10 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
              👩🏻‍💻
            </div>
            
            {/* 이름 및 설명 */}
            <h3 className="font-bold text-[#2E3192] text-lg">Created by Kang Inhye</h3>
            <p className="text-gray-500 text-xs mt-2 mb-6 leading-relaxed">
              하느님의 말씀을 더 가까이,<br />
              매일의 묵상을 돕기 위해 만들었습니다.
            </p>

            {/* 연락처 버튼 그리드 (3개) */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* GitHub */}
              <a 
                href="https://github.com/inekang/bible_meadow" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all active:scale-95"
              >
                <svg className="w-6 h-6 text-gray-700 mb-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405 1.02 0 2.04.135 3 .405 2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.285 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span className="text-[10px] font-bold text-gray-600">GitHub</span>
              </a>

              {/* Email */}
              <a 
                href="mailto:inekang@gmail.com"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all active:scale-95"
              >
                <svg className="w-6 h-6 text-gray-700 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span className="text-[10px] font-bold text-gray-600">Email</span>
              </a>

              {/* Website (준비 중) */}
              <button 
                onClick={() => alert("홈페이지는 준비 중입니다! 😊")}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-all active:scale-95 opacity-60"
              >
                <svg className="w-6 h-6 text-gray-700 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/>
                </svg>
                <span className="text-[10px] font-bold text-gray-600">Website</span>
              </button>
            </div>

            <div className="text-[10px] text-gray-400 border-t border-gray-100 pt-4">
              v1.0.0 | bible_meadow
            </div>
          </div>
        </section>
        
        {/* 하단 여백 */}
        <div className="h-10"></div>
      </div>
    </div>
  );
};