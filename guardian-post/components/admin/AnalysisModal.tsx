"use client"

import { AnalysisResult } from "@/lib/ai/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import { Badge } from "@/components/ui/badge";
import { Brain, FileImage, BarChart, ExternalLink, Lightbulb } from "lucide-react";

interface AnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: AnalysisResult | null;
}

export function AnalysisModal({ isOpen, onClose, result }: AnalysisModalProps) {
    if (!result) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b bg-muted/20">
                    <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            <Brain className="w-3 h-3 mr-1" /> AI Deep Analysis
                        </Badge>
                    </div>
                    <DialogTitle className="text-xl leading-tight text-left">
                        {result.title}
                    </DialogTitle>
                    <DialogDescription className="text-left mt-2">
                        {result.summary}
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-6 py-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                <ReactMarkdown>{result.content}</ReactMarkdown>
                            </div>
                        </div>

                        {/* Sidebar: Implications & Visuals */}
                        <div className="space-y-6">
                            {/* Implications */}
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg p-4">
                                <h4 className="font-semibold text-amber-900 dark:text-amber-100 flex items-center mb-3">
                                    <Lightbulb className="w-4 h-4 mr-2" />
                                    전략적 시사점
                                </h4>
                                <ul className="space-y-2">
                                    {result.implications.map((imp, idx) => (
                                        <li key={idx} className="text-sm text-amber-800 dark:text-amber-200 flex items-start">
                                            <span className="mr-2">•</span>
                                            {imp}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Suggested Visuals */}
                            <div className="border rounded-lg p-4 bg-card">
                                <h4 className="font-semibold mb-3 flex items-center">
                                    <FileImage className="w-4 h-4 mr-2" />
                                    추천 시각 자료
                                </h4>
                                <div className="space-y-3">
                                    {result.suggestedVisuals.map((visual, idx) => (
                                        <div key={idx} className="bg-muted p-3 rounded text-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-medium text-xs uppercase text-muted-foreground flex items-center">
                                                    {visual.type === 'chart' ? <BarChart className="w-3 h-3 mr-1" /> : <FileImage className="w-3 h-3 mr-1" />}
                                                    {visual.type}
                                                </span>
                                            </div>
                                            <p className="font-medium mb-1">{visual.description}</p>
                                            <div className="bg-background p-2 rounded border text-xs text-muted-foreground italic">
                                                " {visual.prompt} "
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
