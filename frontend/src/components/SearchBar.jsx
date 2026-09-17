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
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8F8679] text-sm">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search through headlines, articles, and topics..."
          className="ink-input w-full pl-10 pr-9 text-sm"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8F8679] hover:text-[#7A1C2E]"
          >
            ✕
          </button>
        )}
      </div>
      <button type="submit" className="ink-btn text-xs px-5 py-2.5">
        Filter Archive
      </button>
    </form>
  )
}
