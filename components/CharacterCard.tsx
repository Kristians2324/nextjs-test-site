"use client";

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
  episodes?: Array<{
    name: string;
    air_date: string;
  }>;
}

interface CharacterCardProps {
  char: Character;
  isFavorite: boolean;
  toggleFav: (id: number) => void;
  isExpanded: boolean;
  onExpand: () => void;
}

export default function CharacterCard({ char, isFavorite, toggleFav, isExpanded, onExpand }: CharacterCardProps) {
  // Guard clause to prevent the "Cannot read properties of undefined" error
  if (!char) return null;

  return (
    <div className="bg-white border-2 border-black p-4 flex flex-col relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-black min-h-[160px]">
      {/* Requirement 3: Favorite Star - z-index and explicit filter:none added */}
      <button
        onClick={() => toggleFav(char.id)}
        className="absolute top-2 right-2 text-2xl z-30 hover:scale-110 transition-transform select-none"
        style={{ filter: 'none' }}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      >
        {isFavorite ? <span className="text-yellow-400">⭐</span> : <span>☆</span>}
      </button>

      <div className="flex gap-4 mb-2">
        {/* Requirement 1: Character Information Fields */}
        <div className="w-32 h-32 border-2 border-black flex-shrink-0 bg-zinc-200 overflow-hidden">
          <img
            src={char.image}
            alt={char.name}
            className={`w-full h-full object-cover ${char.status === 'Dead' ? 'grayscale opacity-80' : ''}`}
          />
        </div>

        <div className="flex-1 text-[11px] space-y-1 pr-6">
          <p className="text-sm font-black uppercase mb-2 border-b-2 border-black truncate max-w-[150px]" title={char.name}>{char.name}</p>
          <p><span className="font-bold">Species:</span> {char.species}</p>
          <p><span className="font-bold">Gender:</span> {char.gender}</p>
          <p><span className="font-bold">Origin:</span> {char.origin?.name || "Unknown"}</p>
          <p><span className="font-bold">Dimension:</span> {char.location?.name || "Unknown"}</p>
          <p><span className="font-bold">Status:</span> {char.status}</p>
        </div>
      </div>

      {/* Requirement 2: Extra Information (Episodes) */}
      {isExpanded && (
        <div className="mt-2 pt-4 border-t-2 border-black border-dotted pb-6">
          <p className="font-bold text-[10px] uppercase mb-2">Latest episodes:</p>
          <ul className="space-y-3">
            {char.episodes?.map((ep, i) => (
              <li key={i} className="text-[10px] flex flex-col">
                <span className="font-black flex items-center gap-2">
                  <span className="w-2 h-2 bg-black rounded-full block"></span>
                  {ep.name}
                </span>
                <span className="text-[9px] text-zinc-500 ml-4 font-bold">{ep.air_date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Move the More/Less button to a fixed bottom corner but ensure it doesn't overlap star if card is small */}
      <div className="mt-auto flex justify-end">
        <button
          onClick={onExpand}
          className="text-zinc-900 font-bold uppercase text-[9px] hover:underline z-10"
        >
          {isExpanded ? "Less" : "More"}
        </button>
      </div>
    </div>
  );
}
