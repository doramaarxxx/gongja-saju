export interface SajuInput {
  name: string;
  gender: '남자' | '여자' | '';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime: string;
  lunarCalendar: boolean;
}

export interface FortuneResult {
  평생사주_총평: string;
  재물운: {
    재물운: string;
    재물_모으는_법: string;
    재물_손실_막는법: string;
    재테크_비법: string;
    커리어: string;
  };
  시기별: {
    초년운: string;
    중년운: string;
    말년운: string;
    올해_기대할_점: string;
    올해_주의할_점: string;
    올해_추천_행동: string;
  };
  건강운: {
    건강운: string;
    체질운: string;
  };
  애정운: {
    애정운: string;
    이성운: string;
  };
}

export interface SajuResult {
  id: string;
  user_id: string | null;
  input: SajuInput;
  result: FortuneResult;
  createdAt: string;
}

export interface ShareData {
  name: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthTime: string;
  lunarCalendar: boolean;
  평생사주_총평: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SajuRecord {
  id: string;
  user_id: string | null;
  name: string | null;
  gender: string;
  birth_year: number;
  birth_month: number;
  birth_day: number;
  birth_time: string;
  lunar_calendar: boolean;
  fortune_result: FortuneResult;
  created_at: string;
}