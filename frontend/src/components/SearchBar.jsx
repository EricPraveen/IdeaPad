import { useState } from 'react'

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        onSearch(query)
    }

    return (
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
                {/* Magnifying glass icon */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B08968]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                </span>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search the archive..."
                    className="ink-input w-full pl-9 text-sm"
                />
            </div>
            <button type="submit" className="ink-btn text-xs px-5">
                Search
            </button>
        </form>
    )
}