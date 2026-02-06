import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="container max-w-screen-2xl mx-auto px-4 md:px-8 py-8 space-y-16">
            {/* Header Skeleton */}
            <div className="space-y-4 pt-8">
                <Skeleton className="h-12 w-3/4 max-w-lg" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* Hero Section Skeleton */}
            <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-muted">
                <Skeleton className="h-full w-full" />
                <div className="absolute bottom-0 left-0 p-8 space-y-4 w-full">
                    <Skeleton className="h-8 w-2/3 bg-background/20" />
                    <Skeleton className="h-4 w-1/2 bg-background/20" />
                </div>
            </div>

            {/* Featured Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[200px] w-full rounded-xl" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                ))}
            </div>

            {/* List Skeleton */}
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <Skeleton className="h-24 w-24 rounded-lg" />
                        <div className="flex-1 space-y-2 py-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
