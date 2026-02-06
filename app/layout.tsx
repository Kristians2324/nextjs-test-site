import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        {/* Safety Net: This forces spacing even if Tailwind is acting up */}
        <style>{`
          nav a { margin-right: 40px !important; text-decoration: none !important; }
          nav a:last-child { margin-right: 0 !important; }
        `}</style>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-500 bg-white dark:bg-[#0a0a0a] text-black dark:text-white`}>
        
        <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-zinc-800">
          <nav className="flex items-center">
            <Link href="/" className="hover:text-blue-500 !text-current font-bold">Home</Link>
            <Link href="/about" className="hover:text-blue-500 !text-current font-bold">About</Link>
            <Link href="/projects" className="hover:text-blue-500 !text-current font-bold">Projects</Link>
            <Link href="/contact" className="hover:text-blue-500 !text-current font-bold">Contact</Link>
          </nav>
          
          <ThemeToggle />
        </header>

        <main className="min-h-screen p-10">
          {children}
        </main>

        <footer className="p-8 border-t border-gray-200 dark:border-zinc-800 text-center text-sm opacity-50">
          © 2026 Student Portfolio Project
        </footer>
      </body>
    </html>
  );
}