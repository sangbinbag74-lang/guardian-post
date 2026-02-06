"use client"

import { useState } from "react";
import { NewsItem } from "@/lib/news/types";
import { AnalysisResult } from "@/lib/ai/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnalysisModal } from "@/components/admin/AnalysisModal";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ExternalLink, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

interface NewsTableProps {
    initialNews: NewsItem[];
}

export function NewsTable({ initialNews }: NewsTableProps) {
    const [analyzingId, setAnalyzingId] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();

    const handleAnalyze = async (news: NewsItem) => {
        setAnalyzingId(news.id);
        try {
            const response = await fetch("/api/ai/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newsId: news.id, content: news.summary }),
            });

            if (!response.ok) throw new Error("Analysis failed");

            const result = await response.json();
            setAnalysisResult(result);
            setIsModalOpen(true);

            // Update local state or refresh (omitted for mock simplicity, in real app we might update React Query cache)
            router.refresh();

        } catch (error) {
            console.error(error);
            alert("분석 중 오류가 발생했습니다.");
        } finally {
            setAnalyzingId(null);
        }
    };

    return (
        <>
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">상태</TableHead>
                            <TableHead>제목</TableHead>
                            <TableHead className="w-[150px]">출처</TableHead>
                            <TableHead className="w-[150px]">게시일</TableHead>
                            <TableHead className="w-[150px]">액션</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialNews.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <Badge
                                        variant={
                                            item.status === 'approved' ? 'default' :
                                                item.status === 'analyzing' ? 'secondary' :
                                                    item.status === 'pending' ? 'outline' : 'destructive'
                                        }
                                    >
                                        {item.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="font-medium">
                                    <div className="flex flex-col gap-1">
                                        <span>{item.title}</span>
                                        <div className="flex gap-2">
                                            {item.keywords.map(k => (
                                                <span key={k} className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">#{k}</span>
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{item.source}</TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {format(new Date(item.publishedAt), 'yyyy-MM-dd')}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant={item.status === 'approved' ? "outline" : "default"}
                                            onClick={() => handleAnalyze(item)}
                                            disabled={analyzingId === item.id}
                                            className="w-28"
                                        >
                                            {analyzingId === item.id ? (
                                                <>
                                                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                                    분석 중...
                                                </>
                                            ) : (
                                                <>
                                                    <Sparkles className="mr-2 h-3 w-3" />
                                                    {item.status === 'approved' ? '다시 분석' : 'AI 분석'}
                                                </>
                                            )}
                                        </Button>
                                        <Link href={item.originalUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="ghost" size="icon" title="원문 보기">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AnalysisModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                result={analysisResult}
            />
        </>
    );
}
