import React from 'react';
import { Star, User } from 'lucide-react';
import { ShareData } from '../types/saju';

interface ShareViewProps {
  data: ShareData;
}

export default function ShareView({ data }: ShareViewProps) {
  const formatBirthInfo = () => {
    const calendarType = data.lunarCalendar ? '음력' : '양력';
    const birthDate = `${data.birthYear}년 ${data.birthMonth}월 ${data.birthDay}일`;
    const birthTime = data.birthTime === '선택' ? '시간 미선택' : data.birthTime;
    
    return {
      calendarType,
      birthDate,
      birthTime
    };
  };

  const birthInfo = formatBirthInfo();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">{data.name}님의 사주 결과 (간략 버전)</h1>
        <p className="opacity-90">공유된 사주 결과입니다</p>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* User Input Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            프로필 정보
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">이름</span>
              <span className="font-semibold text-gray-900">{data.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">성별</span>
              <span className="font-semibold text-gray-900">{data.gender}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">생년월일</span>
              <span className="font-semibold text-gray-900">{birthInfo.calendarType} {birthInfo.birthDate}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">태어난 시간</span>
              <span className="font-semibold text-gray-900">{birthInfo.birthTime}</span>
            </div>
          </div>
        </div>

        {/* Overall Fortune */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-purple-600 mr-2" />
            평생사주 총평
          </h3>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed">{data.평생사주_총평}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2">더 자세한 사주가 궁금하다면?</h3>
          <p className="text-gray-600 text-sm mb-4">재물운, 애정운, 건강운 등 상세 사주 분석을 무료로 받아보세요</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            내 사주 보러가기
          </button>
        </div>
      </div>
    </div>
  );
}