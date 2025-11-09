# OpenAI API 연동 설정 가이드

이 가이드는 공자 사주 프로젝트에 OpenAI API를 연동하는 방법을 안내합니다.

## 📋 필요한 것들

1. ✅ Supabase 프로젝트: https://aofwcllxvzgdhtarwoez.supabase.co
2. ⬜ OpenAI API 키
3. ⬜ OpenAI Assistant ID

---

## 1단계: OpenAI API 키 생성

### 1-1. OpenAI 계정 및 API 키 생성

1. https://platform.openai.com/ 접속
2. 로그인 또는 회원가입
3. https://platform.openai.com/api-keys 로 이동
4. **"Create new secret key"** 클릭
5. 이름 입력 (예: "Gongja-Saju") 후 생성
6. **⚠️ 중요**: 생성된 키를 복사하여 안전한 곳에 저장 (다시 볼 수 없음)

### 1-2. OpenAI 크레딧 확인

- https://platform.openai.com/settings/organization/billing/overview
- API 사용을 위해 최소 $5 크레딧 필요
- 결제 수단 등록 필요

---

## 2단계: OpenAI Assistant 생성 (이미 있으면 스킵)

코드에 하드코딩된 Assistant ID가 있습니다: `asst_YGbIebwqeW8nhU2DvUlLeGUd`

### 새로 만들려면:

1. https://platform.openai.com/assistants 접속
2. **"Create"** 클릭
3. 다음 설정 입력:

```
Name: 공자 사주 마스터
Instructions: 
당신은 전문적인 사주 명리학 전문가입니다. 
사용자의 생년월일시 정보를 받아 상세한 사주 분석을 제공합니다.
응답은 반드시 다음 JSON 형식으로 제공해야 합니다:

{
  "평생사주_총평": "전체적인 사주 분석",
  "재물운": {
    "재물운": "재물 운세",
    "재물_모으는_법": "재물 축적 방법",
    "재물_손실_막는법": "손실 예방 방법",
    "재테크_비법": "재테크 조언",
    "커리어": "직업 운세"
  },
  "시기별": {
    "초년운": "초년 운세",
    "중년운": "중년 운세",
    "말년운": "말년 운세",
    "올해_기대할_점": "올해 기대사항",
    "올해_주의할_점": "올해 주의사항",
    "올해_추천_행동": "올해 권장 행동"
  },
  "건강운": {
    "건강운": "건강 운세",
    "체질운": "체질 분석"
  },
  "애정운": {
    "애정운": "애정 운세",
    "이성운": "이성 운세"
  }
}

Model: gpt-4o (또는 gpt-4-turbo)
```

4. **Save** 클릭
5. Assistant ID 복사 (asst_xxxxx 형식)

### Assistant ID 업데이트가 필요하면:

`supabase/functions/generate-saju/index.ts` 파일 73번째 줄 수정:

```typescript
assistant_id: 'asst_YGbIebwqeW8nhU2DvUlLeGUd'  // 여기를 새 ID로 변경
```

---

## 3단계: Supabase에 Edge Function 배포

### 방법 1: Supabase CLI 사용 (터미널)

```bash
# 1. 프로젝트 디렉토리로 이동
cd /Users/hyunjunpark/Documents/project-gongja-saju

# 2. Supabase 로그인
npx supabase login

# 3. 프로젝트 연결
npx supabase link --project-ref aofwcllxvzgdhtarwoez

# 4. Edge Function 배포
npx supabase functions deploy generate-saju

# 5. OpenAI API 키 설정
npx supabase secrets set OPENAI_API_KEY=sk-your-api-key-here
```

### 방법 2: Supabase Dashboard 사용 (웹, 더 쉬움)

1. https://supabase.com/dashboard/project/aofwcllxvzgdhtarwoez/functions 접속

2. **"Create a new function"** 클릭

3. Function name: `generate-saju` 입력

4. 코드 입력란에 `supabase/functions/generate-saju/index.ts` 파일의 전체 내용 복사-붙여넣기

5. **"Deploy function"** 클릭

6. 환경 변수 설정:
   - 좌측 메뉴에서 **"Edge Functions"** → **"Settings"** 클릭
   - **"Add new secret"** 클릭
   - Name: `OPENAI_API_KEY`
   - Value: 복사한 OpenAI API 키 붙여넣기
   - **"Save"** 클릭

---

## 4단계: 테스트

### 로컬 테스트

1. 개발 서버 실행:
```bash
npm run dev
```

2. http://localhost:5173 접속

3. '사주보기' 버튼 클릭하여 테스트

4. 브라우저 개발자 콘솔(F12)에서 로그 확인:
   - "Calling Edge Function with input" → 요청 시작
   - "Edge Function response" → 성공
   - "Using fallback fortune" → 실패 시 폴백 사용

### 배포된 사이트 테스트

1. GitHub에 푸시:
```bash
git add .
git commit -m "OpenAI API 연동 완료"
git push origin main
```

2. Netlify 자동 배포 대기 (약 2-3분)

3. 배포된 사이트에서 테스트

---

## 5단계: 문제 해결

### Edge Function 로그 확인

https://supabase.com/dashboard/project/aofwcllxvzgdhtarwoez/logs/edge-functions

### 일반적인 오류들

#### 1. CORS 에러
- Edge Function이 배포되지 않았거나
- CORS 헤더가 누락됨
- 현재 코드에는 CORS 헤더가 포함되어 있음

#### 2. OpenAI API 에러
```
Failed to create thread
```
- API 키가 올바르지 않음
- OpenAI 크레딧이 부족함
- API 키에 권한이 없음

해결: 
- API 키 재확인
- https://platform.openai.com/settings/organization/billing 에서 크레딧 확인

#### 3. Assistant 에러
```
Assistant run did not complete successfully
```
- Assistant ID가 잘못되었거나
- Assistant가 삭제됨
- API 요청 타임아웃 (30초 초과)

해결:
- Assistant ID 확인
- https://platform.openai.com/assistants 에서 Assistant 상태 확인

#### 4. Fallback 사용
Edge Function 호출 실패 시 자동으로 기본 사주 결과를 반환합니다.
- 사용자 경험은 유지됨
- 로그에서 "Using fallback fortune" 확인

---

## 비용 예상

### OpenAI API 비용 (GPT-4o 기준)

- 1회 사주 분석: 약 $0.01 - 0.05
- 월 1,000회 사용: 약 $10 - 50
- Assistants API는 토큰 사용량에 따라 과금

자세한 요금: https://openai.com/api/pricing/

### Supabase 비용

- Edge Functions: Free 플랜에서 월 500,000 요청 무료
- 데이터베이스: Free 플랜 500MB 무료

---

## 요약 체크리스트

- [ ] OpenAI API 키 생성 및 저장
- [ ] OpenAI 크레딧 충전 ($5 이상)
- [ ] OpenAI Assistant 생성 (또는 기존 것 사용)
- [ ] Supabase Edge Function 배포
- [ ] Supabase에 OPENAI_API_KEY 환경 변수 설정
- [ ] 로컬에서 테스트
- [ ] GitHub 푸시 및 Netlify 배포
- [ ] 배포된 사이트에서 테스트

---

## 도움이 필요하시면

문제가 발생하면 다음을 확인하세요:

1. Supabase Edge Function 로그
2. 브라우저 개발자 콘솔
3. OpenAI API 사용량 및 크레딧

모든 설정이 완료되면 이 파일은 삭제하셔도 됩니다!

