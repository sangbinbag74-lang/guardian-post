import { getNewsList } from "@/lib/news/service";
import { aiJournalist } from "@/lib/ai/service";
import ReactMarkdown from 'react-markdown';
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Share2, Printer, Bookmark, Brain, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: PageProps) {
    const { id } = await params;
    const newsList = await getNewsList();
    const news = newsList.find((item) => item.id === id);

    if (!news) {
        notFound();
    }

    // AI Analysis (Real-time or Mock)
    // Pass title and summary for context. 
    // In a real scenario, we might scrape the original URL content here if safe/legal.
    const analysis = await aiJournalist.analyze(news.id, `${news.title}\n${news.summary}`);

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Navigation Bar */}
            <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur">
                <div className="container max-w-screen-md mx-auto flex items-center justify-between py-4 px-4">
                    <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        목록으로 돌아가기
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="저장">
                            <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="공유">
                            <Share2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container max-w-screen-md mx-auto px-4 pt-10">
                {/* Header */}
                <header className="mb-10 space-y-6">
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                            {news.category === 'defense' ? '국방/안보' : '테크/산업'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(news.publishedAt), 'yyyy년 MM월 dd일 • HH:mm')}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight font-serif text-foreground word-keep-all">
                        {analysis.title || news.title}
                    </h1>

                    <div className="flex items-center justify-between border-y border-border py-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                                {news.source.substring(0, 2)}
                            </div>
                            <div>
                                <p className="text-sm font-semibold">{news.source}</p>
                                <p className="text-xs text-muted-foreground">Original Reporting</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <Link href={news.originalUrl} target="_blank" rel="noopener noreferrer">
                                원문 보기 <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* AI Insight Dashboard */}
                <section className="mb-12 space-y-10">

                    {/* 1. Executive Summary (Key Takeaways) - MOVED TO TOP */}
                    <div className="bg-muted/30 rounded-xl p-6 border border-border/50 shadow-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-primary">
                            <Brain className="w-5 h-5 mr-2" />
                            AI 핵심 요약 (Executive Summary)
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                                <p className="text-lg text-foreground/90 leading-relaxed font-medium">
                                    {analysis.summary}
                                </p>
                            </div>
                            {analysis.implications?.length > 0 && (
                                <div className="mt-4 pl-8 space-y-2 border-l-2 border-primary/20 bg-primary/5 p-4 rounded-r-lg">
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Implications</p>
                                    {analysis.implications.map((imp, idx) => (
                                        <p key={idx} className="text-sm text-foreground/80 leading-relaxed">• {imp}</p>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 2. Main Image */}
                    <figure className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted shadow-sm">
                        {news.thumbnailUrl ? (
                            <Image
                                src={news.thumbnailUrl}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary/20 flex items-center justify-center text-muted-foreground">
                                Guardian Post
                            </div>
                        )}
                        <figcaption className="mt-2 text-right text-xs text-muted-foreground">
                            이미지 출처: {news.source}
                        </figcaption>
                    </figure>

                    {/* 3. Deep Dive Content - MOVED TO BOTTOM & Enhanced Typography */}
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <div className="flex items-center mb-6">
                            <div className="h-8 w-1 bg-primary mr-4 rounded-full"></div>
                            <h3 className="text-2xl font-bold font-serif text-foreground m-0">
                                심층 분석 리포트
                            </h3>
                        </div>

                        <div className="prose-headings:font-bold prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4 prose-p:leading-8 prose-p:mb-6 text-muted-foreground/90">
                            <ReactMarkdown
                                components={{
                                    // Custom renderer to ensure newlines are respected if needed, though standard MD handles paragraphs.
                                    // Ensure H3s have distinct style
                                    h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-border/50 pb-2" {...props} />,
                                    // Ensure lists are properly spaced
                                    ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-4" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                }}
                            >
                                {analysis.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </section>

                {/* Footer / Disclaimer */}
                <div className="border-t border-border pt-8 pb-12 text-center bg-muted/10 -mx-4 px-4 mt-12">
                    <div className="max-w-screen-md mx-auto">
                        <p className="text-xs text-muted-foreground mb-4 word-keep-all">
                            본 리포트는 가디언 포스트의 AI 분석 엔진이 실시간으로 생성했습니다.
                            AI 분석 결과는 원문의 맥락을 보완하기 위한 참고 자료이며, 정확한 사실 확인은 반드시 원문 링크를 통해 확인하시기 바랍니다.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link href="/" className="text-primary hover:underline text-sm font-medium">
                                홈으로 돌아가기
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    )
}
