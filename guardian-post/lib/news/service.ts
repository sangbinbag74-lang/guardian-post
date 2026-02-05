import { NewsItem, NewsStats } from "./types";

const MOCK_NEWS: NewsItem[] = [
    {
        id: "1",
        title: "익산시, 국방 AI 융합 센터 유치 확정... 'K-Defense'의 심장으로 도약",
        summary: "익산시가 차세대 국방 AI 융합 센터 유치에 성공하며 방위 산업의 핵심 거점으로 떠오르고 있다. 이번 유치를 통해 지역 경제 활성화는 물론, 첨단 기술 인재 양성에도 가속도가 붙을 전망이다.",
        originalUrl: "https://example.com/news/1",
        source: "Guardian AI",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        collectedAt: new Date().toISOString(),
        status: "published",
        reliability: 98,
        keywords: ["국방 AI", "익산시", "K-Defense"],
        category: "defense",
        thumbnailUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "2",
        title: "육군부사관학교, '미래형 전투원' 양성을 위한 AI 교육 시스템 도입",
        summary: "육군부사관학교가 최첨단 AI 기반 교육 시스템을 전면 도입했다. 가상현실(VR)과 AI 시뮬레이션을 활용하여 실전과 같은 훈련 환경을 제공하고 있다.",
        originalUrl: "https://example.com/news/2",
        source: "Defense News",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        collectedAt: new Date().toISOString(),
        status: "analyzing",
        reliability: 95,
        keywords: ["육군부사관학교", "AI 교육", "미래 전투원"],
        category: "defense",
        thumbnailUrl: "https://images.unsplash.com/photo-1626435307521-7b0b2f567086?q=80&w=2070&auto=format&fit=crop"
    },
    {
        id: "3",
        title: "국가식품클러스터, 푸드테크와 AI의 만남... 수출 1조원 달성 눈앞",
        summary: "익산 국가식품클러스터 입주 기업들이 AI 공정 자동화를 통해 생산성을 30% 이상 향상시켰다. K-Food 열풍과 함께 수출 실적도 매년 급증하고 있다.",
        originalUrl: "https://example.com/news/3",
        source: "Economy Today",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        collectedAt: new Date().toISOString(),
        status: "pending",
        reliability: 92,
        keywords: ["국가식품클러스터", "푸드테크", "수출"],
        category: "economy"
    },
    {
        id: "4",
        title: "자율주행 순찰 로봇 '가디언', 익산 시내 시범 운영 시작",
        summary: "AI 자율주행 기술이 탑재된 방범 로봇 '가디언'이 익산 야간 순찰에 투입된다.",
        originalUrl: "https://example.com/news/4",
        source: "Tech Report",
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        collectedAt: new Date().toISOString(),
        status: "approved",
        reliability: 89,
        keywords: ["자율주행", "로봇", "익산"],
        category: "tech",
        thumbnailUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"
    }
];

export async function getNewsList(): Promise<NewsItem[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_NEWS;
}

export async function getNewsStats(): Promise<NewsStats> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        totalCollected: 1250,
        analyzing: 4,
        approved: 842,
        todayCount: 15
    };
}
