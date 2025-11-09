import React from 'react';
import { X, LogOut, User, History, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onViewRecords?: () => void;
  onViewSettings?: () => void;
}

export default function Sidebar({ isOpen, onClose, onViewRecords, onViewSettings }: SidebarProps) {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error) {
      console.error('구글 로그인 실패:', error);
      alert('로그인에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleViewRecords = () => {
    if (onViewRecords) {
      onViewRecords();
      onClose();
    }
  };

  const handleViewSettings = () => {
    if (onViewSettings) {
      onViewSettings();
      onClose();
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">메뉴</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          
          {/* Content */}
          <div className="flex-1 p-6">
            {user ? (
              /* 로그인된 상태 */
              <div className="space-y-6">
                {/* 사용자 정보 */}
                <div className="bg-purple-50 rounded-2xl p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1">
                        사용자
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 메뉴 항목들 */}
                <div className="space-y-2">
                  <button 
                    onClick={handleViewRecords}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-3"
                  >
                    <History className="w-5 h-5 text-gray-500" />
                    <span>내 사주 기록</span>
                  </button>
                  <button 
                    onClick={handleViewSettings}
                    className="w-full text-left px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700 flex items-center space-x-3"
                  >
                    <Settings className="w-5 h-5 text-gray-500" />
                    <span>설정</span>
                  </button>
                </div>

                {/* 로그아웃 버튼 */}
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="w-full bg-gray-100 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{loading ? '로그아웃 중...' : '로그아웃'}</span>
                </button>
              </div>
            ) : (
              /* 로그인되지 않은 상태 */
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">로그인하고</h3>
                  <p className="text-gray-600 text-sm">더 많은 기능을 이용해보세요</p>
                </div>

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
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}