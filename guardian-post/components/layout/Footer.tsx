export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-muted/30 mt-12 py-8">
            <div className="container max-w-screen-2xl px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col items-center md:items-start">
                    <span className="font-bold text-lg tracking-tight">
                        Guardian Post
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">
                        AI Powered Regional & Defense News Platform
                    </p>
                </div>

                <div className="flex flex-col items-center md:items-end text-sm text-muted-foreground">
                    <p>© 2026 Guardian Post. All rights reserved.</p>
                    <p className="text-xs mt-1">Designed by Antigravity</p>
                </div>
            </div>
        </footer>
    )
}
