"use client";
import { useState, useEffect } from "react";
import CharacterCard from "../../components/CharacterCard";

export default function RickAndMortyApp() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [characters, setCharacters] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavs, setShowOnlyFavs] = useState(false);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);

  // Requirement 0: Session preservation
  useEffect(() => {
    const savedUser = localStorage.getItem("rm_user_session");
    if (savedUser) {
      setUsername(savedUser);
      setIsLoggedIn(true);
      const savedFavs = localStorage.getItem(`favs_${savedUser}`);
      if (savedFavs) setFavorites(JSON.parse(savedFavs));
    }
  }, []);

  // Fetch from OUR internal API, not the public one (Requirement 5)
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/characters')
        .then(res => res.json())
        .then(data => setCharacters(Array.isArray(data) ? data : []))
        .catch(() => setCharacters([]));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    if (!username.trim()) return;
    localStorage.setItem("rm_user_session", username);
    const savedFavs = localStorage.getItem(`favs_${username}`);
    setFavorites(savedFavs ? JSON.parse(savedFavs) : []);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("rm_user_session");
    setIsLoggedIn(false);
    setUsername("");
  };

  const toggleFav = (id: number) => {
    const next = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(next);
    localStorage.setItem(`favs_${username}`, JSON.stringify(next));
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

  const listToDisplay = showOnlyFavs ? characters.filter((c: any) => favorites.includes(c.id)) : characters;

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
            {listToDisplay.map((char: any) => (
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