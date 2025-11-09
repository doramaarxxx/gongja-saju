// @ts-ignore: Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Deno runtime type declaration
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { name, gender, birthYear, birthMonth, birthDay, birthTime, lunarCalendar } = await req.json()

    // OpenAI API 호출
    const apiKey = Deno.env.get('OPENAI_API_KEY')
    console.log('API Key exists:', !!apiKey)
    console.log('API Key length:', apiKey?.length || 0)
    
    const openaiResponse = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({})
    })

    console.log('OpenAI Response Status:', openaiResponse.status)
    
    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text()
      console.error('OpenAI Error:', errorText)
      throw new Error(`Failed to create thread: ${openaiResponse.status} - ${errorText}`)
    }

    const thread = await openaiResponse.json()

    // 시간 변환 (예: "자시(23-01시)" -> "자시")
    const hourEarthlyBranch = birthTime.includes('(') ? birthTime.split('(')[0] : birthTime

    // JSON 형식으로 메시지 생성
    const messageContent = JSON.stringify({
      name: name,
      gender: gender === '남자' ? '남' : '여',
      calendar: lunarCalendar ? '음력' : '양력',
      year: birthYear,
      month: birthMonth,
      day: birthDay,
      hour_earthly_branch: hourEarthlyBranch
    })

    const messageResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        role: 'user',
        content: messageContent
      })
    })

    if (!messageResponse.ok) {
      throw new Error('Failed to add message')
    }

    // Assistant 실행
    const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'assistants=v2'
      },
      body: JSON.stringify({
        assistant_id: 'asst_YGbIebwqeW8nhU2DvUlLeGUd'
      })
    })

    if (!runResponse.ok) {
      throw new Error('Failed to run assistant')
    }

    const run = await runResponse.json()

    // 실행 완료 대기
    let runStatus = run.status
    let attempts = 0
    const maxAttempts = 30 // 최대 30초 대기

    while (runStatus !== 'completed' && runStatus !== 'failed' && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1초 대기
      
      const statusResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`, {
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      })

      if (statusResponse.ok) {
        const statusData = await statusResponse.json()
        runStatus = statusData.status
      }
      
      attempts++
    }

    if (runStatus !== 'completed') {
      throw new Error('Assistant run did not complete successfully')
    }

    // 메시지 가져오기
    const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/messages`, {
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    })

    if (!messagesResponse.ok) {
      throw new Error('Failed to get messages')
    }

    const messages = await messagesResponse.json()
    const assistantMessage = messages.data.find((msg: any) => msg.role === 'assistant')
    
    if (!assistantMessage || !assistantMessage.content[0]?.text?.value) {
      throw new Error('No assistant response found')
    }

    const responseText = assistantMessage.content[0].text.value

    // 응답 파싱
    const fortuneResult = parseSajuResponse(responseText)

    return new Response(
      JSON.stringify(fortuneResult),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})

function parseSajuResponse(text: string) {
  try {
    // JSON 형식으로 응답이 올 것으로 예상하고 파싱 시도
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // JSON 파싱 실패 시 폴백
    throw new Error('No valid JSON found in response')
  } catch (error) {
    console.error('Error parsing response:', error)
    
    // 폴백: 기본 사주 결과 반환
    return {
      "평생사주_총평": "당신은 타고난 리더십과 강한 의지력을 바탕으로 인생에서 큰 성취를 이룰 수 있는 사주를 가지고 있습니다. 도전정신이 강하고 목표 달성을 위한 추진력이 뛰어나며, 주변 사람들에게 긍정적인 영향을 미치는 카리스마를 지니고 있습니다.",
      "재물운": {
        "재물운": "강한 추진력과 리더십으로 사업에서 큰 성공을 거둘 수 있는 재물운을 가지고 있습니다. 투자나 창업을 통해 상당한 부를 축적할 가능성이 높습니다.",
        "재물_모으는_법": "적극적인 투자와 사업 확장을 통해 재물을 모으세요. 리더십을 발휘하여 팀을 이끌고 큰 프로젝트에 도전하면 상당한 수익을 얻을 수 있습니다.",
        "재물_손실_막는법": "과도한 투자나 투기는 피하고 안전한 자산 관리를 하세요. 감정적인 판단보다는 냉정한 분석을 바탕으로 투자 결정을 내리시기 바랍니다.",
        "재테크_비법": "성장주나 우량 기업에 장기 투자하세요. 시장을 선도하는 기업들의 주식에 투자하면 높은 수익을 기대할 수 있습니다.",
        "커리어": "리더십이 요구되는 관리직이나 경영진 역할에서 큰 성과를 거둘 것입니다. 사업가나 기업 임원으로서 성공할 가능성이 높습니다."
      },
      "시기별": {
        "초년운": "어린 시절부터 총명하고 활발한 성격으로 주변의 관심과 사랑을 받으며 성장할 것입니다. 학업 성취도가 높고 리더십을 발휘하여 또래들 사이에서 인기가 많을 것입니다.",
        "중년운": "중년기에는 사회적으로 인정받는 위치에 오르며 경제적 안정을 이룰 것입니다. 리더십을 발휘하여 많은 사람들을 이끌고, 사업이나 직장에서 큰 성과를 거둘 것입니다.",
        "말년운": "말년에는 자녀들의 효도를 받으며 편안하고 여유로운 생활을 할 것입니다. 축적된 재산과 사회적 명성으로 존경받는 어르신이 될 것입니다.",
        "올해_기대할_점": "새로운 기회와 도전이 찾아올 것입니다. 특히 사업이나 투자 분야에서 좋은 성과를 기대할 수 있으며, 인맥 확장의 기회도 많을 것입니다.",
        "올해_주의할_점": "성급한 판단이나 과도한 욕심은 금물입니다. 신중하게 계획을 세우고 단계적으로 접근하는 것이 중요합니다.",
        "올해_추천_행동": "새로운 학습이나 자기계발에 투자하세요. 전문성을 높이고 네트워킹을 강화하여 미래를 준비하는 것이 좋습니다."
      },
      "건강운": {
        "건강운": "전반적으로 건강한 체질을 가지고 있으나, 스트레스 관리에 주의해야 합니다. 규칙적인 운동과 충분한 휴식으로 건강을 유지하세요.",
        "체질운": "열이 많은 체질로 차가운 음식을 선호하며, 여름철에 특히 주의가 필요합니다. 시원한 환경에서 생활하고 수분 섭취를 충분히 하세요."
      },
      "애정운": {
        "애정운": "열정적이고 진실한 사랑을 하는 타입입니다. 사랑하는 사람을 위해 모든 것을 바칠 수 있는 깊은 애정을 가지고 있으며, 평생 함께할 운명적인 만남이 기다리고 있습니다.",
        "이성운": "이성에게 매력적으로 보이는 카리스마와 리더십을 가지고 있습니다. 자신감 있는 모습과 든든한 느낌으로 많은 이성의 관심을 받을 것입니다."
      }
    }
  }
}