import React, { useState } from 'react';
import { X, Menu, Star, Sparkles, Heart, DollarSign, User } from 'lucide-react';
import Sidebar from './Sidebar';
import { getImageUrl } from '../lib/storage';
import masterCharacter from '../assets/master-character.png';

interface MainScreenProps {
  onStartFortune: () => void;
  onViewRecords: () => void;
  onViewSettings: () => void;
}

export default function MainScreen({ onStartFortune, onViewRecords, onViewSettings }: MainScreenProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fortuneCards = [
    { 
      title: '평생사주', 
      description: '당신의 인생 전반적인 사주', 
      active: true,
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      title: '월간 종합사주', 
      description: '이달의 전체적인 사주', 
      active: false,
      icon: Sparkles,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: '2025 신토정비결', 
      description: '새해 신년 사주', 
      active: false,
      icon: Heart,
      color: 'from-rose-500 to-pink-500'
    },
    { 
      title: '2025 부자되기', 
      description: '재물운과 성공 사주', 
      active: false,
      icon: DollarSign,
      color: 'from-emerald-500 to-green-500'
    }
  ];

  const handleCardClick = (card: typeof fortuneCards[0]) => {
    if (card.active) {
      onStartFortune();
    } else {
      setShowPopup(true);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header with title and hamburger menu */}
      <div className="relative z-10 flex justify-between items-center px-6 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">공자 사주</h1>
        <button 
          onClick={toggleSidebar}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Hero Section with Character */}
      <div className="relative z-10 px-6 pt-4 pb-6 flex-1">
        {/* Character and Introduction */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            {/* Character Avatar */}
            <div className="w-32 h-32 mx-auto mb-4 relative">
              <img 
                src={masterCharacter}
                alt="공자 사주 마스터"
                className="w-full h-full object-cover rounded-full border-4 border-white/20 shadow-2xl relative z-10"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400/30 to-pink-400/30 blur-xl"></div>
            </div>
            
            {/* Character speech bubble */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 mx-4 shadow-xl">
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/95 rotate-45"></div>
              <p className="text-gray-800 font-medium text-sm leading-relaxed">
                안녕하세요! 저는 공자 사주의 마스터입니다.<br />
                <span className="text-purple-600 font-semibold">정확하고 깊이 있는 사주 분석</span>으로<br />
                여러분의 운명을 밝혀드리겠습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Fortune Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {fortuneCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                onClick={() => handleCardClick(card)}
                className={`relative p-4 rounded-2xl border border-white/20 backdrop-blur-sm transition-all duration-300 ${
                  card.active 
                    ? `bg-gradient-to-br ${card.color} cursor-pointer hover:scale-105 hover:shadow-2xl shadow-lg` 
                    : 'bg-white/10 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <IconComponent className={`w-6 h-6 ${card.active ? 'text-white' : 'text-white/60'}`} />
                  {!card.active && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      준비중
                    </div>
                  )}
                </div>
                <h3 className={`font-bold text-sm mb-1 ${card.active ? 'text-white' : 'text-white/60'}`}>
                  {card.title}
                </h3>
                <p className={`text-xs ${card.active ? 'text-white/90' : 'text-white/40'}`}>
                  {card.description}
                </p>
                
                {card.active && (
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Privacy Notice - 간단한 텍스트로 변경 */}
        <div className="mb-6">
          <p className="text-white/80 text-sm leading-relaxed text-left">
            로그인하지 않은 상태에서 보는 무료 사주 보기는<br />
            개인정보를 저장하지 않습니다.
          </p>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm rounded-t-3xl px-6 py-8 mt-auto shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">나만의 사주 여행을 시작하세요</h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            내 인생은 어떻게 흘러갈까?<br />
            <span className="text-purple-600 font-semibold">타고난 운명을 통해 인생의 나침반</span>을 받아보세요.
          </p>
        </div>
        
        <button
          onClick={onStartFortune}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold py-4 rounded-2xl hover:from-purple-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center justify-center">
            평생사주 보기 시작하기
          </span>
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-3">
          무료로 시작하고, 더 자세한 분석을 원하시면 로그인하세요
        </p>
      </div>

      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onViewRecords={onViewRecords}
        onViewSettings={onViewSettings}
      />

      {/* Custom Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">곧 만나요!</h3>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-center">
              해당 서비스는 현재 열심히 준비중입니다.<br />
              <span className="text-purple-600 font-semibold">더욱 완벽한 서비스</span>로 곧 찾아뵙겠습니다.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              확인
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}