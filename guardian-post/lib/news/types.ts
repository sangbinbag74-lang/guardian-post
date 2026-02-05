export type NewsStatus = 'pending' | 'analyzing' | 'approved' | 'rejected' | 'published';

export interface NewsItem {
    id: string;
    title: string;
    summary: string;
    content?: string; // Full content or extended summary
    originalUrl: string;
    source: string;
    publishedAt: string; // ISO Date string
    collectedAt: string; // ISO Date string
    status: NewsStatus;
    reliability: number; // 0-100
    keywords: string[];
    thumbnailUrl?: string;
    category?: 'defense' | 'economy' | 'society' | 'tech';
}

export interface NewsStats {
    totalCollected: number;
    analyzing: number;
    approved: number;
    todayCount: number;
}
