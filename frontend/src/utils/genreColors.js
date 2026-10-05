// Editorial genre and category badge styling
// Muted newspaper ink & warm tone labels

export const genreColors = {
  'Technology': 'genre-label genre-Technology',
  'Culture':    'genre-label genre-Culture',
  'Opinion':    'genre-label genre-Opinion',
  'Lifestyle':  'genre-label genre-Lifestyle',
  'Travel':     'genre-label genre-Travel',
  'Science':    'genre-label genre-Science',
  'Education':  'genre-label genre-Education',
  'Business':   'genre-label genre-Business',
  'Finance':    'genre-label genre-Finance',
  'Fiction':    'genre-label genre-Fiction',
  'Food':       'genre-label genre-Food',
  'Health':     'genre-label genre-Health',
  'Gaming':     'genre-label genre-Gaming',
  'All':        'genre-label genre-All',
  'default':    'genre-label genre-default'
}

export const getGenreColor = (genre) => {
  return genreColors[genre] || genreColors['default']
}
