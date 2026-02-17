import { NextResponse } from 'next/server';

// This forces the server to run the code every time
export const dynamic = 'force-dynamic';

let serverDataCache: any[] = [];
let lastFetchTime = 0;

export async function GET() {
  const currentTime = Date.now();
  const TEN_MINUTES = 600000;

  try {
    // If cache is empty or older than 10 mins, fetch new data (Section 5)
    if (serverDataCache.length === 0 || (currentTime - lastFetchTime > TEN_MINUTES)) {
      const response = await fetch('https://rickandmortyapi.com/api/character');
      
      if (!response.ok) throw new Error('Failed to fetch from Rick & Morty API');
      
      const data = await response.json();
      serverDataCache = data.results || [];
      lastFetchTime = currentTime;
    }

    return NextResponse.json(serverDataCache);
  } catch (error) {
    return NextResponse.json({ error: "Server Database Error" }, { status: 500 });
  }
}