// Vintage newspaper genre color map
// Returns CSS classes — sepia/warm ink tones
export const genreColors = {
    'Technology': 'genre-label genre-Technology',
    'Travel':     'genre-label genre-Travel',
    'Food':       'genre-label genre-Food',
    'Lifestyle':  'genre-label genre-Lifestyle',
    'Fiction':    'genre-label genre-Fiction',
    'Opinion':    'genre-label genre-Opinion',
    'Health':     'genre-label genre-Health',
    'Finance':    'genre-label genre-Finance',
    'Gaming':     'genre-label genre-Gaming',
    'Culture':    'genre-label genre-Culture',
    'Else':       'genre-label genre-Else',
    'default':    'genre-label genre-Else'
}

export const getGenreColor = (genre) => {
    return genreColors[genre] || genreColors['default']
}
