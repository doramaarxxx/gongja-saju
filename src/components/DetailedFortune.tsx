import React from 'react';
import { Heart, Activity, Star, DollarSign, Clock, User, Target, TrendingUp, Shield, Sparkles, Calendar } from 'lucide-react';
import { FortuneResult as FortuneResultType } from '../types/saju';
import { SajuInput } from '../types/saju';
import { ManseryeokChart as ManseryeokChartType } from '../types/manseryeok';
import { getManseryeokChart } from '../utils/manseryeokApi';
import ManseryeokChart from './ManseryeokChart';

interface DetailedFortuneProps {
  result: FortuneResultType;
  input: SajuInput;
  onBack: () => void;
}

export default function DetailedFortune({ result, input }: DetailedFortuneProps) {
  const [manseryeokChart, setManseryeokChart] = React.useState<ManseryeokChartType | null>(null);
  const [loadingChart, setLoadingChart] = React.useState(true);

  // 만세력 차트 로드
  React.useEffect(() => {
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

  const birthInfo = formatBirthInfo();

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-8">
        <h1 className="text-2xl font-bold mb-2">{input.name}님의 상세 사주 풀이</h1>
        <p className="opacity-90">더욱 자세한 사주 분석 결과입니다</p>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* User Input Information */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 text-purple-600 mr-2" />
            기본 정보
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

        {/* 평생사주 총평 - 확장된 버전 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 text-purple-600 mr-3" />
            평생사주 총평
          </h3>
          <div className="space-y-4">
            <div className="bg-purple-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">전체적인 운세</h4>
              <p className="text-gray-700 leading-relaxed text-base">{result.평생사주_총평}</p>
            </div>
            <div className="bg-pink-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center">
                <Target className="w-5 h-5 text-pink-600 mr-2" />
                인생의 목표와 방향
              </h4>
              <p className="text-gray-700 leading-relaxed text-base">
                당신의 사주를 통해 볼 때, 인생에서 추구해야 할 가장 중요한 가치는 균형과 조화입니다. 
                개인적인 성취와 타인과의 관계, 물질적 풍요와 정신적 만족 사이에서 균형을 찾는 것이 
                평생의 과제가 될 것입니다. 특히 중년 이후에는 자신만의 철학과 가치관을 확립하여 
                후배들에게 지혜를 전수하는 역할을 하게 될 것입니다.
              </p>
            </div>
            <div className="bg-rose-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center">
                <TrendingUp className="w-5 h-5 text-rose-600 mr-2" />
                성격과 기질 분석
              </h4>
              <p className="text-gray-700 leading-relaxed text-base">
                타고난 성격은 온화하면서도 의지가 강한 편입니다. 겉으로는 부드러워 보이지만 
                내면에는 확고한 신념을 가지고 있어, 한번 결정한 일은 끝까지 해내는 끈기를 보입니다. 
                감정적으로는 안정적이며, 주변 사람들에게 신뢰감을 주는 타입입니다. 
                다만 때로는 너무 신중해서 기회를 놓칠 수 있으니 적절한 모험정신도 필요합니다.
              </p>
            </div>
          </div>
        </div>

        {/* 재물운 - 확장된 버전 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <DollarSign className="w-6 h-6 text-green-600 mr-3" />
            재물운 상세 분석
          </h3>
          <div className="space-y-6">
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">전체적인 재물운</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.재물운.재물운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">재물운의 특징</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 꾸준한 노력을 통한 안정적인 재물 축적</li>
                  <li>• 중년 이후 재물운이 크게 상승</li>
                  <li>• 부동산 투자에 특히 유리한 운세</li>
                  <li>• 타인과의 협력을 통한 수익 창출 가능</li>
                </ul>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">재물 모으는 법</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.재물운.재물_모으는_법}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">구체적인 실행 방법</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 매월 일정 금액을 자동 적금으로 설정</li>
                  <li>• 안정적인 배당주 위주의 장기 투자</li>
                  <li>• 부업이나 사이드 프로젝트 고려</li>
                  <li>• 전문성을 높여 수입원 다각화</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">재물 손실 방지법</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.재물운.재물_손실_막는법}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">주의해야 할 시기와 상황</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 감정적인 상태에서의 투자 결정 금지</li>
                  <li>• 지나친 욕심으로 인한 고위험 투자 주의</li>
                  <li>• 타인의 보증이나 대출 요청 신중히 검토</li>
                  <li>• 정기적인 가계부 작성으로 지출 관리</li>
                </ul>
              </div>
            </div>

            <div className="bg-lime-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">재테크 비법</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.재물운.재테크_비법}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">추천 투자 포트폴리오</h5>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-900">안전 자산 (40%)</span>
                    <p className="text-blue-700 text-xs mt-1">예금, 적금, 국채</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="font-medium text-green-900">성장 자산 (35%)</span>
                    <p className="text-green-700 text-xs mt-1">우량주, 인덱스 펀드</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <span className="font-medium text-purple-900">부동산 (20%)</span>
                    <p className="text-purple-700 text-xs mt-1">실거주용, 임대용</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <span className="font-medium text-orange-900">기타 (5%)</span>
                    <p className="text-orange-700 text-xs mt-1">금, 원자재 등</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">커리어 발전 방향</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.재물운.커리어}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">단계별 커리어 로드맵</h5>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-600 text-xs font-bold">1</span>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 text-sm">초기 (20-30대)</h6>
                      <p className="text-gray-600 text-xs">전문성 축적 및 네트워크 구축</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-600 text-xs font-bold">2</span>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 text-sm">성장기 (30-40대)</h6>
                      <p className="text-gray-600 text-xs">리더십 발휘 및 사업 확장</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-teal-600 text-xs font-bold">3</span>
                    </div>
                    <div>
                      <h6 className="font-medium text-gray-900 text-sm">완성기 (40대 이후)</h6>
                      <p className="text-gray-600 text-xs">전문가로서의 지위 확립</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 시기별 운세 - 확장된 버전 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            시기별 운세 상세 분석
          </h3>
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">초년운 (출생~30세)</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.초년운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">이 시기의 특징과 조언</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 학습과 경험 축적에 집중하는 시기</li>
                  <li>• 다양한 사람들과의 만남을 통한 견문 확대</li>
                  <li>• 기초를 탄탄히 다지는 것이 중요</li>
                  <li>• 성급한 성과보다는 장기적 관점 필요</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">중년운 (30~60세)</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.중년운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">이 시기의 특징과 조언</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 사회적 성취와 경제적 안정을 이루는 시기</li>
                  <li>• 리더십을 발휘하여 조직을 이끄는 역할</li>
                  <li>• 가정과 일의 균형을 맞추는 것이 중요</li>
                  <li>• 건강 관리에 특별히 신경써야 하는 시기</li>
                </ul>
              </div>
            </div>

            <div className="bg-indigo-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">말년운 (60세 이후)</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.말년운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">이 시기의 특징과 조언</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 축적된 경험과 지혜를 나누는 시기</li>
                  <li>• 자녀들과의 관계에서 큰 만족을 얻음</li>
                  <li>• 여유로운 생활과 취미 활동 즐김</li>
                  <li>• 사회적 기여와 봉사활동에 관심</li>
                </ul>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">올해 기대할 점</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.올해_기대할_점}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">구체적인 기회들</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 새로운 프로젝트나 사업 기회</li>
                  <li>• 인맥 확장을 통한 협력 기회</li>
                  <li>• 투자나 재테크에서의 수익 기회</li>
                  <li>• 개인적 성장과 발전의 기회</li>
                </ul>
              </div>
            </div>

            <div className="bg-red-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">올해 주의할 점</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.올해_주의할_점}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">피해야 할 상황들</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 성급한 판단으로 인한 실수</li>
                  <li>• 과도한 스트레스로 인한 건강 악화</li>
                  <li>• 인간관계에서의 갈등 상황</li>
                  <li>• 무리한 투자나 사업 확장</li>
                </ul>
              </div>
            </div>

            <div className="bg-violet-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">올해 추천 행동</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.시기별.올해_추천_행동}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">월별 실행 계획</h5>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-violet-50 rounded">
                    <span className="font-medium">1-3월</span>
                    <span className="text-violet-700">목표 설정 및 계획 수립</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-violet-50 rounded">
                    <span className="font-medium">4-6월</span>
                    <span className="text-violet-700">새로운 학습 및 스킬 개발</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-violet-50 rounded">
                    <span className="font-medium">7-9월</span>
                    <span className="text-violet-700">네트워킹 및 관계 강화</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-violet-50 rounded">
                    <span className="font-medium">10-12월</span>
                    <span className="text-violet-700">성과 정리 및 내년 준비</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 건강운 - 확장된 버전 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="w-6 h-6 text-red-600 mr-3" />
            건강운 상세 분석
          </h3>
          <div className="space-y-6">
            <div className="bg-red-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">전체적인 건강운</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.건강운.건강운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">건강 관리 포인트</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 규칙적인 생활 패턴 유지</li>
                  <li>• 적절한 운동과 충분한 휴식</li>
                  <li>• 스트레스 관리 및 정신 건강 케어</li>
                  <li>• 정기적인 건강 검진 필수</li>
                </ul>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">체질과 특성</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.건강운.체질운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">체질별 건강 관리법</h5>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h6 className="font-medium text-blue-900 mb-1">식단 관리</h6>
                    <p className="text-blue-700 text-sm">차가운 성질의 음식을 선호하되, 균형잡힌 영양 섭취 중요</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h6 className="font-medium text-green-900 mb-1">운동 방법</h6>
                    <p className="text-green-700 text-sm">격렬한 운동보다는 꾸준한 유산소 운동 추천</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h6 className="font-medium text-purple-900 mb-1">생활 환경</h6>
                    <p className="text-purple-700 text-sm">시원하고 통풍이 잘 되는 환경에서 생활</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-pink-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center">
                <Shield className="w-5 h-5 text-pink-600 mr-2" />
                주의해야 할 건강 이슈
              </h4>
              <div className="bg-white rounded-lg p-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
                    <h6 className="font-medium text-yellow-900 mb-1">소화기계</h6>
                    <p className="text-yellow-700 text-sm">과식이나 불규칙한 식사 피하고, 소화에 좋은 음식 섭취</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-400">
                    <h6 className="font-medium text-red-900 mb-1">순환기계</h6>
                    <p className="text-red-700 text-sm">혈압 관리 및 심혈관 건강에 특별한 주의 필요</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                    <h6 className="font-medium text-blue-900 mb-1">정신 건강</h6>
                    <p className="text-blue-700 text-sm">스트레스 해소를 위한 취미 활동이나 명상 추천</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 애정운 - 확장된 버전 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Heart className="w-6 h-6 text-pink-600 mr-3" />
            애정운 상세 분석
          </h3>
          <div className="space-y-6">
            <div className="bg-pink-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">전체적인 애정운</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.애정운.애정운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">애정 관계의 특징</h5>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 진실하고 깊이 있는 사랑을 추구</li>
                  <li>• 상대방에 대한 배려와 이해심이 뛰어남</li>
                  <li>• 안정적이고 지속적인 관계를 선호</li>
                  <li>• 감정 표현이 서툴 수 있으나 진심은 깊음</li>
                </ul>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">이성운과 매력</h4>
              <p className="text-gray-700 leading-relaxed text-base mb-4">{result.애정운.이성운}</p>
              <div className="bg-white rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">이성에게 어필하는 포인트</h5>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-rose-50 rounded-lg">
                    <h6 className="font-medium text-rose-900 text-sm mb-1">내적 매력</h6>
                    <p className="text-rose-700 text-xs">따뜻한 마음과 깊은 사고</p>
                  </div>
                  <div className="p-3 bg-pink-50 rounded-lg">
                    <h6 className="font-medium text-pink-900 text-sm mb-1">외적 매력</h6>
                    <p className="text-pink-700 text-xs">단정하고 품격 있는 모습</p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h6 className="font-medium text-red-900 text-sm mb-1">성격적 매력</h6>
                    <p className="text-red-700 text-xs">신뢰감과 안정감</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h6 className="font-medium text-purple-900 text-sm mb-1">사회적 매력</h6>
                    <p className="text-purple-700 text-xs">리더십과 책임감</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-violet-50 rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg flex items-center">
                <Sparkles className="w-5 h-5 text-violet-600 mr-2" />
                연애 및 결혼 조언
              </h4>
              <div className="bg-white rounded-lg p-4">
                <div className="space-y-4">
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">이상적인 파트너 유형</h6>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      지적이면서도 감성적인 균형을 갖춘 사람, 서로의 꿈을 응원하고 함께 성장할 수 있는 파트너가 이상적입니다. 
                      너무 급하거나 변덕스러운 성격보다는 안정적이고 신뢰할 수 있는 사람이 좋습니다.
                    </p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">연애할 때 주의점</h6>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      감정 표현을 더 적극적으로 하려고 노력하세요. 상대방이 당신의 마음을 알 수 있도록 
                      말과 행동으로 표현하는 것이 중요합니다. 또한 너무 완벽을 추구하지 말고 
                      서로의 단점도 받아들이는 마음가짐이 필요합니다.
                    </p>
                  </div>
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">결혼 운세</h6>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      결혼 후에는 매우 안정적이고 행복한 가정을 꾸릴 것입니다. 배우자와의 관계에서 
                      서로를 존중하고 이해하는 모범적인 부부가 될 가능성이 높습니다. 
                      자녀 교육에도 뛰어난 능력을 발휘할 것입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 종합 조언 */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <Star className="w-6 h-6 text-purple-600 mr-3" />
            종합 조언 및 결론
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">인생의 핵심 키워드</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">균형</span>
                <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm font-medium">안정</span>
                <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">성장</span>
                <span className="px-3 py-1 bg-violet-100 text-violet-800 rounded-full text-sm font-medium">지혜</span>
                <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-800 rounded-full text-sm font-medium">조화</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">
                당신의 사주는 전체적으로 매우 균형잡힌 운세를 보여줍니다. 급격한 변화보다는 
                꾸준한 노력을 통해 안정적인 성취를 이루는 타입입니다. 인생의 각 단계마다 
                적절한 목표를 설정하고 차근차근 실행해 나간다면 분명히 원하는 바를 이룰 수 있을 것입니다.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6">
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">마지막 당부의 말</h4>
              <p className="text-gray-700 leading-relaxed text-base">
                사주는 하나의 가이드라인일 뿐, 결국 인생은 당신의 선택과 노력에 의해 만들어집니다. 
                긍정적인 마음가짐을 유지하고, 주변 사람들과의 관계를 소중히 여기며, 
                끊임없이 자기계발에 힘쓴다면 어떤 어려움도 극복할 수 있을 것입니다. 
                당신의 앞날에 행운이 가득하기를 기원합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}