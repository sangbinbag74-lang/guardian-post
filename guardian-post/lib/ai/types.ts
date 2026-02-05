export interface VisualSuggestion {
    type: 'chart' | 'image' | 'infographic';
    description: string;
    prompt: string; // Prompt for image generation AI
}

export interface AnalysisResult {
    title: string;
    summary: string;
    content: string; // Markdown supported deep analysis
    implications: string[]; // Strategic implications
    suggestedVisuals: VisualSuggestion[];
    reliability: number;
    analyzedAt: string;
}

export interface AiJournalist {
    analyze(newsId: string, content: string): Promise<AnalysisResult>;
}
