import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { ManseryeokChart as ManseryeokChartType } from '../types/manseryeok';

interface ManseryeokChartProps {
  chart: ManseryeokChartType;
}

export default function ManseryeokChart({ chart }: ManseryeokChartProps) {
  const { _기본명식, profile } = chart;

  // 오행별 색상 매핑
  const getElementColor = (element: string) => {
    switch (element) {
      case '목': return 'text-green-600 bg-green-50';
      case '화': return 'text-red-600 bg-red-50';
      case '토': return 'text-yellow-600 bg-yellow-50';
      case '금': return 'text-gray-600 bg-gray-50';
      case '수': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  // 십성별 색상 매핑
  const getSipseongColor = (sipseong: string) => {
    switch (sipseong) {
      case '비견': return 'text-purple-600 bg-purple-50';
      case '겁재': return 'text-purple-700 bg-purple-100';
      case '식신': return 'text-green-600 bg-green-50';
      case '상관': return 'text-green-700 bg-green-100';
      case '편재': return 'text-orange-600 bg-orange-50';
      case '정재': return 'text-orange-700 bg-orange-100';
      case '편관': return 'text-red-600 bg-red-50';
      case '정관': return 'text-red-700 bg-red-100';
      case '편인': return 'text-blue-600 bg-blue-50';
      case '정인': return 'text-blue-700 bg-blue-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <Calendar className="w-5 h-5 text-purple-600 mr-2" />
        만세력
      </h3>

      {/* 프로필 정보 */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={profile.avatar} 
            alt="띠 이미지" 
            className="w-12 h-12 rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
          <div>
            <h4 className="font-semibold text-gray-900">{profile.sexagenaryCycle}</h4>
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="w-3 h-3 mr-1" />
              {profile.location}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-gray-500">양력:</span>
            <span className="ml-1 font-medium">{profile.sunBirth}</span>
          </div>
          <div>
            <span className="text-gray-500">음력:</span>
            <span className="ml-1 font-medium">{profile.lunBirth}</span>
          </div>
        </div>
        {profile.adjusted && (
          <p className="text-xs text-gray-500 mt-2">{profile.adjusted}</p>
        )}
      </div>

      {/* 사주 차트 */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">구분</th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">세차<br/><span className="text-xs text-gray-500">(년)</span></th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">월건<br/><span className="text-xs text-gray-500">(월)</span></th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">일진<br/><span className="text-xs text-gray-500">(일)</span></th>
              <th className="p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50">시진<br/><span className="text-xs text-gray-500">(시)</span></th>
            </tr>
          </thead>
          <tbody>
            {/* 천간 */}
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">천간</td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._세차._천간.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._세차._천간.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._세차._천간._오행.name)}`}>
                    {_기본명식._세차._천간._오행.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._월건._천간.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._월건._천간.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._월건._천간._오행.name)}`}>
                    {_기본명식._월건._천간._오행.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._일진._천간.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._일진._천간.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._일진._천간._오행.name)}`}>
                    {_기본명식._일진._천간._오행.name}
                  </div>
                  <div className="text-xs text-yellow-700 font-medium">일주</div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._시진._천간.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._시진._천간.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._시진._천간._오행.name)}`}>
                    {_기본명식._시진._천간._오행.name}
                  </div>
                </div>
              </td>
            </tr>

            {/* 십성 */}
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">십성</td>
              <td className="p-3 text-center">
                <div className={`text-xs px-2 py-1 rounded-full ${getSipseongColor(_기본명식._세차._천간._십성.name)}`}>
                  {_기본명식._세차._천간._십성.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className={`text-xs px-2 py-1 rounded-full ${getSipseongColor(_기본명식._월건._천간._십성.name)}`}>
                  {_기본명식._월건._천간._십성.name}
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className={`text-xs px-2 py-1 rounded-full ${getSipseongColor(_기본명식._일진._천간._십성.name)}`}>
                  {_기본명식._일진._천간._십성.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className={`text-xs px-2 py-1 rounded-full ${getSipseongColor(_기본명식._시진._천간._십성.name)}`}>
                  {_기본명식._시진._천간._십성.name}
                </div>
              </td>
            </tr>

            {/* 지지 */}
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">지지</td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._세차._지지.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._세차._지지.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._세차._지지._오행.name)}`}>
                    {_기본명식._세차._지지._오행.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._월건._지지.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._월건._지지.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._월건._지지._오행.name)}`}>
                    {_기본명식._월건._지지._오행.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._일진._지지.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._일진._지지.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._일진._지지._오행.name)}`}>
                    {_기본명식._일진._지지._오행.name}
                  </div>
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">{_기본명식._시진._지지.name}</div>
                  <div className="text-xs text-gray-500">{_기본명식._시진._지지.chinese}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${getElementColor(_기본명식._시진._지지._오행.name)}`}>
                    {_기본명식._시진._지지._오행.name}
                  </div>
                </div>
              </td>
            </tr>

            {/* 지장간 */}
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">지장간</td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  {_기본명식._세차._지장간.map((gan, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {gan.name}
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  {_기본명식._월건._지장간.map((gan, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {gan.name}
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="space-y-1">
                  {_기본명식._일진._지장간.map((gan, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {gan.name}
                    </div>
                  ))}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="space-y-1">
                  {_기본명식._시진._지장간.map((gan, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      {gan.name}
                    </div>
                  ))}
                </div>
              </td>
            </tr>

            {/* 12운성 */}
            <tr className="border-b border-gray-100">
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">12운성</td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {_기본명식._세차._운성.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {_기본명식._월건._운성.name}
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {_기본명식._일진._운성.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-600">
                  {_기본명식._시진._운성.name}
                </div>
              </td>
            </tr>

            {/* 12신살 */}
            <tr>
              <td className="p-3 text-center text-sm font-medium text-gray-700 bg-gray-50">12신살</td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                  {chart._신살._세차.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                  {chart._신살._월건.name}
                </div>
              </td>
              <td className="p-3 text-center bg-yellow-50 border-2 border-yellow-200">
                <div className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                  {chart._신살._일진.name}
                </div>
              </td>
              <td className="p-3 text-center">
                <div className="text-xs px-2 py-1 rounded-full bg-rose-50 text-rose-600">
                  {chart._신살._시진.name}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 범례 */}
      <div className="mt-4 p-3 bg-gray-50 rounded-xl">
        <h5 className="text-sm font-semibold text-gray-700 mb-2">범례</h5>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium text-gray-600">오행:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="px-2 py-1 rounded-full bg-green-50 text-green-600">목</span>
              <span className="px-2 py-1 rounded-full bg-red-50 text-red-600">화</span>
              <span className="px-2 py-1 rounded-full bg-yellow-50 text-yellow-600">토</span>
              <span className="px-2 py-1 rounded-full bg-gray-50 text-gray-600">금</span>
              <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600">수</span>
            </div>
          </div>
          <div>
            <span className="font-medium text-gray-600">일주:</span>
            <span className="ml-1 text-yellow-700">본인을 나타내는 기준점</span>
          </div>
        </div>
      </div>
    </div>
  );
}