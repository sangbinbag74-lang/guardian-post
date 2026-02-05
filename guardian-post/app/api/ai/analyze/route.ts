import { NextRequest, NextResponse } from "next/server";
import { aiJournalist } from "@/lib/ai/service";

export async function POST(req: NextRequest) {
    try {
        const { newsId, content } = await req.json();

        if (!newsId || !content) {
            return NextResponse.json(
                { error: "newsId and content are required" },
                { status: 400 }
            );
        }

        const result = await aiJournalist.analyze(newsId, content);

        return NextResponse.json(result);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
