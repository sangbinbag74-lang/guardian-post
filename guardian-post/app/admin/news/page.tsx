import { getNewsList } from "@/lib/news/service";
import { Button } from "@/components/ui/button";
import { NewsTable } from "@/components/admin/NewsTable";

export default async function NewsAdminPage() {
    const newsList = await getNewsList();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">뉴스 관리</h2>
                <Button>수집 시작 (Manual Trigger)</Button>
            </div>

            <NewsTable initialNews={newsList} />
        </div>
    );
}
