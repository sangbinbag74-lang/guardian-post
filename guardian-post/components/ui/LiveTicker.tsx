"use client"

import { motion } from "framer-motion"

export function LiveTicker() {
    const keywords = [
        "익산 국가식품클러스터",
        "국방 AI 센터 유치",
        "육군부사관학교",
        "자율주행 순찰 로봇",
        "K-Defense 수출",
        "지역 균형 발전",
        "스마트 팜 혁신",
    ]

    return (
        <div className="w-full bg-primary/5 border-b border-primary/10 overflow-hidden py-2 relative flex items-center">
            <div className="bg-primary text-primary-foreground px-4 py-1 text-xs font-bold uppercase tracking-wider ml-4 lg:ml-8 z-10 rounded shadow-sm">
                Guardian AI Analysis
            </div>
            <div className="flex overflow-hidden whitespace-nowrap mask-linear-fade w-full absolute left-0 top-0 h-full items-center">
                <motion.div
                    className="flex gap-8 items-center"
                    animate={{ x: "-50%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 20,
                    }}
                >
                    {[...keywords, ...keywords, ...keywords].map((keyword, i) => (
                        <span key={i} className="text-sm font-medium text-foreground/80 flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2 animate-pulse" />
                            {keyword}
                        </span>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}
