import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      
      <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter font-[family-name:var(--font-jetbrains)]">
        Welcome To <span className="text-blue-600 dark:text-blue-400">The Website</span>
      </h1>

      <div className="mt-10 w-24 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"></div>

    </div>
  );
}