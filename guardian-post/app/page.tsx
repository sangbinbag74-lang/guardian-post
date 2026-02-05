import Image from "next/image";
import { LiveTicker } from "@/components/ui/LiveTicker";
import { NewsCard } from "@/components/ui/NewsCard";

// Mock Data
const NEWS_DATA = [
  {
    id: 1,
    title: "익산시, 국방 AI 융합 센터 유치 확정... 'K-Defense'의 심장으로 도약",
    summary: "익산시가 차세대 국방 AI 융합 센터 유치에 성공하며 방위 산업의 핵심 거점으로 떠오르고 있다. 이번 유치를 통해 지역 경제 활성화는 물론, 첨단 기술 인재 양성에도 가속도가 붙을 전망이다.",
    source: "Guardian AI",
    date: "2026.02.05",
    imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop",
    reliability: 98,
  },
  {
    id: 2,
    title: "육군부사관학교, '미래형 전투원' 양성을 위한 AI 교육 시스템 도입",
    summary: "육군부사관학교가 최첨단 AI 기반 교육 시스템을 전면 도입했다. 가상현실(VR)과 AI 시뮬레이션을 활용하여 실전과 같은 훈련 환경을 제공하고 있다.",
    source: "Defense News",
    date: "2026.02.04",
    imageUrl: "https://images.unsplash.com/photo-1626435307521-7b0b2f567086?q=80&w=2070&auto=format&fit=crop",
    reliability: 95,
  },
  {
    id: 3,
    title: "국가식품클러스터, 푸드테크와 AI의 만남... 수출 1조원 달성 눈앞",
    summary: "익산 국가식품클러스터 입주 기업들이 AI 공정 자동화를 통해 생산성을 30% 이상 향상시켰다. K-Food 열풍과 함께 수출 실적도 매년 급증하고 있다.",
    source: "Economy Today",
    date: "2026.02.04",
    reliability: 92,
  },
  {
    id: 4,
    title: "자율주행 순찰 로봇 '가디언', 익산 시내 시범 운영 시작",
    summary: "AI 자율주행 기술이 탑재된 방범 로봇 '가디언'이 익산 야간 순찰에 투입된다. 범죄 예방 효과와 시민 안전 지킴이로서의 역할이 기대된다.",
    source: "Tech Report",
    date: "2026.02.03",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop",
    reliability: 89,
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LiveTicker />

      <section className="container max-w-screen-2xl px-4 md:px-8 py-8 md:py-12">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
              Today's <span className="text-secondary">Briefing</span>
            </h2>
            <p className="text-muted-foreground">
              AI가 분석한 오늘의 주요 국방 및 지역 이슈입니다.
            </p>
          </div>
          <div className="hidden md:block text-xs font-mono text-muted-foreground bg-muted px-3 py-1 rounded">
            Last Updated: 2026.02.05 14:00
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {NEWS_DATA.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              summary={news.summary}
              source={news.source}
              date={news.date}
              imageUrl={news.imageUrl}
              reliability={news.reliability}
            />
          ))}
        </div>
      </section>

      <section className="bg-muted/50 py-12">
        <div className="container max-w-screen-2xl px-4 md:px-8">
          <h3 className="text-xl font-bold mb-6">Trending Topics</h3>
          <div className="flex flex-wrap gap-2">
            {['#방위산업', '#AI국방', '#익산맛집', '#부사관학교', '#식품클러스터', '#드론부대', '#스마트시티'].map((tag) => (
              <span key={tag} className="px-4 py-2 bg-background border border-border rounded-full text-sm hover:border-primary hover:text-primary transition-colors cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
