import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MainScreen from './components/MainScreen';
import SajuForm from './components/SajuForm';
import FortuneResult from './components/FortuneResult';
import ShareView from './components/ShareView';
import MyRecords from './components/MyRecords';
import Settings from './components/Settings';
import DetailedFortune from './components/DetailedFortune';
import { SajuInput, FortuneResult as FortuneResultType, ShareData, SajuRecord } from './types/saju';
import { generateFortune } from './utils/fortuneGenerator';
import { supabase } from './lib/supabase';
import { useAuth } from './hooks/useAuth';

type Screen = 'main' | 'form' | 'result' | 'share' | 'records' | 'settings' | 'detailed' | 'record-detailed';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('main');
  const [fortuneResult, setFortuneResult] = useState<FortuneResultType | null>(null);
  const [sajuInput, setSajuInput] = useState<SajuInput | null>(null);
  const [shareData, setShareData] = useState<ShareData | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<SajuRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if this is a share URL
    const urlParams = new URLSearchParams(window.location.search);
    const shareDataParam = urlParams.get('data');
    
    if (shareDataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(shareDataParam));
        setShareData(data);
        setCurrentScreen('share');
      } catch (error) {
        console.error('Invalid share data:', error);
        setCurrentScreen('main');
      }
    }
  }, []);

  const handleStartFortune = () => {
    setCurrentScreen('form');
  };

  const handleViewRecords = () => {
    setCurrentScreen('records');
  };

  const handleViewSettings = () => {
    setCurrentScreen('settings');
  };

  const handleViewDetailed = () => {
    setCurrentScreen('detailed');
  };

  const handleViewRecordDetailed = (record: SajuRecord) => {
    setSelectedRecord(record);
    setCurrentScreen('record-detailed');
  };

  const handleFormSubmit = async (input: SajuInput) => {
    setIsLoading(true);
    
    try {
      // Generate fortune result using OpenAI API
      const result = await generateFortune(input);
      
      // Save to database with user_id if user is logged in
      const { error } = await supabase
        .from('saju_results')
        .insert({
          user_id: user?.id || null,
          name: input.name,
          gender: input.gender,
          birth_year: input.birthYear,
          birth_month: input.birthMonth,
          birth_day: input.birthDay,
          birth_time: input.birthTime,
          lunar_calendar: input.lunarCalendar,
          fortune_result: result
        });

      if (error) {
        console.error('Error saving fortune result:', error);
        // Still show result even if saving fails
      }

      setSajuInput(input);
      setFortuneResult(result);
      setCurrentScreen('result');
    } catch (error) {
      console.error('Error generating fortune:', error);
      // Show error message or fallback
      alert('사주 생성 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewReading = () => {
    setFortuneResult(null);
    setSajuInput(null);
    setShareData(null);
    setSelectedRecord(null);
    setCurrentScreen('main');
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleBack = () => {
    if (currentScreen === 'form') {
      setCurrentScreen('main');
    } else if (currentScreen === 'result') {
      setCurrentScreen('form');
    } else if (currentScreen === 'detailed') {
      setCurrentScreen('result');
    } else if (currentScreen === 'record-detailed') {
      setCurrentScreen('records');
      setSelectedRecord(null);
    } else if (currentScreen === 'share') {
      setCurrentScreen('main');
      setShareData(null);
      // Clear URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (currentScreen === 'records') {
      setCurrentScreen('main');
    } else if (currentScreen === 'settings') {
      setCurrentScreen('main');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentScreen !== 'main' && (
        <Header 
          onBack={handleBack} 
          showBackButton={true}
          onViewRecords={handleViewRecords}
          onViewSettings={handleViewSettings}
        />
      )}
      
      {currentScreen === 'main' && (
        <MainScreen 
          onStartFortune={handleStartFortune}
          onViewRecords={handleViewRecords}
          onViewSettings={handleViewSettings}
        />
      )}
      
      {currentScreen === 'form' && (
        <SajuForm 
          onSubmit={handleFormSubmit} 
          isLoading={isLoading}
        />
      )}
      
      {currentScreen === 'result' && fortuneResult && sajuInput && (
        <FortuneResult 
          result={fortuneResult} 
          input={sajuInput}
          onNewReading={handleNewReading}
          onViewDetailed={handleViewDetailed}
        />
      )}

      {currentScreen === 'detailed' && fortuneResult && sajuInput && (
        <DetailedFortune 
          result={fortuneResult} 
          input={sajuInput}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'record-detailed' && selectedRecord && (
        <DetailedFortune 
          result={selectedRecord.fortune_result} 
          input={{
            name: selectedRecord.name || '사용자',
            gender: selectedRecord.gender as '남자' | '여자',
            birthYear: selectedRecord.birth_year,
            birthMonth: selectedRecord.birth_month,
            birthDay: selectedRecord.birth_day,
            birthTime: selectedRecord.birth_time,
            lunarCalendar: selectedRecord.lunar_calendar
          }}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'share' && shareData && (
        <ShareView data={shareData} />
      )}

      {currentScreen === 'records' && (
        <MyRecords 
          onBack={handleBack} 
          onViewDetailed={handleViewRecordDetailed}
        />
      )}

      {currentScreen === 'settings' && (
        <Settings onBack={handleBack} />
      )}
    </div>
  );
}

export default App;