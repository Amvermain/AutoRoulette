# 🎰 AutoRoulette

치지직(Chzzk) 스트리밍 플랫폼과 연동된 자동 룰렛 시스템입니다.
도네이션을 받으면 자동으로 룰렛이 돌아가며, 웹 관리자 페이지에서 설정을 쉽게 관리할 수 있습니다.

## ✨ 주요 기능

- 🎁 치지직 도네이션 자동 감지 및 룰렛 실행
- ⚙️ 웹 기반 설정 관리 (꽝 갯수, 상품 목록, 도네이션 금액)
- 🎨 물리 엔진 기반 실제감 있는 구슬 떨어뜨리기 애니메이션(해당 애니메이션 코드의 저작권은 https://github.com/lazygyu/roulette에 있습니다.)
- 💾 SQLite 데이터베이스로 설정 영구 저장
- 🐳 Docker로 간편한 설치 및 실행

## 📋 사전 요구사항

- [Docker](https://www.docker.com/get-started) 설치 (Docker Desktop 권장)
- [Docker Compose](https://docs.docker.com/compose/install/) 설치 (Docker Desktop에 포함됨)
- 치지직(Chzzk) 계정 및 인증 토큰

## 🚀 빠른 시작

### 1. 프로젝트 클론(GIT에서 Download ZIP으로 대체 가능)

```bash
git clone <repository-url>
cd AutoRoulette
```

### 2. 환경 변수 설정

`.env.example` 파일을 복사하여 `.env` 파일을 생성합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열어서 치지직 인증 토큰을 입력합니다:

```env
NID_AUT=your_actual_nid_aut_token
NID_SES=your_actual_nid_ses_token
```

#### 치지직 토큰 얻는 방법

1. 브라우저에서 [치지직](https://chzzk.naver.com) 로그인
2. 개발자 도구 열기 (F12 또는 우클릭 > 검사)
3. **Application** 탭 > **Cookies** > `https://chzzk.naver.com` 선택
4. `NID_AUT`와 `NID_SES` 쿠키의 Value 복사
5. `.env` 파일에 붙여넣기

### 3. Docker로 실행

```bash
docker-compose up -d
```

처음 실행 시 이미지 빌드에 몇 분 정도 소요됩니다.

### 4. 접속

서비스가 시작되면 다음 URL로 접속할 수 있습니다:

- **룰렛 화면**: http://localhost:1235/
- **관리자 설정 페이지**: http://localhost:3000/admin
- **백엔드 API**: http://localhost:3000

## ⚙️ 설정 관리

### 웹 관리자 페이지 사용

1. 브라우저에서 http://localhost:3000/admin 접속
2. 설정 페이지에서 다음 항목 수정:
   - **꽝 갯수**: 룰렛에 포함될 꽝의 개수
   - **상품 목록**: 당첨 가능한 상품들 (추가/삭제 가능)
   - **도네이션 금액**: 룰렛을 실행할 최소 도네이션 금액 (원 단위)
3. **저장** 버튼 클릭
4. 다음 룰렛부터 새 설정이 적용됩니다

### API로 설정 관리 (선택사항)

**설정 조회:**
```bash
curl http://localhost:3000/settings
```

**설정 수정:**
```bash
curl -X PUT http://localhost:3000/settings \
  -H "Content-Type: application/json" \
  -d '{
    "dudCount": 50,
    "prizes": ["노래", "대사", "춤", "게임권"],
    "donationAmount": 10000
  }'
```

## 🛠️ 개발 환경 실행

Docker 없이 로컬에서 개발하려면:

### 백엔드 실행

```bash
cd roulette-backend
pnpm install
pnpm run start:dev
```

### 프론트엔드 실행

```bash
cd roulette
yarn install
yarn dev
```

## 📦 Docker 명령어

```bash
# 서비스 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 로그 확인
docker-compose logs -f

# 서비스 재시작
docker-compose restart

# 이미지 재빌드
docker-compose up -d --build

# 모든 컨테이너 및 볼륨 삭제 (데이터 초기화)
docker-compose down -v
```

## 📁 프로젝트 구조

```
AutoRoulette/
├── roulette-backend/       # NestJS 백엔드
│   ├── src/
│   │   ├── settings/       # 설정 관리 모듈
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── public/             # 관리자 웹 페이지
│   │   └── index.html
│   ├── Dockerfile
│   └── package.json
├── roulette/               # 프론트엔드 (룰렛 UI)
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml      # Docker Compose 설정
├── .env.example            # 환경변수 템플릿
└── README.md
```

## 🔧 설정 파일

### docker-compose.yml

- **backend**: 3000번 포트에서 실행
- **frontend**: 1235번 포트에서 실행
- **volumes**: 데이터베이스 영구 저장

포트를 변경하려면 `docker-compose.yml`의 `ports` 섹션을 수정하세요:

```yaml
ports:
  - "원하는포트:3000"  # 백엔드
  - "원하는포트:1235"  # 프론트엔드
```

## 🐛 문제 해결

### Docker 실행이 안 될 때

```bash
# Docker 데몬이 실행 중인지 확인
docker ps

# Docker Desktop을 재시작
```

### 포트가 이미 사용 중일 때

```bash
# 사용 중인 포트 확인
netstat -ano | findstr :3000
netstat -ano | findstr :1235

# docker-compose.yml에서 포트 번호 변경
```

### 설정이 저장되지 않을 때

```bash
# 볼륨 확인
docker volume ls

# 컨테이너 재시작
docker-compose restart backend
```

### 치지직 연결이 안 될 때

1. `.env` 파일의 토큰이 올바른지 확인
2. 토큰이 만료되지 않았는지 확인
3. 백엔드 로그 확인: `docker-compose logs -f backend`

## 📝 라이센스

MIT

## 🤝 기여

이슈와 PR을 환영합니다!

## 📧 문의

문제가 발생하면 이슈를 등록해주세요.
