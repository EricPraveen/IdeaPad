const genres = [
    'All', 'Technology', 'Travel', 'Food',
    'Lifestyle', 'Fiction', 'Opinion',
    'Health', 'Finance', 'Gaming', 'Culture', 'Else'
]

export default function GenreFilter({ selected, onSelect }) {
    return (
        <div className="flex gap-2 flex-wrap mb-6">
            {genres.map(genre => (
                <button
                    key={genre}
                    onClick={() => onSelect(genre)}
                    className="genre-label transition-all duration-200"
                    style={{
                        fontFamily: "'Special Elite', monospace",
                        color: selected === genre ? '#FAF6EE' : '#8B5A2B',
                        background: selected === genre ? '#7A2E2E' : 'transparent',
                        borderColor: selected === genre ? '#7A2E2E' : '#8B5A2B',
                        transform: selected === genre ? 'none' : undefined,
                        padding: '0.25rem 0.85rem',
                        fontSize: '0.68rem',
                        letterSpacing: '0.14em',
                    }}
                >
                    {genre.toUpperCase()}
                </button>
            ))}
        </div>
    )
}