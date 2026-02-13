export default async function RickAndMortyPage() {
  const res = await fetch("https://rickandmortyapi.com/api/character");
  const data = await res.json();
  const characters = data.results;

  return (
    <main className="p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center font-mono">Rick and Morty Cast</h1>
      
      {/* Centered grid with better spacing */}
      <div className="flex flex-wrap justify-center gap-8">
        {characters.map((character: any) => (
          <div key={character.id} className="w-64 border border-gray-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-md bg-white dark:bg-zinc-900 transition-transform hover:scale-105">
            <div className="aspect-square overflow-hidden">
              <img 
                src={character.image} 
                alt={character.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="text-lg font-bold truncate">{character.name}</h2>
              <div className="mt-2 text-sm opacity-70">
                <p>• {character.species}</p>
                <p>• {character.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}