import { CATEGORIES } from '../constants/categories'

export default function GenreFilter({ selected, onSelect }) {
  const allDesks = [{ id: 'all', name: 'All' }, ...CATEGORIES]

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-6 border-b border-[#DDD2C1] pt-1">
      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#8E857B] shrink-0 mr-2">
        Desks:
      </span>
      {allDesks.map(cat => {
        const isSelected = selected === cat.name
        return (
          <button
            key={cat.name}
            onClick={() => onSelect(cat.name)}
            className={`shrink-0 px-3 py-1 text-xs font-mono uppercase tracking-wider transition-all duration-150 cursor-pointer border-b-2 ${
              isSelected
                ? 'border-[#7A1C2E] text-[#7A1C2E] font-bold bg-[#EFE8DC]/50'
                : 'border-transparent text-[#5C554D] hover:text-[#161412] hover:border-[#C4B59F]'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}
