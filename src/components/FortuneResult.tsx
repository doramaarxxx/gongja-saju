import React, { useState, useEffect } from 'react';
import { Heart, Activity, Star, DollarSign, Clock, User, TrendingUp, Shield, Users, Sparkles, Target, X, Share2, Save } from 'lucide-react';
import { FortuneResult as FortuneResultType } from '../types/saju';
import { SajuInput } from '../types/saju';
import { ManseryeokChart as ManseryeokChartType } from '../types/manseryeok';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { getImageUrl } from '../lib/storage';
import { getManseryeokChart } from '../utils/manseryeokApi';
import ManseryeokChart from './ManseryeokChart';

interface FortuneResultProps {
  result: FortuneResultType;
  input: SajuInput;
  onNewReading: () => void;
  onViewDetailed: () => void;
}

export default function FortuneResult({ result, input, onNewReading, onViewDetailed }: FortuneResultProps) {
  const [showSharePopup, setShowSharePopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [sajuRecordId, setSajuRecordId] = useState<string | null>(null);
  const [hasProcessedPendingSave, setHasProcessedPendingSave] = useState(false);
  const [manseryeokChart, setManseryeokChart] = useState<ManseryeokChartType | null>(null);
  const [loadingChart, setLoadingChart] = useState(true);
  const { user, signInWithGoogle, loading } = useAuth();

  // 만세력 차트 로드
  useEffect(() => {
    const loadManseryeokChart = async () => {
      setLoadingChart(true);
      try {
        const chartResponse = await getManseryeokChart(input);
        if (chartResponse && chartResponse.status === 200) {
          setManseryeokChart(chartResponse.data);
        }
      } catch (error) {
        console.error('Error loading manseryeok chart:', error);
      } finally {
        setLoadingChart(false);
      }
    };

    loadManseryeokChart();
  }, [input]);

  // Check if this result is already saved
  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user, result]);

  const checkIfSaved = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saju_results')
        .select('id')
        .eq('user_id', user.id)
        .eq('name', input.name)
        .eq('gender', input.gender)
        .eq('birth_year', input.birthYear)
        .eq('birth_month', input.birthMonth)
        .eq('birth_day', input.birthDay)
        .eq('birth_time', input.birthTime)
        .eq('lunar_calendar', input.lunarCalendar)
        .limit(1);

      if (error) throw error;
      setIsSaved(data && data.length > 0);
      if (data && data.length > 0) {
        setSajuRecordId(data[0].id);
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
    }
  };

  const formatBirthInfo = () => {
    const calendarType = input.lunarCalendar ? '음력' : '양력';
    const birthDate = `${input.birthYear}년 ${input.birthMonth}월 ${input.birthDay}일`;
    const birthTime = input.birthTime === '선택' ? '시간 미선택' : input.birthTime;
    
    return {
      calendarType,
      birthDate,
      birthTime
    };
  };

  const handleShare = async () => {
    // Create a simple share URL with basic info
    const shareData = {
      name: input.name,
      gender: input.gender,
      birthYear: input.birthYear,
      birthMonth: input.birthMonth,
      birthDay: input.birthDay,
      birthTime: input.birthTime,
      lunarCalendar: input.lunarCalendar,
      평생사주_총평: result.평생사주_총평
    };
    
    const shareUrl = `${window.location.origin}?data=${encodeURIComponent(JSON.stringify(shareData))}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShowSharePopup(true);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowSharePopup(true);
    }
  };

  const handleSave = async () => {
    if (!user) {
      setShowSavePopup(true);
      return;
    }

    if (isSaved) {
      alert('이미 저장된 사주 결과입니다.');
      return;
    }

    setSaving(true);
    try {
      // 먼저 익명으로 저장된 레코드가 있는지 확인
      if (sajuRecordId) {
        // 기존 레코드를 현재 사용자에게 연결
        const { error } = await supabase
          .from('saju_results')
          .update({ user_id: user.id })
          .eq('id', sajuRecordId)
          .eq('user_id', null); // 아직 소유자가 없는 레코드만 업데이트

        if (error) throw error;
      } else {
        // 새로 저장
        const { data, error } = await supabase
          .from('saju_results')
          .insert({
            user_id: user.id,
            name: input.name,
            gender: input.gender,
            birth_year: input.birthYear,
            birth_month: input.birthMonth,
            birth_day: input.birthDay,
            birth_time: input.birthTime,
            lunar_calendar: input.lunarCalendar,
            fortune_result: result
          })
          .select()
          .single();

        if (error) throw error;
        setSajuRecordId(data.id);
      }
      
      setIsSaved(true);
      alert('사주 결과가 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error('Error saving fortune result:', error);
      alert('저장 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setSaving(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // 현재 사주 레코드 ID만 저장 (훨씬 간단!)
      const saveData = {
        sajuRecordId: sajuRecordId, // 이미 DB에 저장된 레코드의 ID
        timestamp: Date.now()
      };
      
      localStorage.setItem('pendingSajuSave', JSON.stringify(saveData));
      
      await signInWithGoogle();
      setShowSavePopup(false);
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // Check for pending save after login - 훨씬 간단해짐!
  useEffect(() => {
    if (user && !hasProcessedPendingSave) {
      const handlePendingSave = async () => {
        // 1. localStorage에서 pendingSave 확인
        const pendingSave = localStorage.getItem('pendingSajuSave');
        
        if (pendingSave) {
          try {
            const { sajuRecordId: savedRecordId, timestamp } = JSON.parse(pendingSave);
            
            // Check if the data is recent (within 1 hour)
            const isRecent = Date.now() - timestamp < 60 * 60 * 1000;
            
            // Check if this matches current record
            const isCurrentRecord = savedRecordId === sajuRecordId;

            if (isRecent && savedRecordId) {
              // Auto-save: 기존 레코드의 user_id만 업데이트
              const autoSave = async () => {
                try {
                  // 먼저 해당 레코드가 존재하는지 확인
                  const { data: existingRecord, error: selectError } = await supabase
                    .from('saju_results')
                    .select('id, user_id, name')
                    .eq('id', savedRecordId)
                    .single();

                  if (selectError) {
                    throw selectError;
                  }
                  
                  // 레코드가 이미 다른 사용자에게 속해있는지 확인
                  if (existingRecord.user_id !== null) {
                    alert('이 사주 결과는 이미 다른 계정에 저장되어 있습니다.');
                    localStorage.removeItem('pendingSajuSave');
                    return;
                  }

                  // 업데이트 실행
                  const { data, error } = await supabase
                    .from('saju_results')
                    .update({ user_id: user.id })
                    .eq('id', savedRecordId)
                    .eq('user_id', null) // 아직 소유자가 없는 레코드만 업데이트
                    .select();

                  if (error) {
                    throw error;
                  }

                  setIsSaved(true);
                  setSajuRecordId(savedRecordId); // 현재 컴포넌트 상태도 업데이트
                  alert('로그인 완료! 사주 결과가 자동으로 저장되었습니다.');
                  localStorage.removeItem('pendingSajuSave');
                  
                } catch (error) {
                  console.error('자동 저장 중 오류 발생:', error);
                  alert('자동 저장 중 오류가 발생했습니다.');
                  localStorage.removeItem('pendingSajuSave');
                }
              };

              autoSave();
            } else {
              // Different data or too old, remove old pending save
              localStorage.removeItem('pendingSajuSave');
            }
          } catch (error) {
            console.error('pendingSave 파싱 실패:', error);
            localStorage.removeItem('pendingSajuSave');
          }
        }
        
        // 처리 완료 표시
        setHasProcessedPendingSave(true);
      };

      handlePendingSave();
    }
  }, [user, sajuRecordId, hasProcessedPendingSave]); // sajuRecordId 추가

  // 사주 결과가 생성될 때 자동으로 익명 레코드 생성
  useEffect(() => {
    if (result && input && !sajuRecordId && !user) {
      const saveAnonymousRecord = async () => {
        try {
          const { data, error } = await supabase
            .from('saju_results')
            .insert({
              user_id: null, // 익명 레코드
              name: input.name,
              gender: input.gender,
              birth_year: input.birthYear,
              birth_month: input.birthMonth,
              birth_day: input.birthDay,
              birth_time: input.birthTime,
              lunar_calendar: input.lunarCalendar,
              fortune_result: result
            })
            .select()
            .single();

          if (error) throw error;

          setSajuRecordId(data.id);
        } catch (error) {
          console.error('Error creating anonymous record:', error);
        }
      };

      saveAnonymousRecord();
    }
  }, [result, input, sajuRecordId, user]);

  const birthInfo = formatBirthInfo();

  // 여러 이미지 경로 시도
  const characterImagePaths = [
    'characters/master.png',
    'characters/master.jpg',
    'master.png',
    'master.jpg'
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    if (currentImageIndex < characterImagePaths.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setImageError(true);
    }
  };

  const characterImageUrl = !imageError ? getImageUrl(characterImagePaths[currentImageIndex]) : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
      {/* Header with Character */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-300/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{input.name}님의 사주 결과</h1>
              <p className="opacity-90">정확한 분석을 통한 맞춤 사주입니다</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShare}
                className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {/* Character Image */}
              <div className="w-16 h-16 relative">
                {characterImageUrl && !imageError ? (
                  <img 
                    src={characterImageUrl}
                    alt="공자 사주 마스터" 
                    className="w-full h-full object-cover rounded-full border-2 border-white/30 shadow-lg"
                    onError={handleImageError}
                  />
                ) : (
                  /* 폴백 아이콘 */
                  <div className="w-full h-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full border-2 border-white/30 shadow-lg flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-400/20"></div>
              </div>
            </div>
          </div>
          
          {/* Character speech bubble */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 mt-4 shadow-lg">
            <div className="absolute -top-2 right-8 w-4 h-4 bg-white/95 rotate-45"></div>
            <p className="text-gray-800 text-sm leading-relaxed">
              <span className="font-semibold text-purple-600">{input.name}님</span>의 사주를 깊이 분석했습니다.<br />
              아래 결과를 통해 <span className="font-semibold">인생의 방향</span>을 찾아보세요!
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* User Input Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            입력 정보
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">이름</span>
              <span className="font-semibold text-gray-900">{input.name}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">성별</span>
              <span className="font-semibold text-gray-900">{input.gender}</span>
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

        {/* 만세력 차트 */}
        {loadingChart ? (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">만세력을 불러오는 중...</p>
            </div>
          </div>
        ) : manseryeokChart ? (
          <ManseryeokChart chart={manseryeokChart} />
        ) : (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="text-center py-8">
              <p className="text-gray-600">만세력 정보를 불러올 수 없습니다.</p>
            </div>
          </div>
        )}

        {/* 평생사주 총평 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-5 h-5 text-purple-600 mr-2" />
            평생사주 총평
          </h3>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-700 leading-relaxed">{result.평생사주_총평}</p>
          </div>
        </div>

        {/* 재물운 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            재물운
          </h3>
          <div className="space-y-4">
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">재물운</h4>
              <p className="text-gray-700 leading-relaxed">{result.재물운.재물운}</p>
            </div>
            <div className="bg-emerald-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">재물 모으는 법</h4>
              <p className="text-gray-700 leading-relaxed">{result.재물운.재물_모으는_법}</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">재물 손실 막는법</h4>
              <p className="text-gray-700 leading-relaxed">{result.재물운.재물_손실_막는법}</p>
            </div>
            <div className="bg-lime-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">재테크 비법</h4>
              <p className="text-gray-700 leading-relaxed">{result.재물운.재테크_비법}</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">커리어</h4>
              <p className="text-gray-700 leading-relaxed">{result.재물운.커리어}</p>
            </div>
          </div>
        </div>

        {/* 시기별 운세 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            시기별 운세
          </h3>
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">초년운</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.초년운}</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">중년운</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.중년운}</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">말년운</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.말년운}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">올해 기대할 점</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.올해_기대할_점}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">올해 주의할 점</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.올해_주의할_점}</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">올해 추천 행동</h4>
              <p className="text-gray-700 leading-relaxed">{result.시기별.올해_추천_행동}</p>
            </div>
          </div>
        </div>

        {/* 건강운 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 text-red-600 mr-2" />
            건강운
          </h3>
          <div className="space-y-4">
            <div className="bg-red-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">건강운</h4>
              <p className="text-gray-700 leading-relaxed">{result.건강운.건강운}</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">체질운</h4>
              <p className="text-gray-700 leading-relaxed">{result.건강운.체질운}</p>
            </div>
          </div>
        </div>

        {/* 애정운 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Heart className="w-5 h-5 text-pink-600 mr-2" />
            애정운
          </h3>
          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">애정운</h4>
              <p className="text-gray-700 leading-relaxed">{result.애정운.애정운}</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 mb-2">이성운</h4>
              <p className="text-gray-700 leading-relaxed">{result.애정운.이성운}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onViewDetailed}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-4 rounded-2xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            상세 풀이보기
          </button>
          <button
            onClick={handleShare}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
          >
            <Share2 className="w-5 h-5 mr-2" />
            공유하기
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSave}
            disabled={saving || isSaved}
            className={`font-semibold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 ${
              isSaved 
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          >
            <Save className="w-5 h-5 mr-2" />
            <span>{saving ? '저장 중...' : isSaved ? '저장됨' : '저장하기'}</span>
          </button>
          <button
            onClick={onNewReading}
            className="bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            새로운 사주 보기
          </button>
        </div>
      </div>

      {/* Share Success Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">공유 링크 복사됨</h3>
              <button
                onClick={() => setShowSharePopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              간략 버전 사주 결과 공유 링크가<br />
              클립보드에 복사되었습니다.
            </p>
            <button
              onClick={() => setShowSharePopup(false)}
              className="w-full bg-purple-500 text-white font-semibold py-3 rounded-xl hover:bg-purple-600 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Save Login Popup */}
      {showSavePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">로그인 후 저장</h3>
              <button
                onClick={() => setShowSavePopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Save className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 leading-relaxed">
                사주 결과를 저장하려면<br />
                로그인이 필요합니다.<br />
                로그인 후 자동으로 저장됩니다.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 shadow-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>{loading ? '로그인 중...' : 'Google로 로그인'}</span>
              </button>
              <button
                onClick={() => setShowSavePopup(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}