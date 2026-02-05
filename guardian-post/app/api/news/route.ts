import { getNewsList } from "@/lib/news/service";
import { NextResponse } from "next/server";

export async function GET() {
    const news = await getNewsList();
    return NextResponse.json(news);
}
