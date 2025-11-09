# 공자 사주 - 정통 사주 서비스

정확한 사주 분석과 사주를 제공하는 무료 공자 사주 서비스입니다.

## 🚀 새로운 Supabase 데이터베이스 설정 방법

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 로그인
2. "New Project" 클릭
3. 프로젝트 이름: `saju-fortune-app`
4. 데이터베이스 비밀번호 설정
5. 지역 선택 (Seoul 권장)
6. "Create new project" 클릭

### 2. 데이터베이스 스키마 설정
1. Supabase 대시보드에서 **SQL Editor** 클릭
2. `supabase/migrations/create_initial_schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣기
4. **Run** 버튼 클릭하여 실행

### 3. 환경 변수 설정
1. Supabase 대시보드에서 **Settings** > **API** 클릭
2. 다음 값들을 복사:
   - Project URL
   - anon public key
3. `.env` 파일 업데이트:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Google OAuth 설정 (선택사항)
1. Supabase 대시보드에서 **Authentication** > **Providers** 클릭
2. **Google** 활성화
3. Google Cloud Console에서 OAuth 클라이언트 ID 생성
4. Authorized redirect URIs에 추가:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   ```

### 5. Storage 설정
1. Supabase 대시보드에서 **Storage** 클릭
2. `images` 버킷이 자동으로 생성되었는지 확인
3. 캐릭터 이미지 업로드:
   - `characters/master.png` 경로로 업로드

### 6. Edge Functions 설정 (OpenAI 사주 분석용)
1. OpenAI API 키 준비
2. Supabase 대시보드에서 **Edge Functions** 클릭
3. `generate-saju` 함수가 배포되어 있는지 확인
4. Environment Variables에 `OPENAI_API_KEY` 추가

## 🛠️ 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm run dev

# 빌드
npm run build
```

## 📋 주요 기능

- ✅ 무료 사주 분석 (OpenAI 기반)
- ✅ 만세력 차트 표시
- ✅ 사용자 계정 관리 (Google OAuth)
- ✅ 사주 결과 저장 및 조회
- ✅ 사주 결과 공유 기능
- ✅ 반응형 모바일 UI
- ✅ 실시간 이미지 저장소

## 🗄️ 데이터베이스 구조

### Tables
- `saju_results`: 사주 분석 결과 저장
- `user_profiles`: 사용자 프로필 정보
- `debug_logs`: 디버깅용 로그

### Storage
- `images`: 캐릭터 이미지 및 에셋 저장

## 🔐 보안 설정

- Row Level Security (RLS) 활성화
- 사용자별 데이터 접근 제어
- 익명 사용자 사주 분석 허용
- 공개 이미지 저장소

## 🚀 배포

```bash
# Netlify 배포
npm run build
# dist 폴더를 Netlify에 업로드
```

## 📞 지원

문제가 발생하면 GitHub Issues를 통해 문의해주세요.