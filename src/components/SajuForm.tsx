import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { SajuInput } from '../types/saju';

interface SajuFormProps {
  onSubmit: (data: SajuInput) => void;
  isLoading: boolean;
}

export default function SajuForm({ onSubmit, isLoading }: SajuFormProps) {
  const [formData, setFormData] = useState<SajuInput>({
    name: '',
    gender: '' as any,
    birthYear: 0,
    birthMonth: 0,
    birthDay: 0,
    birthTime: '선택',
    lunarCalendar: false
  });
  const [showValidationPopup, setShowValidationPopup] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const timeOptions = [
    '선택', '자시(23-01시)', '축시(01-03시)', '인시(03-05시)', '묘시(05-07시)',
    '진시(07-09시)', '사시(09-11시)', '오시(11-13시)', '미시(13-15시)',
    '신시(15-17시)', '유시(17-19시)', '술시(19-21시)', '해시(21-23시)'
  ];

  const validateForm = () => {
    return formData.name.trim() && formData.gender && formData.birthYear > 0 && formData.birthMonth > 0 && formData.birthDay > 0 && formData.birthTime !== '선택';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowValidationPopup(true);
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32 relative">
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4">
          <p className="text-gray-600 text-sm leading-relaxed">
            정확한 사주 분석을 위해 실제 생일정보를 입력하여 주시기 바랍니다.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
        {/* 이름 */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">이름</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="이름을 입력해주세요"
            className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
            disabled={isLoading}
          />
        </div>

        {/* 성별 */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">성별</label>
          <div className="relative">
            <select
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as '남자' | '여자' }))}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
              disabled={isLoading}
            >
              <option value="">성별을 선택해주세요</option>
              <option value="남자">남자</option>
              <option value="여자">여자</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">생년월일</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="relative">
              <select
                value={formData.lunarCalendar ? '음력' : '양력'}
                onChange={(e) => setFormData(prev => ({ ...prev, lunarCalendar: e.target.value === '음력' }))}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                disabled={isLoading}
              >
                <option value="양력">양력</option>
                <option value="음력">음력</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={formData.birthYear || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, birthYear: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                disabled={isLoading}
              >
                <option value="">년도</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}년</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select
                value={formData.birthMonth || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, birthMonth: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                disabled={isLoading}
              >
                <option value="">월</option>
                {months.map(month => (
                  <option key={month} value={month}>{month}월</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <select
                value={formData.birthDay || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDay: parseInt(e.target.value) || 0 }))}
                className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
                disabled={isLoading}
              >
                <option value="">일</option>
                {days.map(day => (
                  <option key={day} value={day}>{day}일</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 태어난 시간 */}
        <div>
          <label className="block text-gray-700 font-medium mb-3">태어난 시간</label>
          <div className="relative">
            <select
              value={formData.birthTime}
              onChange={(e) => setFormData(prev => ({ ...prev, birthTime: e.target.value }))}
              className="w-full px-4 py-4 bg-white border border-gray-200 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-700"
              disabled={isLoading}
            >
              {timeOptions.map(time => (
                <option key={time} value={time}>{time}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </form>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold py-4 rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '사주 분석 중...' : '사주보기'}
        </button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-6 shadow-2xl">
            <div className="text-center">
              {/* Spinner */}
              <div className="flex justify-center mb-6">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
              </div>
              
              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {formData.name}님의 사주를 분석중입니다
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                정확한 사주 분석을 위해<br />
                열심히 계산하고 있습니다.<br />
                잠시만 기다려 주세요.
              </p>
              
              {/* Progress dots */}
              <div className="flex justify-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Validation Popup */}
      {showValidationPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">정보 입력 필요</h3>
              <button
                onClick={() => setShowValidationPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              정확한 사주 결과를 위해 모든 정보를 입력해 주세요.<br />
              이름, 성별, 생년월일, 태어난 시간이 모두 필요합니다.
            </p>
            <button
              onClick={() => setShowValidationPopup(false)}
              className="w-full bg-purple-500 text-white font-semibold py-3 rounded-xl hover:bg-purple-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}