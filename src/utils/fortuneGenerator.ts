import { SajuInput, FortuneResult } from '../types/saju';

export async function generateFortune(input: SajuInput): Promise<FortuneResult> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-saju`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: input.name,
        gender: input.gender,
        birthYear: input.birthYear,
        birthMonth: input.birthMonth,
        birthDay: input.birthDay,
        birthTime: input.birthTime,
        lunarCalendar: input.lunarCalendar
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate fortune');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    
    // 폴백: 기본 사주 결과 반환
    return getFallbackFortune(input);
  }
}

function getFallbackFortune(input: SajuInput): FortuneResult {
  // 생년월일과 성별을 기반으로 한 간단한 해시 함수
  const hash = (input.birthYear + input.birthMonth + input.birthDay + (input.gender === '남자' ? 1 : 0)) % 5;
  
  const overallFortuneTexts = [
    "당신은 타고난 리더십과 강한 의지력을 바탕으로 인생에서 큰 성취를 이룰 수 있는 사주를 가지고 있습니다. 도전정신이 강하고 목표 달성을 위한 추진력이 뛰어나며, 주변 사람들에게 긍정적인 영향을 미치는 카리스마를 지니고 있습니다.",
    "섬세하고 감성적인 성향으로 예술적 재능이 뛰어나며, 타인의 마음을 잘 이해하는 따뜻한 인품을 가진 사주입니다. 창의적인 분야에서 두각을 나타낼 가능성이 높으며, 인간관계에서 조화를 이루는 능력이 탁월합니다.",
    "현실적이고 실용적인 성격으로 체계적인 계획 하에 꾸준히 노력하여 안정적인 성과를 거두는 사주입니다. 신중한 판단력과 끈기 있는 성격으로 어떤 일이든 완성도 높게 마무리하는 능력을 지니고 있습니다.",
    "자유로운 영혼의 소유자로 새로운 경험과 도전을 즐기며 창의적인 아이디어가 풍부한 사주입니다. 변화를 두려워하지 않고 적응력이 뛰어나며, 다양한 분야에서 재능을 발휘할 수 있는 가능성을 지니고 있습니다.",
    "깊이 있는 사고력과 통찰력을 바탕으로 현명한 판단을 내리는 지혜로운 사주입니다. 학문이나 연구 분야에서 뛰어난 성과를 거둘 수 있으며, 주변 사람들에게 신뢰받는 조언자 역할을 하게 될 것입니다."
  ];

  const wealthTexts = [
    "강한 추진력과 리더십으로 사업에서 큰 성공을 거둘 수 있는 재물운을 가지고 있습니다.",
    "창의적인 재능을 활용하여 안정적인 수입을 얻을 수 있는 재물운입니다.",
    "꾸준하고 계획적인 재정 관리로 안정적인 부를 축적할 수 있는 재물운입니다.",
    "다양한 분야에서 수입원을 만들어 풍부한 재물운을 누릴 것입니다.",
    "지혜로운 투자와 신중한 판단으로 안전하게 부를 축적할 수 있는 재물운입니다."
  ];

  return {
    평생사주_총평: overallFortuneTexts[hash],
    재물운: {
      재물운: wealthTexts[hash],
      재물_모으는_법: "적극적인 투자와 사업 확장을 통해 재물을 모으세요. 리더십을 발휘하여 팀을 이끌고 큰 프로젝트에 도전하면 상당한 수익을 얻을 수 있습니다.",
      재물_손실_막는법: "과도한 투자나 투기는 피하고 안전한 자산 관리를 하세요. 감정적인 판단보다는 냉정한 분석을 바탕으로 투자 결정을 내리시기 바랍니다.",
      재테크_비법: "성장주나 우량 기업에 장기 투자하세요. 시장을 선도하는 기업들의 주식에 투자하면 높은 수익을 기대할 수 있습니다.",
      커리어: "리더십이 요구되는 관리직이나 경영진 역할에서 큰 성과를 거둘 것입니다. 사업가나 기업 임원으로서 성공할 가능성이 높습니다."
    },
    시기별: {
      초년운: "어린 시절부터 총명하고 활발한 성격으로 주변의 관심과 사랑을 받으며 성장할 것입니다.",
      중년운: "중년기에는 사회적으로 인정받는 위치에 오르며 경제적 안정을 이룰 것입니다.",
      말년운: "말년에는 자녀들의 효도를 받으며 편안하고 여유로운 생활을 할 것입니다.",
      올해_기대할_점: "새로운 기회와 도전이 찾아올 것입니다. 특히 사업이나 투자 분야에서 좋은 성과를 기대할 수 있습니다.",
      올해_주의할_점: "성급한 판단이나 과도한 욕심은 금물입니다. 신중하게 계획을 세우고 단계적으로 접근하는 것이 중요합니다.",
      올해_추천_행동: "새로운 학습이나 자기계발에 투자하세요. 전문성을 높이고 네트워킹을 강화하여 미래를 준비하는 것이 좋습니다."
    },
    건강운: {
      건강운: "전반적으로 건강한 체질을 가지고 있으나, 스트레스 관리에 주의해야 합니다.",
      체질운: "열이 많은 체질로 차가운 음식을 선호하며, 여름철에 특히 주의가 필요합니다."
    },
    애정운: {
      애정운: "열정적이고 진실한 사랑을 하는 타입입니다. 평생 함께할 운명적인 만남이 기다리고 있습니다.",
      이성운: "이성에게 매력적으로 보이는 카리스마와 리더십을 가지고 있습니다."
    }
  };
}