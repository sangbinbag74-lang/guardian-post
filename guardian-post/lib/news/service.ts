import { NewsItem, NewsStats } from "./types";
import Parser from "rss-parser";

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

    return uniqueNews.sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

  } catch (error) {
    console.error("News Fetch Error:", error);
    // 에러 발생 시에도 빈 배열 반환 (Mock 절대 사용 금지)
    return [];
  }
}

// 아이템 가공 헬퍼 함수
function processFeedItem(item: any, keyword: string, region: string): NewsItem {
  const imgMatch = item.content?.match(/<img[^>]+src="([^">]+)"/);
  const pubDate = item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString();

  return {
    id: item.guid || item.link || Math.random().toString(),
    title: item.title || "No Title",
    summary: item.contentSnippet?.slice(0, 150) + "..." || "No Summary",
    originalUrl: item.link || "#",
    source: `[${region}] ${item.creator || item.source?.title || "Google News"}`,
    publishedAt: pubDate,
    collectedAt: new Date().toISOString(),
    status: 'pending',
    reliability: 0,
    keywords: [keyword], // Tag with search keyword
    thumbnailUrl: imgMatch ? imgMatch[1] : undefined,
    category: keyword.includes("Defense") || keyword.includes("방산") ? "defense" : "tech"
  } as NewsItem;
}

export async function getNewsStats(): Promise<NewsStats> {
  // 실시간 수집 특성상 누적 통계는 DB 연동 전까지는 0으로 표시하여
  // 사용자가 '실시간 데이터임'을 인지하게 함
  return {
    totalCollected: 0,
    analyzing: 0,
    approved: 0,
    todayCount: 0
  };
}
