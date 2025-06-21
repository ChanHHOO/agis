# AGIS - AI-Powered Frontend Development Platform

AGIS는 프론트엔드 개발자 아웃소싱 시 AI를 활용하여 커뮤니케이션 시간을 단축하고, 테스트 플랫폼을 통해 소프트웨어 품질을 향상시키는 플랫폼입니다.

## 🚀 주요 기능

### 1. 메인 페이지
- 개발이 필요한 화면 목록을 테이블 형태로 표시
- 화면 ID, 요구사항 ID, 화면명, 진행상태 정보 제공
- 진행상황 대시보드 및 통계

### 2. 화면 개발 도우미
- **Figma 연동**: 실시간으로 디자인 변경사항 반영
- **기능 명세서**: 화면별 상세 요구사항 및 수락 기준
- **추천 API**: 각 기능에 적합한 API 목록 제공
- **베이스 코드 생성**: AI가 Figma 디자인과 명세서를 바탕으로 코드 자동 생성

### 3. 리뷰 (검증) 페이지
- 테스트 결과 요약 (성공/실패/건너뜀)
- 상세 테스트 케이스 목록
- 실패한 테스트의 에러 로그 및 디버깅 정보

## 🛠 기술 스택

- **Frontend**: React 18, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Lucide Icons
- **Routing**: React Router DOM
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx (프로덕션)

## 📋 시스템 요구사항

- Docker 20.10 이상
- Docker Compose 2.0 이상
- 최소 2GB RAM
- 포트 3000 (프로덕션) 또는 3001 (개발) 사용 가능

## 🚀 빠른 시작

### 1. 저장소 클론
```bash
git clone <repository-url>
cd agis-platform
```

### 2. 실행 스크립트 사용 (권장)
```bash
./start.sh
```

실행 모드를 선택하세요:
- **프로덕션 모드**: 최적화된 빌드로 포트 3000에서 실행
- **개발 모드**: 핫 리로드 지원, 포트 3001에서 실행

### 3. 수동 실행

#### 프로덕션 모드
```bash
docker-compose up --build agis-frontend
```

#### 개발 모드
```bash
docker-compose --profile dev up --build agis-dev
```

### 4. 브라우저에서 접속
- 프로덕션: http://localhost:3000
- 개발: http://localhost:3001

## 📁 프로젝트 구조

```
agis-platform/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   └── Navigation.jsx  # 네비게이션 컴포넌트
│   ├── pages/              # 페이지 컴포넌트
│   │   ├── MainPage.jsx
│   │   ├── ScreenDevelopmentAssistant.jsx
│   │   └── ReviewPage.jsx
│   ├── App.jsx             # 메인 앱 컴포넌트
│   └── main.jsx           # 엔트리 포인트
├── public/                 # 정적 파일
├── Dockerfile             # 프로덕션용 Docker 설정
├── Dockerfile.dev         # 개발용 Docker 설정
├── docker-compose.yml     # Docker Compose 설정
├── nginx.conf            # Nginx 설정
├── start.sh              # 실행 스크립트
└── README.md             # 프로젝트 문서
```

## 🔧 개발 가이드

### 로컬 개발 환경 설정
```bash
# 의존성 설치
pnpm install

# 개발 서버 시작
pnpm run dev

# 빌드
pnpm run build

# 빌드 미리보기
pnpm run preview
```

### Docker 없이 실행
```bash
# Node.js 20 이상 필요
npm install -g pnpm
pnpm install
pnpm run dev
```

## 🌐 배포

### 프로덕션 빌드
```bash
docker-compose up --build agis-frontend -d
```

### 환경 변수 설정
필요에 따라 `.env` 파일을 생성하여 환경 변수를 설정할 수 있습니다:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_FIGMA_API_KEY=your_figma_api_key
```

## 🔮 향후 계획

- [ ] 백엔드 API 서버 통합
- [ ] 실제 Figma API 연동
- [ ] AI 코드 생성 엔진 통합
- [ ] 자동화된 테스트 실행 시스템
- [ ] 사용자 인증 및 권한 관리
- [ ] 프로젝트 관리 기능
- [ ] 실시간 협업 기능

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.

---

**AGIS** - AI로 더 스마트한 프론트엔드 개발을 경험하세요! 🚀

# ai-talent
# agis
# agis
