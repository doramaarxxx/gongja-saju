import React, { useState } from 'react';
import { ArrowLeft, Menu } from 'lucide-react';
import Sidebar from './Sidebar';

interface HeaderProps {
  onBack?: () => void;
  showBackButton?: boolean;
  onViewRecords?: () => void;
  onViewSettings?: () => void;
}

export default function Header({ onBack, showBackButton = false, onViewRecords, onViewSettings }: HeaderProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          {showBackButton ? (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          
          <h1 className="text-lg font-bold text-gray-900">공자 사주</h1>
          
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </header>

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onViewRecords={onViewRecords}
        onViewSettings={onViewSettings}
      />
    </>
  );
}