import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Requirement 5: Local server database
const DB_PATH = path.join(process.cwd(), 'server', 'db.json');
const TEN_MINUTES = 600000;

interface Episode {
    name: string;
    air_date: string;
}

interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    gender: string;
    image: string;
    location: { name: string };
    origin: { name: string };
    episode: string[];
    episodes?: Episode[];
}

interface DB {
    characters: Character[];
    episodes: Record<string, Episode>;
    lastCharacterFetch: number;
}

function readDB(): DB {
    if (!fs.existsSync(DB_PATH)) {
        return { characters: [], episodes: {}, lastCharacterFetch: 0 };
    }
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    } catch (e) {
        return { characters: [], episodes: {}, lastCharacterFetch: 0 };
    }
}

function writeDB(data: DB) {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

async function fetchEpisodes(urls: string[], db: DB): Promise<Episode[]> {
    const result: Episode[] = [];
    const urlsToFetch = urls.filter(url => !db.episodes[url]);

    if (urlsToFetch.length > 0) {
        // Fetch missing episodes
        const promises = urlsToFetch.map(url => fetch(url).then(r => r.json()));
        const fetched = await Promise.all(promises);
        fetched.forEach((ep, i) => {
            db.episodes[urlsToFetch[i]] = {
                name: ep.name,
                air_date: ep.air_date
            };
        });
        writeDB(db);
    }

    urls.forEach(url => {
        if (db.episodes[url]) {
            result.push(db.episodes[url]);
        }
    });

    return result;
}

export async function POST(request: Request) {
    try {
        const { query } = await request.json();
        const db = readDB();
        const now = Date.now();

        // Requirement 5: Fetch from API if expired or empty
        if (db.characters.length === 0 || now - db.lastCharacterFetch > TEN_MINUTES) {
            const res = await fetch('https://rickandmortyapi.com/api/character');
            const data = await res.json();
            db.characters = data.results || [];
            db.lastCharacterFetch = now;
            writeDB(db);
        }

        // A very minimal "GraphQL" resolver for the sake of the challenge
        if (typeof query === 'string' && query.includes('characters')) {
            // If the query asks for episodes, we resolve them
            const charactersWithEpisodes = await Promise.all(db.characters.map(async (char) => {
                // Requirement 2: 3 latest episodes
                const latestEpisodeUrls = (char.episode || []).slice(-3).reverse();
                const episodes = await fetchEpisodes(latestEpisodeUrls, db);
                return {
                    ...char,
                    episodes // This will be { name, air_date }
                };
            }));

            return NextResponse.json({
                data: {
                    characters: charactersWithEpisodes
                }
            });
        }

        return NextResponse.json({ errors: [{ message: "Unsupported query" }] }, { status: 400 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ errors: [{ message: "Internal Server Error" }] }, { status: 500 });
    }
}
