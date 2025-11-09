export interface ManseryeokInput {
  name: string;
  gender: 'M' | 'F';
  calendar: 'S' | 'L'; // S: 양력, L: 음력
  birthday: string; // YYYY/MM/DD 형식
  birthtime: string; // HH:MM 형식
  hmUnsure: boolean;
  midnightAdjust: boolean;
  locationId: number;
  locationName: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  min: number;
}

export interface CheonGan {
  id: number;
  name: string;
  chinese: string;
  _음양: {
    id: number;
    name: string;
    chinese: string;
  };
  _오행: {
    id: number;
    name: string;
    chinese: string;
  };
  _십성: {
    id: number;
    name: string;
    chinese: string;
  };
}

export interface JiJi {
  id: number;
  name: string;
  chinese: string;
  _음양: {
    id: number;
    name: string;
    chinese: string;
  };
  _오행: {
    id: number;
    name: string;
    chinese: string;
  };
  _십성: {
    id: number;
    name: string;
    chinese: string;
  };
}

export interface JiJangGan {
  id: number;
  name: string;
  chinese: string;
}

export interface UnSeong {
  id: number;
  name: string;
  chinese: string;
}

export interface Pillar {
  _천간: CheonGan;
  _지지: JiJi;
  _지장간: JiJangGan[];
  _운성: UnSeong;
}

export interface SinSal {
  id: number;
  name: string;
  chinese: string;
}

export interface ManseryeokChart {
  bitmap: number;
  _기본명식: {
    _세차: Pillar;
    _월건: Pillar;
    _일진: Pillar;
    _시진: Pillar;
  };
  _신살: {
    _세차: SinSal;
    _월건: SinSal;
    _일진: SinSal;
    _시진: SinSal;
  };
  profile: {
    index: number;
    avatar: string;
    sexagenaryCycle: string;
    sunBirth: string;
    lunBirth: string;
    adjustedBirth: string;
    location: string;
    adjusted: string;
  };
}

export interface ManseryeokResponse {
  status: number;
  data: ManseryeokChart;
}