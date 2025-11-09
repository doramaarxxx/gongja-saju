# 공자 사주 - API 연동 문서

## 📌 서비스에서 API 연동이 들어간 부분

### 1. OpenAI API (사주 분석 생성)
- **목적**: AI 기반 사주 분석 텍스트 생성
- **위치**: `src/utils/fortuneGenerator.ts` → Supabase Edge Function
- **기능**: 사용자의 생년월일시 정보를 바탕으로 상세한 사주 분석 제공

### 2. Supabase API
- **인증 (Auth)**: Google OAuth 로그인
- **데이터베이스 (Database)**: 사주 결과 저장 및 조회
- **Edge Functions**: OpenAI API 호출을 위한 서버리스 함수

### 3. Manseryeok API (만세력 차트)
- **목적**: 사주 차트 이미지 생성
- **위치**: `src/utils/manseryeokApi.ts`
- **상태**: 선택적 기능 (실패해도 서비스 이용 가능)

---

## 🔧 API 연동 방식 - 개발적 설명

### 1. OpenAI API 연동 (Supabase Edge Function 방식)

```
[Client] 사주보기 클릭
    ↓
[src/utils/fortuneGenerator.ts]
    ↓ HTTP POST 요청
[Supabase Edge Function: swift-handler]
    - OpenAI API 키를 서버 환경변수로 안전하게 관리
    - OpenAI Assistants API v2 호출
    - Thread 생성 → Message 전송 → Run 실행 → 결과 수신
    ↓ JSON 응답
[Client] 사주 결과 화면 표시
```

**핵심 구현:**
```typescript
// 클라이언트: src/utils/fortuneGenerator.ts
const response = await fetch(
  `${SUPABASE_URL}/functions/v1/swift-handler`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sajuInput)
  }
);

// Edge Function: supabase/functions/generate-saju/index.ts
const openaiResponse = await fetch('https://api.openai.com/v1/threads', {
  headers: {
    'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
    'OpenAI-Beta': 'assistants=v2'
  }
});
```

**보안 특징:**
- ✅ OpenAI API 키는 Supabase Secrets에 저장 (클라이언트에 노출되지 않음)
- ✅ Edge Function이 프록시 역할 (CORS 문제 해결)
- ✅ 클라이언트는 공개 Anon Key만 사용

### 2. Supabase 인증 및 데이터베이스

**Google OAuth 로그인:**
```typescript
// src/hooks/useAuth.ts
const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: window.location.origin,
    scopes: 'email'
  }
});
```

**사주 결과 저장:**
```typescript
// src/components/FortuneResult.tsx
const { data, error } = await supabase
  .from('saju_results')
  .insert({
    user_id: user?.id || null,
    name: input.name,
    gender: input.gender,
    birth_year: input.birthYear,
    // ... 기타 필드
    fortune_result: result
  });
```

**Row Level Security (RLS) 정책:**
- 익명 사용자: `user_id: null`로 저장 (누구나 조회 가능)
- 로그인 사용자: `user_id: {실제ID}`로 저장 (본인만 조회 가능)

### 3. Manseryeok API (만세력 차트)

```typescript
// src/utils/manseryeokApi.ts
const response = await fetch('https://api.forceteller.com/api/pro/profile/saju/chart', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify(manseryeokInput)
});
```

**에러 처리:**
- API 호출 실패 시 `null` 반환
- 차트 없이도 사주 분석은 정상 표시

---

## 🌐 데모 URL

**배포된 서비스:**
https://sensational-crumble-90d464.netlify.app/

**Supabase 프로젝트:**
- Project ID: `aofwcllxvzgdhtarwoez`
- Edge Function URL: `https://aofwcllxvzgdhtarwoez.supabase.co/functions/v1/swift-handler`

---

## 👤 API 확인 가능한 유저 플로우

### 플로우 1: 익명 사용자 (OpenAI API)

1. **메인 화면 접속**
   - URL: https://sensational-crumble-90d464.netlify.app/

2. **'사주보기' 버튼 클릭**
   - 폼 화면으로 이동

3. **정보 입력 후 '사주 분석하기' 클릭**
   - 이름: 아무거나
   - 성별: 선택
   - 생년월일: 선택
   - 시간: 선택
   
4. **API 호출 확인 (개발자 도구 - Network 탭)**
   ```
   POST https://aofwcllxvzgdhtarwoez.supabase.co/functions/v1/swift-handler
   
   Request Payload:
   {
     "name": "홍길동",
     "gender": "남자",
     "birthYear": 1990,
     "birthMonth": 1,
     "birthDay": 1,
     "birthTime": "자시(23-01시)",
     "lunarCalendar": false
   }
   
   Response (200 OK):
   {
     "평생사주_총평": "...",
     "재물운": { ... },
     "시기별": { ... },
     "건강운": { ... },
     "애정운": { ... }
   }
   ```

5. **사주 결과 화면 표시**
   - AI가 생성한 상세 사주 분석 확인

### 플로우 2: Google 로그인 (Supabase Auth API)

1. **메인 화면에서 메뉴(☰) 클릭**

2. **'Google로 로그인' 버튼 클릭**

3. **API 호출 확인 (개발자 도구 - Network 탭)**
   ```
   POST https://aofwcllxvzgdhtarwoez.supabase.co/auth/v1/authorize
   
   Response: 302 Redirect to Google OAuth
   ```

4. **Google 로그인 페이지에서 계정 선택**

5. **로그인 완료 후 사이트로 리다이렉트**
   ```
   GET https://sensational-crumble-90d464.netlify.app/?code=...
   
   → Supabase가 자동으로 세션 생성
   ```

6. **메뉴에서 로그인 상태 확인**
   - 사용자 이메일 표시
   - '로그아웃' 버튼 표시

### 플로우 3: 사주 결과 저장 (Supabase Database API)

1. **로그인 상태에서 사주보기 실행**

2. **API 호출 확인 (개발자 도구 - Network 탭)**
   ```
   POST https://aofwcllxvzgdhtarwoez.supabase.co/rest/v1/saju_results
   
   Request Payload:
   {
     "user_id": "b6b94eda-2ce2-4d9f-8fd9-51f512ee01ac",
     "name": "홍길동",
     "gender": "남자",
     "birth_year": 1990,
     "birth_month": 1,
     "birth_day": 1,
     "birth_time": "자시(23-01시)",
     "lunar_calendar": false,
     "fortune_result": { ... }
   }
   
   Response (201 Created):
   {
     "id": "f14413d8-...",
     "user_id": "b6b94eda-...",
     "created_at": "2025-11-09T01:29:08.180395+00"
   }
   ```

3. **'내 기록' 메뉴에서 저장된 사주 확인**
   ```
   GET https://aofwcllxvzgdhtarwoez.supabase.co/rest/v1/saju_results
       ?user_id=eq.b6b94eda-...&select=*
   
   Response (200 OK):
   [
     {
       "id": "f14413d8-...",
       "user_id": "b6b94eda-...",
       "name": "홍길동",
       "fortune_result": { ... }
     }
   ]
   ```

---

## 🔍 API 디버깅 방법

### Chrome DevTools에서 확인:

1. **F12** 또는 **우클릭 → 검사**
2. **Network** 탭 선택
3. **Preserve log** 체크 (페이지 새로고침 시에도 로그 유지)
4. 서비스 사용하면서 API 호출 실시간 확인

### 필터링:

- `swift-handler`: OpenAI API 호출
- `auth/v1`: 인증 관련
- `saju_results`: 데이터베이스 저장/조회
- `forceteller`: 만세력 차트 API

---

## 📊 API 응답 시간

- **OpenAI API**: 10-30초 (AI 생성 시간)
- **Supabase Auth**: 1-2초
- **Supabase Database**: 0.2-0.5초
- **Manseryeok API**: 1-2초

---

## 🔐 환경 변수

### 클라이언트 (.env)
```bash
VITE_SUPABASE_URL=https://aofwcllxvzgdhtarwoez.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Supabase Secrets (Edge Function)
```bash
OPENAI_API_KEY=sk-proj-...
```

### Netlify 환경 변수
```bash
VITE_SUPABASE_URL=https://aofwcllxvzgdhtarwoez.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

---

## 📝 주요 파일 구조

```
src/
├── utils/
│   ├── fortuneGenerator.ts      # OpenAI API 호출
│   └── manseryeokApi.ts         # 만세력 API 호출
├── hooks/
│   └── useAuth.ts               # Supabase Auth 훅
├── lib/
│   └── supabase.ts              # Supabase 클라이언트 초기화
└── components/
    ├── FortuneResult.tsx        # DB 저장 로직
    └── MainScreen.tsx           # 메인 화면

supabase/
└── functions/
    └── generate-saju/
        └── index.ts             # OpenAI API Edge Function
```

---

## 🚀 배포 환경

- **Frontend**: Netlify (자동 배포)
- **Backend**: Supabase (Edge Functions + Database)
- **AI**: OpenAI Assistants API v2

---

## ✅ 테스트 완료 항목

- [x] OpenAI API 연동 및 사주 생성
- [x] Google OAuth 로그인
- [x] 사주 결과 데이터베이스 저장
- [x] 익명 사용자 지원
- [x] 로그인 후 기록 조회
- [x] CORS 이슈 해결
- [x] API 키 보안 처리

