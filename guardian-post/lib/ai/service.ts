import { AnalysisResult, AiJournalist } from "./types";
import OpenAI from "openai";
import fs from "fs";
import path from "path";

/**
 * AI Journalist Service Implementation
 * 
 * Supports both Mock mode (for development/demo) and Real mode (using OpenAI API).
 * Mode is determined by process.env.USE_MOCK_DATA or presence of OPENAI_API_KEY.
 * 
 * Features:
 * - Persistent File-based Cache (data/ai-cache.json)
 * - Auto-Translation support (via cache override in news service)
 * - 4s Timeout Dead Switch to prevent hanging
 */
export class HybridAiJournalist implements AiJournalist {
    private openai: OpenAI | null = null;

    // Persistent Cache Path
    private cachePath = path.join(process.cwd(), 'data', 'ai-cache.json');

    // In-memory mirror for speed
    private static cache = new Map<string, AnalysisResult>();
    private static isCacheLoaded = false;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        const useMock = process.env.USE_MOCK_DATA === 'true';

        // Initialize OpenAI if API Key exists and Mock mode is not strictly enforced
        if (apiKey && !useMock) {
            this.openai = new OpenAI({
                apiKey: apiKey,
            });
        }

        // Load cache from disk immediately
        this.loadCacheFromDisk();
    }

    private loadCacheFromDisk() {
        if (HybridAiJournalist.isCacheLoaded) return;

        try {
            // Ensure data directory exists
            const dir = path.dirname(this.cachePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (fs.existsSync(this.cachePath)) {
                const data = fs.readFileSync(this.cachePath, 'utf-8');
                const json = JSON.parse(data);
                Object.entries(json).forEach(([key, val]) => {
                    HybridAiJournalist.cache.set(key, val as AnalysisResult);
                });
                console.log(`[AI] Loaded ${HybridAiJournalist.cache.size} items from persistent cache.`);
            }
            HybridAiJournalist.isCacheLoaded = true;
        } catch (error) {
            console.error("[AI] Failed to load cache from disk:", error);
        }
    }

    private saveCacheToDisk() {
        try {
            const obj = Object.fromEntries(HybridAiJournalist.cache);
            fs.writeFileSync(this.cachePath, JSON.stringify(obj, null, 2), 'utf-8');
        } catch (error) {
            console.error("[AI] Failed to save cache to disk:", error);
        }
    }

    // Public accessor for cache to allow updating list properties (e.g. Translate Titles)
    public getCachedResult(newsId: string): AnalysisResult | undefined {
        return HybridAiJournalist.cache.get(newsId);
    }

    async analyze(newsId: string, content: string): Promise<AnalysisResult> {
        // 0. Check Cache First (In-Memory Access -> Very Fast)
        if (HybridAiJournalist.cache.has(newsId)) {
            // console.log(`[AI] Persistent Cache HIT for key: ${newsId}`);
            return HybridAiJournalist.cache.get(newsId)!;
        }

        // 1. Fallback to Mock if no OpenAI instance
        if (!this.openai) {
            console.log("[AI] Running in MOCK mode (No API Key or USE_MOCK_DATA=true)");
            const mockResult = await this.getMockResult(content);

            // Cache and Persist
            HybridAiJournalist.cache.set(newsId, mockResult);
            this.saveCacheToDisk();

            return mockResult;
        }

        // 2. Real AI Analysis
        try {
            console.log(`[AI] Analyzing news ${newsId} using OpenAI...`);

            // Define the AI task
            const aiTask = async () => {
                const completion = await this.openai!.chat.completions.create({
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
                return JSON.parse(resultString) as AnalysisResult;
            };

            // Implement Timeout Race (4000ms limit)
            const timeoutPromise = new Promise<AnalysisResult>((resolve) => {
                setTimeout(async () => {
                    console.warn(`[AI] Analysis timed out for ${newsId}. Returning fallback.`);
                    resolve(await this.getMockResult(content));
                }, 4000);
            });

            const result = await Promise.race([aiTask(), timeoutPromise]);

            // Add timestamp
            if (!result.analyzedAt) result.analyzedAt = new Date().toISOString();

            // Store in Cache and Persist
            HybridAiJournalist.cache.set(newsId, result);
            this.saveCacheToDisk();

            return result;

        } catch (error) {
            console.error("[AI] API Error, falling back to Mock:", error);
            const mock = await this.getMockResult(content);

            // Cache and Persist Mock
            HybridAiJournalist.cache.set(newsId, mock);
            this.saveCacheToDisk();

            return mock;
        }
    }

    private async getMockResult(context: string = ""): Promise<AnalysisResult> {
        // Simulate deep analysis delay (reduced to 1s for better UX in fallback)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Attempt to extract title/summary from context (format: "Title\nSummary")
        let title = "분석된 국방/경제 뉴스";
        let summary = "AI가 해당 뉴스의 핵심 내용을 분석하고 있습니다. 원문의 주요 논점을 바탕으로 상세 리포트를 생성했습니다.";

        if (context) {
            const lines = context.split('\n');
            if (lines.length > 0) title = lines[0].substring(0, 50) + "..."; // Truncate if too long
            if (lines.length > 1) summary = lines.slice(1).join(' ').substring(0, 100) + "...";
        }

        // If we can't truly translate in mock mode without an engine, we should at least 
        // indicate it's an analyzed version of the original.
        // Ideally, in a real mock, we might have a preset list, but here we dynamic-fill.

        return {
            title: `[AI 분석] ${title}`,
            summary: `[핵심 요약] ${summary}`,
            content: `
### 배경 및 맥락 (Background)

이 사안은 최근 급변하는 국방 및 경제 환경에서 중요한 의미를 갖습니다. **"${title}"**에 대한 심층적인 논의는 관련 업계뿐만 아니라 정책 결정자들에게도 시사하는 바가 큽니다. \n\n특히, 해당 이슈가 발생하게 된 근본적인 원인과 그 파급 효과를 분석하는 것은 향후 전략 수립에 필수적입니다.

### 심층 분석 (Core Analysis)

제공된 뉴스 데이터를 바탕으로 분석한 핵심 포인트는 다음과 같습니다.

1.  **주요 팩트 및 현황**
    본 기사는 **"${title}"**를 중심으로 전개되고 있으며, 이는 현재 시장/안보 상황에서 주목해야 할 변곡점입니다. 구체적인 수치나 데이터는 원문을 통해 교차 검증이 필요하나, 전반적인 흐름은 긍정적/부정적 요인이 복합적으로 작용하고 있습니다.

2.  **기술적/경제적 영향**
    이러한 변화는 단기적으로는 시장의 변동성을 키울 수 있으나, 장기적으로는 산업 구조의 재편을 가속화할 전망입니다. 관련 이해관계자들은 이에 대한 선제적인 대응책을 마련해야 합니다.

3.  **리스크 요인**
    예상치 못한 규제 변화나 대외 환경의 불확실성은 여전히 존재합니다. 따라서 시나리오별 대응 전략(Contingency Plan)을 수립하는 것이 권장됩니다.

### 전략적 중요성 (Why It Matters)

이 뉴스는 단순히 하나의 사건에 그치지 않고, 거시적인 관점에서 **"${title}"**가 갖는 상징성을 보여줍니다. \n\n업계 표준이 변화하거나 새로운 안보 위협이 대두되는 시점에서, 이를 기회로 활용할 수 있는 전략적 유연성이 요구됩니다.

### 향후 전망 (Future Outlook)

향후 3~6개월 내에 가시적인 성과나 후속 조치가 이어질 것으로 예상됩니다. 특히 관련 법안의 통과 여부나 추가적인 투자가 이뤄질 경우, 그 파급력은 배가될 것입니다. 지속적인 모니터링이 필요합니다.
            `.trim(),
            implications: [
                "시장/안보 환경의 급격한 변화에 대한 대응 필요",
                "관련 기술 및 정책의 고도화가 핵심 경쟁력으로 부상",
                "장기적인 관점에서의 투자 및 리스크 관리 중요"
            ],
            suggestedVisuals: [
                {
                    type: "chart",
                    description: "관련 시장 성장 추이 그래프",
                    prompt: "Line chart showing upward trend, professional business style, blue colors"
                },
                {
                    type: "image",
                    description: "관련 기술 개념도",
                    prompt: "High-tech concept art, futuristic, professional style, isometric view"
                }
            ],
            reliability: 88,
            analyzedAt: new Date().toISOString()
        };
    }
}

export const aiJournalist = new HybridAiJournalist();
