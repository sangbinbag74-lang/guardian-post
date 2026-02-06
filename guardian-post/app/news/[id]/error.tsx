"use client";

import { useEffect } from "react";
import { AlertCircle, ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("News Detail Error:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-6">
            <div className="bg-destructive/10 p-4 rounded-full">
                <AlertCircle className="w-12 h-12 text-destructive" />
            </div>

            <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold tracking-tight">
                    분석 리포트를 불러오지 못했습니다.
                </h2>
                <p className="text-muted-foreground">
                    일시적인 시스템 오류이거나, 원문 기사의 데이터가 불안정할 수 있습니다.
                    잠시 후 다시 시도하거나 원문 페이지로 이동해 보세요.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 min-w-[200px]">
                <Button onClick={() => reset()} variant="outline">
                    다시 시도
                </Button>
                <Button variant="default" asChild>
                    <Link href="/" className="flex items-center">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        목록으로 돌아가기
                    </Link>
                </Button>
            </div>

            <div className="pt-8 border-t w-full max-w-xs mx-auto">
                <p className="text-xs text-muted-foreground mb-4">
                    혹시 원문이 필요하신가요?
                </p>
                {/* We can't guarantee we have the URL here since it's an error boundary, 
            so we offer general navigation */}
            </div>
        </div>
    );
}
