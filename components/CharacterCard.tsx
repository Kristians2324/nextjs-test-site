"use client";

export default function CharacterCard({ char, isFavorite, toggleFav, isExpanded, onExpand }: any) {
  // Guard clause to prevent the "Cannot read properties of undefined" error
  if (!char) return null;

  // Requirement 2: Sort 3 latest episodes from most recent to oldest
  const episodes = char.episode ? [...char.episode].reverse().slice(0, 3) : [];

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
          
          <button onClick={onExpand} className="mt-2 text-blue-700 font-bold underline uppercase text-[9px] block">
            {isExpanded ? "Less" : "More"}
          </button>
        </div>
      </div>

      {/* Requirement 2: Extra Information (Episodes) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t-2 border-black border-dotted">
          <p className="font-bold text-[10px] uppercase mb-2">Latest Episodes (Sorted):</p>
          <ul className="space-y-1">
            {episodes.map((ep: string, i: number) => (
              <li key={i} className="text-[10px] bg-zinc-50 p-1 border border-zinc-200">
                • Episode ID: {ep.split('/').pop()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}