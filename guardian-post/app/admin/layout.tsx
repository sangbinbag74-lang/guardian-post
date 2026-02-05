"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Newspaper, Settings, LogOut, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const links = [
        { href: "/admin", label: "대시보드", icon: LayoutDashboard },
        { href: "/admin/news", label: "뉴스 관리", icon: Newspaper },
        { href: "/admin/settings", label: "설정", icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <Shield className="h-6 w-6 text-primary" />
                        <span>Guardian Admin</span>
                    </Link>
                </div>
                <nav className="flex flex-1 flex-col gap-1 px-4 py-4">
                    {links.map((link) => {
                        const Icon = link.icon
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:text-primary",
                                    isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                {link.label}
                            </Link>
                        )
                    })}
                </nav>
                <div className="border-t p-4">
                    <Link href="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all">
                        <LogOut className="h-4 w-4" />
                        나가기
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-1 flex-col sm:pl-64">
                <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
                    <h1 className="text-lg font-semibold md:text-xl">
                        {links.find(l => l.href === pathname)?.label || '관리자'}
                    </h1>
                </header>
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
