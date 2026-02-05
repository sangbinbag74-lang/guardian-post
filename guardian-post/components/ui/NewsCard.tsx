"use client"

import { motion } from "framer-motion"
import Image from "next/image"

interface NewsCardProps {
    title: string
    summary: string
    source: string
    date: string
    imageUrl?: string
    reliability?: number
}

export function NewsCard({ title, summary, source, date, imageUrl, reliability }: NewsCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="group relative bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow dark:hover:shadow-primary/10 cursor-pointer"
        >
            <div className="relative h-48 w-full overflow-hidden bg-muted">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground bg-secondary/10">
                        <span className="text-4xl font-bold opacity-20">GP</span>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium text-foreground">
                    {source}
                </div>
            </div>

            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-muted-foreground">{date}</span>
                    {reliability && (
                        <span className={`text-xs font-bold ${reliability > 80 ? 'text-green-500' : 'text-yellow-500'}`}>
                            신뢰도 {reliability}%
                        </span>
                    )}
                </div>
                <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {summary}
                </p>
            </div>

            <div className="absolute inset-0 border-2 border-primary/0 rounded-lg group-hover:border-primary/20 pointer-events-none transition-colors" />
        </motion.div>
    )
}
