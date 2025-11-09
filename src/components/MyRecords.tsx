import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, Eye, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { SajuRecord } from '../types/saju';

interface MyRecordsProps {
  onBack: () => void;
  onViewDetailed: (record: SajuRecord) => void;
}

export default function MyRecords({ onBack, onViewDetailed }: MyRecordsProps) {
  const [records, setRecords] = useState<SajuRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('saju_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteRecord = async (recordId: string) => {
    try {
      const { error } = await supabase
        .from('saju_results')
        .delete()
        .eq('id', recordId)
        .eq('user_id', user?.id);

      if (error) throw error;
      
      setRecords(records.filter(record => record.id !== recordId));
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting record:', error);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatBirthInfo = (record: SajuRecord) => {
    const calendarType = record.lunar_calendar ? '음력' : '양력';
    const birthDate = `${record.birth_year}년 ${record.birth_month}월 ${record.birth_day}일`;
    const birthTime = record.birth_time === '선택' ? '시간 미선택' : record.birth_time;
    
    return {
      calendarType,
      birthDate,
      birthTime
    };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-600 mb-6">사주 기록을 보려면 먼저 로그인해 주세요.</p>
          <button
            onClick={onBack}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사주 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">내 사주 기록</h1>
        <p className="opacity-90">지금까지 본 사주 결과들을 확인해보세요</p>
      </div>

      <div className="px-6 py-6">
        {records.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 사주 기록이 없습니다</h3>
            <p className="text-gray-600 mb-6">첫 번째 사주를 보러 가볼까요?</p>
            <button
              onClick={onBack}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition-colors"
            >
              사주 보러가기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map((record) => {
              const birthInfo = formatBirthInfo(record);
              return (
                <div key={record.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-gray-900">
                          {record.name || '사용자'} ({record.gender})
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-600">
                          {birthInfo.calendarType} {birthInfo.birthDate}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(record.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">
                        {record.fortune_result.평생사주_총평}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetailed(record)}
                      className="flex-1 bg-purple-50 text-purple-700 py-2 px-4 rounded-xl hover:bg-purple-100 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>자세히 보기</span>
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(record.id)}
                      className="bg-red-50 text-red-700 py-2 px-4 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">사주 기록 삭제</h3>
              <p className="text-gray-600 mb-6">
                이 사주 기록을 삭제하시겠습니까?<br />
                삭제된 기록은 복구할 수 없습니다.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => deleteRecord(showDeleteConfirm)}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}