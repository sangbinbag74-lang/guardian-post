import { format } from "date-fns";
import { getNewsList } from "@/lib/news/service";
import { LiveTicker } from "@/components/ui/LiveTicker";
import { NewsCard } from "@/components/ui/NewsCard";
import { ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const newsList = await getNewsList();
  const today = format(new Date(), 'yyyy.MM.dd HH:mm');

  // 데이터 분기 처리 (Hero: 1개, Featured: 4개, Rest: 나머지)
  const heroNews = newsList[0];
  const featuredNews = newsList.slice(1, 5);
  const regularNews = newsList.slice(5);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <LiveTicker />

      {/* Header Section */}
      <section className="container max-w-screen-2xl px-4 md:px-8 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between border-b border-border pb-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-2 font-serif">
              Guardian Post
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl font-light">
              Intelligence for the Future of Defense & Technology
            </p>
          </div>
          <div className="mt-4 md:mt-0 text-right">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Live Updates
            </div>
            <div className="text-xs font-mono text-muted-foreground">
              Last Synced: {today}
            </div>
          </div>
        </div>
      </section>

      <main className="container max-w-screen-2xl px-4 md:px-8 py-8 space-y-16">

        {/* 1. Hero Section (Top News) */}
        {heroNews && (
          <section className="relative group">
            <Link href={heroNews.originalUrl} target="_blank" className="block relative aspect-[21/9] w-full overflow-hidden rounded-2xl">
              {heroNews.thumbnailUrl ? (
                <Image
                  src={heroNews.thumbnailUrl}
                  alt={heroNews.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-slate-900 to-slate-800" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 md:p-12 w-full md:w-3/4 lg:w-2/3">
                <div className="flex items-center space-x-2 mb-4">
                  <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest rounded-sm">
                    Top Story
                  </span>
                  <span className="text-white/80 text-xs font-medium border-l border-white/30 pl-2">
                    {heroNews.source}
                  </span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight font-serif group-hover:text-primary-foreground/90 transition-colors">
                  {heroNews.title}
                </h2>
                <p className="text-lg text-gray-200 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-3xl">
                  {heroNews.summary}
                </p>
              </div>
            </Link>
          </section>
        )}

        {/* 2. Featured Grid (Bento Style) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Featured
            </h3>
            <span className="h-[1px] flex-grow bg-border ml-4"></span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredNews.map((news) => (
              <NewsCard
                key={news.id}
                {...news}
                imageUrl={news.thumbnailUrl}
                category={news.keywords?.[0]}
                date={format(new Date(news.publishedAt), 'MMM dd, yyyy')}
              />
            ))}
          </div>
        </section>

        {/* 3. Latest News (Rows) */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold">Latest Headlines</h3>
            <span className="h-[1px] flex-grow bg-border ml-4"></span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {regularNews.map((news) => (
              <NewsCard
                key={news.id}
                {...news}
                imageUrl={news.thumbnailUrl}
                category="News"
                date={format(new Date(news.publishedAt), 'yyyy-MM-dd')}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container max-w-screen-2xl px-4 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 Guardian Post. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
