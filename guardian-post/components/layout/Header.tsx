"use client"

import Link from "next/link"
import { Shield, Menu } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useState } from "react"

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl mx-auto items-center justify-between px-4 md:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 mr-6">
                        <Shield className="h-8 w-8 text-primary" strokeWidth={2.5} />
                        <span className="font-bold text-xl tracking-tight hidden md:inline-block">
                            Guardian <span className="text-secondary font-extrabold">Post</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <Link href="#" className="hover:text-primary transition-colors">종합</Link>
                        <Link href="#" className="hover:text-primary transition-colors">익산 뉴스</Link>
                        <Link href="#" className="hover:text-primary transition-colors">국방/안보</Link>
                        <Link href="#" className="hover:text-primary transition-colors">AI 분석</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center text-xs text-muted-foreground mr-2">
                        <span>AI Agent Ready</span>
                        <span className="w-2 h-2 rounded-full bg-green-500 ml-2 animate-pulse"></span>
                    </div>
                    <ModeToggle />
                    <button
                        className="md:hidden p-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-border p-4 space-y-4 bg-background">
                    <Link href="#" className="block hover:text-primary font-medium">종합</Link>
                    <Link href="#" className="block hover:text-primary font-medium">익산 뉴스</Link>
                    <Link href="#" className="block hover:text-primary font-medium">국방/안보</Link>
                    <Link href="#" className="block hover:text-primary font-medium">AI 분석</Link>
                </div>
            )}
        </header>
    )
}
