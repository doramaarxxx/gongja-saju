import { SajuInput } from '../types/saju';
import { ManseryeokInput, ManseryeokResponse } from '../types/manseryeok';

export async function getManseryeokChart(input: SajuInput): Promise<ManseryeokResponse | null> {
  try {
    // SajuInput을 ManseryeokInput 형식으로 변환
    const manseryeokInput: ManseryeokInput = {
      name: input.name,
      gender: input.gender === '남자' ? 'M' : 'F',
      calendar: input.lunarCalendar ? 'L' : 'S',
      birthday: `${input.birthYear}/${String(input.birthMonth).padStart(2, '0')}/${String(input.birthDay).padStart(2, '0')}`,
      birthtime: convertBirthTimeToHHMM(input.birthTime),
      hmUnsure: false,
      midnightAdjust: false,
      locationId: 1835847, // 서울 기본값
      locationName: " 서울특별시, 대한민국",
      year: input.birthYear,
      month: input.birthMonth,
      day: input.birthDay,
      hour: getBirthHour(input.birthTime),
      min: getBirthMinute(input.birthTime)
    };

    const response = await fetch('https://api.forceteller.com/api/pro/profile/saju/chart', {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        'origin': 'https://pro.forceteller.com',
        'pragma': 'no-cache',
        'referer': 'https://pro.forceteller.com/',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(manseryeokInput)
    });

    if (!response.ok) {
      throw new Error('Failed to fetch manseryeok chart');
    }

    const data: ManseryeokResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching manseryeok chart:', error);
    return null;
  }
}

function convertBirthTimeToHHMM(birthTime: string): string {
  if (birthTime === '선택') {
    return '12:00'; // 기본값
  }

  // 시간 매핑
  const timeMap: { [key: string]: string } = {
    '자시(23-01시)': '00:00',
    '축시(01-03시)': '02:00',
    '인시(03-05시)': '04:00',
    '묘시(05-07시)': '06:00',
    '진시(07-09시)': '08:00',
    '사시(09-11시)': '10:00',
    '오시(11-13시)': '12:00',
    '미시(13-15시)': '14:00',
    '신시(15-17시)': '16:00',
    '유시(17-19시)': '18:00',
    '술시(19-21시)': '20:00',
    '해시(21-23시)': '22:00'
  };

  return timeMap[birthTime] || '12:00';
}

function getBirthHour(birthTime: string): number {
  const timeStr = convertBirthTimeToHHMM(birthTime);
  return parseInt(timeStr.split(':')[0]);
}

function getBirthMinute(birthTime: string): number {
  const timeStr = convertBirthTimeToHHMM(birthTime);
  return parseInt(timeStr.split(':')[1]);
}