import { Brain, FileText, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container max-w-screen-md mx-auto px-4 pt-20 pb-20 min-h-screen">
            {/* Loading Indicator */}
            <div className="flex flex-col items-center justify-center mb-12 space-y-4 animate-pulse">
                <div className="relative">
                    <Brain className="w-16 h-16 text-primary/50" />
                    <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                </div>
                <h2 className="text-xl font-bold text-muted-foreground text-center">
                    AI 분석관이 리포트를 작성 중입니다...
                </h2>
                <p className="text-sm text-muted-foreground/60">
                    약 2~3초 정도 소요됩니다. 잠시만 기다려주세요.
                </p>
            </div>

            {/* Skeleton Structure mimicking the real page */}
            <div className="space-y-8 opacity-50 pointer-events-none select-none">

                {/* Header Skeleton */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                    <Skeleton className="h-16 w-full max-w-lg" />
                    <Skeleton className="h-12 w-full border-y" />
                </div>

                {/* Dashboard Skeleton */}
                <div className="border border-border/50 rounded-xl p-6 bg-muted/20">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="aspect-video w-full rounded-xl" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            </div>
        </div>
    );
}
