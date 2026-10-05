import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2 mb-6">
      <div className="flex-1 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E857B] text-xs">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search through headlines, articles, or author names..."
          className="w-full pl-9 pr-8 py-2 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-xs sm:text-sm font-body text-[#161412] focus:outline-none focus:border-[#7A1C2E] placeholder:font-mono placeholder:text-[#8E857B]"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8E857B] hover:text-[#7A1C2E] cursor-pointer"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="editorial-btn-neutral text-xs py-2 px-4 shrink-0">
        Filter Archive
      </button>
    </form>
  )
}
