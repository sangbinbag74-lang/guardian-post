import { NewsItem, NewsStats } from "./types";
import Parser from "rss-parser";
import { aiJournalist } from "../ai/service";

const parser = new Parser();

// 검색 키워드 정의 (다국어/다분야)
const KEYWORDS_KR = [
  // 1. 익산 & 로컬 핵심
  "익산", "익산시", "국가식품클러스터",

  // 2. K-방산 & 국방
  "방산", "방위산업", "국방", "K-방산", "육군부사관학교",

  // 3. 미래 산업 & 트렌드
  "자율주행", "드론", "로봇", "UAM", "이차전지", "바이오", "푸드테크",
  "스타트업", "스마트시티", "AI 산업", "방산 수출"
];

const KEYWORDS_EN = [
  // 1. Global Defense & Military
  "Defense Industry", "Military Technology", "Aerospace", "Weapon Systems", "Future Warfare",

  // 2. Advanced Tech & AI
  "Artificial Intelligence", "Autonomous Systems", "Robotics", "UAV", "Drone Technology",

  // 3. Global Business & Trends
  "Global Economy", "Tech Trends", "Smart City", "Logistics Innovation", "Defense Startup"
];

// Google News RSS URL 생성기 (국가/언어별 지원)
const getRssUrl = (keyword: string, lang: string = 'ko', gl: string = 'KR', ceid: string = 'KR:ko') =>
  `https://news.google.com/rss/search?q=${encodeURIComponent(keyword)}&hl=${lang}&gl=${gl}&ceid=${ceid}`;

export async function getNewsList(): Promise<NewsItem[]> {
  try {
    const allNews: NewsItem[] = [];

    // 1. 한국 뉴스 수집
    const krPromises = KEYWORDS_KR.map(async (keyword) => {
      try {
        const feed = await parser.parseURL(getRssUrl(keyword, 'ko', 'KR', 'KR:ko'));
        return feed.items.map(item => processFeedItem(item, keyword, 'KR'));
      } catch (e) {
        console.error(`Failed to fetch RSS for KR keyword "${keyword}":`, e);
        return [];
      }
    });

    // 2. 글로벌(영문) 뉴스 수집
    const enPromises = KEYWORDS_EN.map(async (keyword) => {
      try {
        const feed = await parser.parseURL(getRssUrl(keyword, 'en-US', 'US', 'US:en'));
        return feed.items.map(item => processFeedItem(item, keyword, 'Global'));
      } catch (e) {
        console.error(`Failed to fetch RSS for EN keyword "${keyword}":`, e);
        return [];
      }
    });

    const results = await Promise.all([...krPromises, ...enPromises]);
    results.forEach(items => allNews.push(...items));

    // 중복 제거 (제목 기준) 및 최신순 정렬
    const uniqueNews = Array.from(new Map(allNews.map(item => [item.title, item])).values());

    const sortedNews = uniqueNews.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    // [Pre-analysis] Analyze ALL News items in parallel
    // As per user request: "Analyze everything beforehand so the user never waits."
    // This loads the cache for every single item fetched from RSS.
    // Since we rely on in-memory caching, subsequent refreshes will be instant.
    if (sortedNews.length > 0) {
      // console.log(`Starting pre-analysis for all ${sortedNews.length} items...`);
      await Promise.all(
        sortedNews.map(item =>
          aiJournalist.analyze(item.id, `${item.title}\n${item.summary}`)
            .catch(err => console.error(`Pre-analysis failed for ${item.id}:`, err))
        )
      );
      // console.log("Pre-analysis for all items complete.");
    }

    return sortedNews;

  } catch (error) {
    console.error("News Fetch Error:", error);
    // 에러 발생 시에도 빈 배열 반환 (Mock 절대 사용 금지)
    return [];
  }
}

// Fallback Image Map (고화질 Unsplash 이미지)
const FALLBACK_IMAGES: Record<string, string> = {
  "Defense": "https://images.unsplash.com/photo-1518599806967-73598d1a1265?auto=format&fit=crop&q=80&w=800", // Tank/Military
  "Drone": "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800", // Drone
  "AI": "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", // AI Abstract
  "Food": "https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&q=80&w=800", // Food Industry
  "City": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=80&w=800", // City
  "Default": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800" // Generic News
};

import { createHash } from "crypto";

// 아이템 가공 헬퍼 함수
function processFeedItem(item: any, keyword: string, region: string): NewsItem {
  const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
  const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

  // Deterministic ID Generation
  // Use link or guid to generate a stable hash ID. 
  // This ensures that the same article always gets the same ID, fixing Broken Link issues.
  const uniqueKey = item.link || item.guid || item.title;
  const id = createHash('sha256').update(uniqueKey).digest('hex').substring(0, 16);

  // Fallback Image Selection Logic (High Quality Priority)
  // We prioritize high-quality Unsplash images based on keywords to ensure premium look.
  let thumbnailUrl = undefined;

  if (keyword.includes("드론") || keyword.includes("자율주행") || keyword.includes("UAV")) thumbnailUrl = FALLBACK_IMAGES["Drone"];
  else if (keyword.includes("방산") || keyword.includes("국방") || keyword.includes("Defense") || keyword.includes("K-방산")) thumbnailUrl = FALLBACK_IMAGES["Defense"];
  else if (keyword.includes("AI") || keyword.includes("지능")) thumbnailUrl = FALLBACK_IMAGES["AI"];
  else if (keyword.includes("식품") || keyword.includes("푸드") || keyword.includes("클러스터")) thumbnailUrl = FALLBACK_IMAGES["Food"];
  else if (keyword.includes("익산") || keyword.includes("도시") || keyword.includes("지자체")) thumbnailUrl = FALLBACK_IMAGES["City"];
  else thumbnailUrl = imgMatch ? imgMatch[1] : FALLBACK_IMAGES["Default"]; // Only use RSS image if no keyword match

  return {
    id: id,
    title: item.title || "No Title",
    summary: item.contentSnippet?.slice(0, 150) + "..." || "No Summary",
    originalUrl: item.link || "#",
    source: `[${region}] ${item.creator || item.source?.title || "Google News"}`,
    publishedAt: pubDate,
    collectedAt: new Date().toISOString(),
    status: 'pending',
    reliability: 0,
    keywords: [keyword],
    thumbnailUrl: thumbnailUrl,
    category: keyword.includes("Defense") || keyword.includes("방산") ? "defense" : "tech"
  } as NewsItem;
}

export async function getNewsStats(): Promise<NewsStats> {
  return {
    totalCollected: 0,
    analyzing: 0,
    approved: 0,
    todayCount: 0
  };
}
