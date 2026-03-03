import React, { useState, useRef } from 'react';
import SheepCharacter from './SheepCharacter';

type ProfilePageProps = {
  onBack: () => void;
  profileData: {
    nickname: string;
    baptismalName: string;
    feastDay: string;
    startDate: string;
    profileImage?: string;
  };
  onProfileUpdate: (data: {
    nickname: string;
    baptismalName: string;
    feastDay: string;
    profileImage?: string;
  }) => void;
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ 
  onBack, 
  profileData, 
  onProfileUpdate 
}) => {
  const [isEditing, setIsEditing] = useState({
    nickname: false,
    baptismalName: false,
    feastDay: false,
  });

  const [tempValues, setTempValues] = useState({
    nickname: profileData.nickname,
    baptismalName: profileData.baptismalName,
    feastDay: profileData.feastDay,
  });

  const [profileImage, setProfileImage] = useState<string | undefined>(profileData.profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result as string;
        setProfileImage(imageData);
        // 즉시 업데이트
        onProfileUpdate({
          ...profileData,
          nickname: tempValues.nickname,
          baptismalName: tempValues.baptismalName,
          feastDay: tempValues.feastDay,
          profileImage: imageData,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (field: 'nickname' | 'baptismalName' | 'feastDay') => {
    onProfileUpdate({
      ...profileData,
      [field]: tempValues[field],
      profileImage,
    });
    setIsEditing({ ...isEditing, [field]: false });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '아직 시작하지 않았어요';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '아직 시작하지 않았어요'; 
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
  };

  return (
    <div className="w-full h-full flex flex-col pt-8 animate-in slide-in-from-right">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <h2 className="text-xl font-bold items-center text-white">Profile</h2>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {/* 양 캐릭터 */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {profileImage ? (
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl bg-white">
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="transform scale-90">
                <SheepCharacter />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-2 right-2 w-10 h-10 bg-[#5100B3] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 프로필 정보 카드 */}
        <div className="space-y-4 px-1">
          {/* 별명 */}
          <div>
            <label className="text-white/60 text-xs font-bold mb-2 ml-2 block">별명</label>
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-lg flex items-center justify-between">
              {isEditing.nickname ? (
                <input
                  type="text"
                  value={tempValues.nickname}
                  onChange={(e) => setTempValues({ ...tempValues, nickname: e.target.value })}
                  className="flex-1 bg-transparent text-[#2E3192] font-bold focus:outline-none"
                  autoFocus
                  onBlur={() => handleSave('nickname')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave('nickname');
                    if (e.key === 'Escape') {
                      setTempValues({ ...tempValues, nickname: profileData.nickname });
                      setIsEditing({ ...isEditing, nickname: false });
                    }
                  }}
                />
              ) : (
                <span className="text-[#2E3192] font-bold">{profileData.nickname}</span>
              )}
              <button
                onClick={() => {
                  if (isEditing.nickname) {
                    handleSave('nickname');
                  } else {
                    setIsEditing({ ...isEditing, nickname: true });
                  }
                }}
                className="text-[#5100B3] active:scale-90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 세례명 */}
          <div>
            <label className="text-white/60 text-xs font-bold mb-2 ml-2 block">세례명</label>
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-lg flex items-center justify-between">
              {isEditing.baptismalName ? (
                <input
                  type="text"
                  value={tempValues.baptismalName}
                  onChange={(e) => setTempValues({ ...tempValues, baptismalName: e.target.value })}
                  className="flex-1 bg-transparent text-[#2E3192] font-bold focus:outline-none"
                  autoFocus
                  onBlur={() => handleSave('baptismalName')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave('baptismalName');
                    if (e.key === 'Escape') {
                      setTempValues({ ...tempValues, baptismalName: profileData.baptismalName });
                      setIsEditing({ ...isEditing, baptismalName: false });
                    }
                  }}
                />
              ) : (
                <span className="text-[#2E3192] font-bold">{profileData.baptismalName}</span>
              )}
              <button
                onClick={() => {
                  if (isEditing.baptismalName) {
                    handleSave('baptismalName');
                  } else {
                    setIsEditing({ ...isEditing, baptismalName: true });
                  }
                }}
                className="text-[#5100B3] active:scale-90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 축일 */}
          <div>
            <label className="text-white/60 text-xs font-bold mb-2 ml-2 block">축일</label>
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-lg flex items-center justify-between">
              {isEditing.feastDay ? (
                <input
                  type="text"
                  value={tempValues.feastDay}
                  onChange={(e) => setTempValues({ ...tempValues, feastDay: e.target.value })}
                  className="flex-1 bg-transparent text-[#2E3192] font-bold focus:outline-none"
                  placeholder="예: 1월 27일"
                  autoFocus
                  onBlur={() => handleSave('feastDay')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave('feastDay');
                    if (e.key === 'Escape') {
                      setTempValues({ ...tempValues, feastDay: profileData.feastDay });
                      setIsEditing({ ...isEditing, feastDay: false });
                    }
                  }}
                />
              ) : (
                <span className="text-[#2E3192] font-bold">{profileData.feastDay}</span>
              )}
              <button
                onClick={() => {
                  if (isEditing.feastDay) {
                    handleSave('feastDay');
                  } else {
                    setIsEditing({ ...isEditing, feastDay: true });
                  }
                }}
                className="text-[#5100B3] active:scale-90 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                </svg>
              </button>
            </div>
          </div>

          {/* 말씀 읽기 시작한 날 (읽기 전용) */}
          <div>
            <label className="text-white/60 text-xs font-bold mb-2 ml-2 block">말씀 읽기 시작한 날</label>
            <div className="bg-white/95 backdrop-blur-md rounded-[20px] p-5 shadow-lg">
              <span className="text-gray-600 font-bold">{formatDate(profileData.startDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
