const genres = [
  'All', 'Technology', 'Travel', 'Food',
  'Lifestyle', 'Fiction', 'Opinion',
  'Health', 'Finance', 'Gaming', 'Culture', 'Else'
]

export default function GenreFilter({ selected, onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-6">
      <span className="text-[11px] font-mono uppercase tracking-widest text-[#8F8679] shrink-0 mr-1">
        Desk:
      </span>
      {genres.map(genre => {
        const isSelected = selected === genre
        return (
          <button
            key={genre}
            onClick={() => onSelect(genre)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer border ${
              isSelected
                ? 'bg-[#7A1C2E] text-[#FAF6EE] border-[#7A1C2E] shadow-sm font-bold scale-[1.02]'
                : 'bg-[#FAF6EE] text-[#3A3530] border-[#DDD2C1] hover:border-[#7A1C2E] hover:text-[#7A1C2E]'
            }`}
          >
            {genre}
          </button>
        )
      })}
    </div>
  )
}
