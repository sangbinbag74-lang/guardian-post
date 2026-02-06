import { getNewsList } from "@/lib/news/service";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Share2, Printer, Bookmark } from "lucide-react";
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

    return (
        <article className="min-h-screen bg-background pb-20">
            {/* Navigation Bar */}
            <div className="sticky top-14 z-40 w-full border-b bg-background/95 backdrop-blur">
                <div className="container max-w-screen-md mx-auto flex items-center justify-between py-4 px-4">
                    <Link href="/" className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to News
                    </Link>
                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" title="Save">
                            <Bookmark className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Share">
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
                            {news.category || "General"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                            {format(new Date(news.publishedAt), 'MMMM dd, yyyy • HH:mm')}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-bold leading-tight font-serif text-foreground">
                        {news.title}
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
                                Visit Original <ExternalLink className="ml-2 h-3 w-3" />
                            </Link>
                        </Button>
                    </div>
                </header>

                {/* Main Image */}
                <figure className="relative aspect-video w-full overflow-hidden rounded-xl mb-12 bg-muted">
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
                    <figcaption className="mt-3 text-center text-sm text-muted-foreground italic">
                        Image sourced via {news.source}
                    </figcaption>
                </figure>

                {/* Content (AI Summary as Body) */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
                    <div className="p-6 bg-muted/30 rounded-lg border-l-4 border-primary mb-8">
                        <h3 className="text-lg font-bold mb-2 flex items-center text-primary">
                            <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                            AI Executive Summary
                        </h3>
                        <p className="leading-relaxed text-base">
                            {news.summary}
                        </p>
                    </div>

                    <p className="leading-relaxed text-muted-foreground">
                        This article was automatically curated and summarized by Guardian Post's AI engine.
                        The content focuses on <strong>{news.keywords?.[0]}</strong> and related developments
                        in the defense and technology sector.
                    </p>

                    <p>
                        For in-depth analysis and the full story, please refer to the original publication linked above.
                        Guardian Post remains committed to delivering accurate, timely intelligence for decision-makers.
                    </p>
                </div>

                {/* Footer / Disclaimer */}
                <div className="border-t border-border pt-8 pb-12 text-center">
                    <p className="text-xs text-muted-foreground mb-4">
                        Disclaimer: This content is aggregated from various news sources.
                        Guardian Post is not responsible for the accuracy of the original content.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <Link href="/" className="text-primary hover:underline text-sm font-medium">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        </article>
    )
}
