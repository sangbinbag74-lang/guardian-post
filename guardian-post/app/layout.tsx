import type { Metadata } from "next";
import { Inter, Noto_Sans_KR } from "next/font/google"; // Using generic google fonts as placeholder, assuming they are available or next/font handles it.
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSansKr = Noto_Sans_KR({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto" }); // This might need preload false if not used to Hangul subsets

export const metadata: Metadata = {
  title: "Guardian Post | AI Based Regional & Defense News",
  description: "익산의 지역 발전과 미래 국방 기술(AI)을 융합한 뉴스를 실시간으로 제공합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSansKr.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
