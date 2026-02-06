"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Newspaper, ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface NewsCardProps {
    title: string
    summary: string
    source: string
    date: string
    imageUrl?: string
    reliability?: number
    originalUrl: string
    category?: string
}

export function NewsCard({ title, summary, source, date, imageUrl, originalUrl, category }: NewsCardProps) {
    return (
        <Link href={originalUrl} className="block h-full">
            <motion.div
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative flex flex-col h-full bg-card border border-border/50 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 dark:bg-card/50"
            >
                {/* Image Section */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-muted to-muted/50 text-muted-foreground p-6 text-center">
                            <Newspaper className="w-12 h-12 mb-3 opacity-20" />
                            <span className="text-xs font-medium uppercase tracking-widest opacity-40">Guardian Post</span>
                        </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background/90 transition-colors text-xs font-semibold uppercase tracking-wider">
                            {source}
                        </Badge>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-grow p-5 space-y-4">
                    <div className="flex-grow space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{date}</span>
                            {category && <span className="uppercase tracking-wider opacity-70">{category}</span>}
                        </div>

                        <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 md:line-clamp-3 font-serif">
                            {title}
                        </h3>

                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                            {summary}
                        </p>
                    </div>

                    {/* Footer Action */}
                    <div className="flex items-center text-xs font-medium text-primary opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        Read Full Article <ArrowUpRight className="ml-1 w-3 h-3" />
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}
