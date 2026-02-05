import { AnalysisResult, AiJournalist } from "./types";

export class MockAiJournalist implements AiJournalist {
    async analyze(newsId: string, content: string): Promise<AnalysisResult> {
        // Simulate deep analysis delay (2-3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2500));

        return {
            title: "익산시 국방 AI 센터 유치: K-Defense의 전략적 요충지 부상",
            summary: "익산시가 차세대 국방 AI 융합 센터를 유치하며 방위 산업의 핵심 거점으로 도약하고 있다. 이는 단순한 기관 유치를 넘어 지역 산업 구조의 첨단화와 국가 안보 기술 경쟁력 확보라는 이중적 의미를 갖는다.",
            content: `
## 심층 분석: 왜 익산인가?

익산시의 이번 **국방 AI 융합 센터** 유치는 우연이 아니다. 지리적 요충지로서의 특성과 기존 식품/화학 산업 기반에 첨단 기술을 접목하려는 시정부의 전략이 맞아떨어진 결과다.

### 1. 전략적 타당성
*   **교통 및 물류**: KTX 익산역을 중심으로 한 교통 편의성은 전국 어디서든 접근 가능한 R&D 허브로서 최적의 조건을 갖추고 있다.
*   **인재 공급**: 인근 대학과의 협력을 통한 AI 전문 인력 공급 파이프라인이 구축되어 있다.

### 2. 기대 효과
국방 AI 센터는 단순히 연구원들이 상주하는 공간이 아니다. 관련 **스타트업 생태계**가 조성되고, 테스트베드 역할을 할 실증 단지가 구축될 예정이다. 이는 향후 5년 내 약 2,000명의 고급 일자리 창출 효과를 가져올 것으로 분석된다.

## 향후 과제

성공적인 안착을 위해서는 '데이터 보안 인프라' 구축이 필수적이다. 국방 데이터의 특성상 최고 수준의 물리적/논리적 보안 체계가 선행되어야 하며, 이를 위한 지자체 차원의 과감한 투자가 요구된다.
      `.trim(),
            implications: [
                "지자체 주도의 방위 산업 생태계 조성 가능성 입증",
                "기존 제조업 중심의 익산 산업 구조가 첨단 지식 기반으로 개편되는 신호탄",
                "보안 인프라 구축을 위한 예산 확보가 단기적 핵심 과제"
            ],
            suggestedVisuals: [
                {
                    type: "chart",
                    description: "익산시 방위 산업 관련 투자 및 예산 증가 추이",
                    prompt: "Line chart showing increasing trend of defense industry investment in Iksan city from 2023 to 2026, professional style, blue and grey colors"
                },
                {
                    type: "image",
                    description: "미래형 AI 관제 센터 조감도",
                    prompt: "Futuristic command center interior, large screens displaying AI analytics, sleek design, dark blue lighting, professional atmosphere, photorealistic, 8k"
                }
            ],
            reliability: 98,
            analyzedAt: new Date().toISOString()
        };
    }
}

export const aiJournalist = new MockAiJournalist();
