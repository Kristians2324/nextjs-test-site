"use client";
import { useState, useEffect } from "react";
import CharacterCard from "../../components/CharacterCard";

// Cookie Helpers
const setCookie = (name: string, value: string, days = 7) => {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "") + expires + "; path=/; SameSite=Lax";
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const deleteCookie = (name: string) => {
  setCookie(name, "", -1);
};

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
  episodes: Array<{
    name: string;
    air_date: string;
  }>;
}

export default function RickAndMortyApp() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  // Requirement 0: Session preservation
  useEffect(() => {
    const savedUser = getCookie("rm_user_session");
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
      const savedFavs = getCookie(`favs_${savedUser}`);
      if (savedFavs) {
        try {
          setFavorites(JSON.parse(savedFavs));
        } catch (e) {
          console.error("Failed to parse favorites cookie", e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only runs on mount

  // Requirement 5: Fetch from OUR internal GRAPHQL API
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: '{ characters { id name status species gender image location { name } origin { name } episodes { name air_date } } }'
        })
      })
        .then(res => res.json())
        .then(resData => {
          const fetchedCharacters = resData.data?.characters;
          setCharacters(Array.isArray(fetchedCharacters) ? fetchedCharacters : []);
        })
        .catch((err) => {
          console.error("GraphQL Fetch Error:", err);
          setCharacters([]);
        });
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (!username.trim()) return;
    setCookie("rm_user_session", username);
    const savedFavs = getCookie(`favs_${username}`);
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {
        setFavorites([]);
      }
    } else {
      setFavorites([]);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    deleteCookie("rm_user_session");
    setIsLoggedIn(false);
    setUsername("");
  };

  const toggleFav = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    setCookie(`favs_${username}`, JSON.stringify(next));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-6 font-mono">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] w-full max-w-sm">
          <h1 className="text-xl font-black mb-4 uppercase text-black">0 - Federation Login</h1>
          <input className="w-full border-2 border-black p-3 mb-4 outline-none text-black" placeholder="IDENTITY_ID" value={username} onChange={e => setUsername(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-black text-white p-3 font-bold uppercase hover:bg-zinc-800">Enter Portal</button>
        </div>
      </div>
    );
  }

  const listToDisplay = showOnlyFavs ? characters.filter((c: Character) => favorites.includes(c.id)) : characters;

  return (
    <main className="min-h-screen bg-zinc-100 p-6 font-mono text-black">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 border-b-4 border-black pb-6 gap-4">
          <h1 className="text-2xl font-black uppercase italic">Multiverse_Core_V1</h1>
          <div className="flex gap-4">
            <button onClick={() => setShowOnlyFavs(!showOnlyFavs)} className="bg-yellow-400 border-2 border-black px-4 py-2 font-bold text-xs uppercase">
              {showOnlyFavs ? "Display All" : "Display Favorites"}
            </button>
            <button onClick={handleLogout} className="bg-black text-white px-4 py-2 font-bold text-xs uppercase">Logout</button>
          </div>
        </header>

        {listToDisplay.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {listToDisplay.map((char: Character) => (
              <CharacterCard
                key={char.id}
                char={char}
                isFavorite={favorites.includes(char.id)}
                toggleFav={toggleFav}
                isExpanded={expandedCardId === char.id}
                onExpand={() => setExpandedCardId(expandedCardId === char.id ? null : char.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-4 border-dashed border-zinc-300">
            <p className="font-bold opacity-30 uppercase tracking-widest">No Data in Server Cache</p>
            <p className="text-[10px] mt-2 italic">Verify app/api/characters/route.ts is running...</p>
          </div>
        )}
      </div>
    </main>
  );
}