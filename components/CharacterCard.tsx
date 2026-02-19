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
    <div className="bg-white border-2 border-black p-4 flex flex-col relative shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono text-black">
      {/* Requirement 3: Favorite Star */}
      <button onClick={() => toggleFav(char.id)} className="absolute top-2 right-2 text-2xl">
        {isFavorite ? "⭐" : "☆"}
      </button>

      <div className="flex gap-4">
        {/* Requirement 1: Character Information Fields */}
        <div className="w-32 h-32 border-2 border-black flex-shrink-0 bg-zinc-200">
          <img
            src={char.image}
            alt={char.name}
            className={`w-full h-full object-cover ${char.status === 'Dead' ? 'grayscale' : ''}`}
          />
        </div>

        <div className="flex-1 text-[11px] space-y-1">
          <p className="text-sm font-black uppercase mb-2 border-b-2 border-black">{char.name}</p>
          <p><span className="font-bold">Species:</span> {char.species}</p>
          <p><span className="font-bold">Gender:</span> {char.gender}</p>
          <p><span className="font-bold">Origin:</span> {char.origin?.name || "Unknown"}</p>
          <p><span className="font-bold">Dimension:</span> {char.location?.name || "Unknown"}</p>
          <p><span className="font-bold">Status:</span> {char.status}</p>
        </div>
      </div>

      {/* Requirement 2: Extra Information (Episodes) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-black border-dotted">
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

      <button onClick={onExpand} className="absolute bottom-2 right-2 text-zinc-900 font-bold uppercase text-[9px] hover:underline">
        {isExpanded ? "Less" : "More"}
      </button>
    </div>
  );
}