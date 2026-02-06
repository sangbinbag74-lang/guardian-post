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
  "content": "Full analytical article in Markdown format. Use H2, H3, bullet points. Focus on strategic implications. (Korean)",
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

export const aiJournalist = new HybridAiJournalist();
