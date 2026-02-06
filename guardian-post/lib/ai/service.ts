import { AnalysisResult, AiJournalist } from "./types";
import OpenAI from "openai";

/**
 * AI Journalist Service Implementation
 * 
 * Supports both Mock mode (for development/demo) and Real mode (using OpenAI API).
 * Mode is determined by process.env.USE_MOCK_DATA or presence of OPENAI_API_KEY.
 */
export class HybridAiJournalist implements AiJournalist {
    private openai: OpenAI | null = null;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        const useMock = process.env.USE_MOCK_DATA === 'true';

        // Initialize OpenAI if API Key exists and Mock mode is not strictly enforced
        if (apiKey && !useMock) {
            this.openai = new OpenAI({
                apiKey: apiKey,
            });
        }
    }

    // In-memory cache to prevent redundant API calls
    private static cache = new Map<string, AnalysisResult>();

    async analyze(newsId: string, content: string): Promise<AnalysisResult> {
        // 0. Check Cache First
        if (HybridAiJournalist.cache.has(newsId)) {
            console.log(`[AI] Cache HIT for key: ${newsId}`);
            return HybridAiJournalist.cache.get(newsId)!;
        }

        // 1. Fallback to Mock if no OpenAI instance
        if (!this.openai) {
            console.log("[AI] Running in MOCK mode (No API Key or USE_MOCK_DATA=true)");
            const mockResult = await this.getMockResult();
            // Cache the mock result too
            HybridAiJournalist.cache.set(newsId, mockResult);
            return mockResult;
        }

        // 2. Real AI Analysis
        try {
            console.log(`[AI] Analyzing news ${newsId} using OpenAI...`);

            const completion = await this.openai.chat.completions.create({
                model: process.env.OPENAI_MODEL || "gpt-4-turbo-preview",
                messages: [
                    {
                        role: "system",
                        content: `
You are an expert journalist AI for 'Guardian Post', a defense & economy news platform.
Your task is to analyze raw news content and generate a deep analytical report in JSON format.
(Output must be in Korean language)

Output JSON Structure:
{
  "title": "A professional, catchy headline summarizing the analysis (Korean)",
  "summary": "A 2-3 sentence executive summary (Korean)",
  "content": "A comprehensive, deep-dive analytical article in Markdown format. Minimum 1000 characters. Must include:\\n- 'Background': History and context leading to this event.\\n- 'Core Analysis': Detailed breakdown of the news, specifying numbers and facts.\\n- 'Why It Matters': Strategic importance and industry impact.\\n- 'Future Outlook': Predictive analysis of what comes next.\\nUse H3 headers for sections. Do NOT use H1 or H2. Write in a professional, objective journalistic tone. (Korean)",
  "implications": ["Key implication 1", "Key implication 2", "Key implication 3"] (Korean),
  "suggestedVisuals": [
    { "type": "chart" | "image", "description": "Description of the visual", "prompt": "AI image generation prompt" }
  ],
  "reliability": 95 (Integer between 80-100 based on news quality)
}

Analyze the following news content:
`
                    },
                    {
                        role: "user",
                        content: content
                    }
                ],
                response_format: { type: "json_object" }
            });

            const resultString = completion.choices[0].message.content || "{}";
            const result = JSON.parse(resultString) as AnalysisResult;

            // Add timestamp
            result.analyzedAt = new Date().toISOString();

            // Store in Cache
            HybridAiJournalist.cache.set(newsId, result);

            return result;

        } catch (error) {
            console.error("[AI] API Error, falling back to Mock:", error);
            return this.getMockResult();
        }
    }

    private async getMockResult(): Promise<AnalysisResult> {
        // Simulate deep analysis delay (2-3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
            title: "익산시 국방 AI 센터 유치: K-Defense의 전략적 요충지 부상",
            summary: "익산시가 차세대 국방 AI 융합 센터를 유치하며 방위 산업의 핵심 거점으로 도약하고 있다. 이는 단순한 기관 유치를 넘어 지역 산업 구조의 첨단화와 국가 안보 기술 경쟁력 확보라는 이중적 의미를 갖는다.",
            content: `
### 배경 및 맥락 (Background)
익산시는 지난 5년간 '식품 수도'라는 브랜드를 넘어 '첨단 K-방산의 허브'로 거듭나기 위해 체질 개선을 시도해왔습니다. 특히 국가식품클러스터의 성공적인 안착 이후, 새로운 성장 동력으로 '국방 산업'과 'AI'의 융합을 선택했습니다. 이번 **국방 AI 융합 센터** 유치는 이러한 시정부의 장기적인 노력과 정부의 '지방 주도 균형 발전' 기조가 맞물린 쾌거입니다.

### 심층 분석 (Core Analysis)
이번 센터 유치는 단순히 건물이 하나 들어서는 것을 의미하지 않습니다. 
1.  **R&D 인프라의 집적화**: 국방과학연구소(ADD)의 분원 성격을 띤 이 센터는 연간 300억 원 규모의 R&D 예산을 집행하며, 50여 개의 방산 관련 스타트업을 인큐베이팅할 계획입니다.
2.  **AI 기술의 군사적 적용 실증**: 익산 인근의 육군부사관학교와 협력하여, 개발된 AI 감시 정찰 자산(드론, 로봇 등)을 즉각적으로 테스트베드에서 실증할 수 있는 'One-Stop' 체계를 구축합니다.
3.  **지역 경제 낙수 효과**: 센터 건립과 운영에 따른 직접 고용 효과는 약 500명으로 추산되나, 관련 기업 유치 및 배후 주거 단지 활성화를 통한 간접 효과는 2,000명 이상, 경제 유발 효과는 5,000억 원에 달할 것으로 분석됩니다.

### 전략적 중요성 (Why It Matters)
대한민국 방위 산업은 하드웨어(전차, 자주포) 중심에서 소프트웨어(AI, 무인화) 중심으로 패러다임이 전환되고 있습니다. 대전(R&D), 창원(생산)에 이어 익산이 '실증 및 AI 융합'이라는 새로운 축을 담당하게 됨으로써, K-방산의 **삼각 벨트(Triangle Belt)**가 완성되었습니다. 이는 유사시 특정 지역 타격에도 방산 생태계가 유지될 수 있는 안보적 분산 효과도 제공합니다.

### 향후 전망 (Future Outlook)
성공적인 안착을 위해서는 '보안'과 '인재'가 관건입니다. 국방 데이터의 특성상 최고 수준의 물리적/논리적 보안 인프라가 선행되어야 합니다. 또한, 전북권 대학들과 연계한 '국방 AI 계약학과' 신설 등을 통해, 센터가 필요로 하는 석박사급 고급 인력을 지속적으로 공급할 수 있는 파이프라인 구축이 향후 3년 내의 핵심 과제가 될 것입니다.
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

export const aiJournalist = new HybridAiJournalist();
