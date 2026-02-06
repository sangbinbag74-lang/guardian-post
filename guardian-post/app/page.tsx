import Link from "next/link";
import { format } from "date-fns";
import { getNewsList } from "@/lib/news/service";
import { LiveTicker } from "@/components/ui/LiveTicker";
import { NewsCard } from "@/components/ui/NewsCard";

export default async function Home() {
  const newsList = await getNewsList();
  const today = format(new Date(), 'yyyy.MM.dd HH:mm');

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
            Last Updated: {today}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newsList.map((news) => (
            <NewsCard
              key={news.id}
              title={news.title}
              summary={news.summary}
              source={news.source}
              date={format(new Date(news.publishedAt), 'yyyy-MM-dd')}
              imageUrl={news.thumbnailUrl}
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
