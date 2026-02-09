import Image from "next/image";

export default function Home() {
  return (
    /* This container centers your text perfectly on the screen */
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      
      {/* WELCOME TEXT: Using the bold technical font we set up in layout.tsx */}
      <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter font-[family-name:var(--font-jetbrains)]">
        Welcome To <span className="text-blue-600 dark:text-blue-400">The Website</span>
      </h1>

      {/* SUBTEXT: Clean and easy to read */}
      <p className="max-w-xl text-lg md:text-2xl opacity-80 leading-relaxed font-[family-name:var(--font-inter)]">
        This is my official portfolio project. I have organized the navigation, 
        fixed the theme issues, and applied custom typography.
      </p>

      {/* A simple decorative line instead of the status box */}
      <div className="mt-10 w-24 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>

    </div>
  );
}