# 🐑 성경 읽는 양 (Bible Meadow)

> 매일의 복음 말씀을 읽고, 감정에 따른 위로의 성경 구절을 묵상하는 가톨릭 웹 애플리케이션입니다.

![bible_meadow](src/assets/banner.png)
![bible_meadow](src/assets/bible_meadow.png)

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7)
![Tech](https://img.shields.io/badge/Built%20with-React%20%7C%20TypeScript%20%7C%20Vite-blue)

## 📱 프로젝트 소개 (Introduction)

**성경 읽는 양**은 바쁜 일상 속에서도 하느님의 말씀을 가까이할 수 있도록 돕는 묵상 도우미 서비스입니다.
귀여운 양 캐릭터와 함께 편안한 배경음악을 들으며, 매일의 복음을 소리 내어 읽고 마음의 평화를 찾을 수 있습니다.

**배포 링크:** [https://biblemeadow.netlify.app]((https://biblemeadow.netlify.app/?utm_source=github&utm_medium=readme&utm_campaign=repo_link))

---

## ✨ 주요 기능 (Key Features)

1. **오늘의 말씀 (Daily Gospel)**
    * 2026년 전례력에 맞춘 가톨릭 매일미사 복음 환호성 및 복음 말씀을 제공합니다.
    * 외부 API 오류를 방지하기 위해 로컬 DB(`dailyGospel.ts`)를 구축하여 안정성을 확보했습니다.

2. **감정별 성경 처방 (Emotion Verses)**
    * 기쁨, 슬픔, 두려움 등 현재 감정을 선택하면 위로가 되는 성경 구절과 기도를 추천합니다.
    * 슬라이드(Pagination) UI를 통해 주제별로 여러 구절을 묵상할 수 있습니다.

3. **음성 인식 성경 읽기 (Speech to Text)**
    * Web Speech API를 활용하여 사용자의 목소리를 인식합니다.
    * 화면에 제시된 성경 구절을 소리 내어 읽으면 AI가 이를 판정하고 피드백을 줍니다. (Google Gemini API 활용)

4. **묵상 도우미 (Meditation & BGM)**
    * 잔잔한 피아노, 숲소리 등 배경음악(BGM)을 설정할 수 있습니다.
    * 주요 가톨릭 기도문(주님의 기도, 성모송 등)을 제공합니다.

5. **PWA (Progressive Web App)**
    * 모바일 홈 화면에 추가하여 앱처럼 사용할 수 있습니다.

---

## 🛠 기술 스택 (Tech Stack)

* **Frontend:** React (v18), TypeScript, Vite
* **Styling:** Tailwind CSS
* **AI & API:** Google Gemini API (텍스트 분석), Web Speech API (음성 인식)
* **State Management:** React Hooks (useState, useEffect, useRef)
* **Deployment:** Netlify
* **Version Control:** Git, GitHub

---

## 📂 프로젝트 구조 (Directory Structure)

```bash
src/
├── assets/          # 이미지, 아이콘, 배경음악(mp3) 파일
├── components/      # UI 컴포넌트 (SheepCharacter, SettingsPage 등)
├── services/        # 외부 API 연동 로직 (geminiService.ts)
├── dailyGospel.ts   # 매일미사 데이터베이스
├── emotionData.ts   # 감정별 성경 구절 및 기도문 데이터
├── types.ts         # TypeScript 타입 정의
├── App.tsx          # 메인 앱 로직 및 라우팅
└── main.tsx         # 진입점
