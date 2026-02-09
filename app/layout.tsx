import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Portfolio Project",
  description: "Next.js Site with Dark Mode",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          nav a { 
            margin-right: 40px !important; 
            text-decoration: none !important; 
            font-family: var(--font-jetbrains), monospace;
          }
          nav a:last-child { margin-right: 0 !important; }
          /* This forces the headers/welcome text to look distinct */
          h1 { 
            font-family: var(--font-jetbrains), monospace; 
            letter-spacing: -0.05em;
            font-weight: 800;
          }
        `}</style>
      </head>
      {/* THE FIX: bg-white dark:bg-[#0a0a0a] handles the background color shift */}
      <body className={`${inter.variable} ${jetbrains.variable} antialiased min-h-screen transition-colors duration-500 bg-white dark:bg-[#0a0a0a] text-black dark:text-white font-sans`}>
        
        <header className="sticky top-0 z-50 flex items-center justify-between p-6 border-b border-gray-200/50 dark:border-zinc-800/50 backdrop-blur-md bg-white/70 dark:bg-[#0a0a0a]/70">
          <nav className="flex items-center">
            <Link href="/" className="hover:text-blue-500 !text-current font-bold uppercase tracking-widest text-sm transition-all">Home</Link>
            <Link href="/about" className="hover:text-blue-500 !text-current font-bold uppercase tracking-widest text-sm transition-all">About</Link>
            <Link href="/projects" className="hover:text-blue-500 !text-current font-bold uppercase tracking-widest text-sm transition-all">Projects</Link>
            <Link href="/contact" className="hover:text-blue-500 !text-current font-bold uppercase tracking-widest text-sm transition-all">Contact</Link>
          </nav>
          
          <ThemeToggle />
        </header>

        <main className="p-10 max-w-5xl mx-auto">
          {children}
        </main>

        <footer className="p-12 border-t border-gray-200 dark:border-zinc-800 text-center text-xs opacity-40 font-mono">
          © 2026 STUDENT_PORTFOLIO
        </footer>
      </body>
    </html>
  );
}