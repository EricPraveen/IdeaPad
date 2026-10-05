// Centralized Category System for IDEAPAD
// Single source of truth for navigation, filters, search, and editor categories

export const CATEGORIES = [
  { id: 'technology', name: 'Technology', icon: '⚡', desc: 'Computers, AI, engineering, and digital tools' },
  { id: 'culture',    name: 'Culture',    icon: '🏛️', desc: 'Books, art, philosophy, and society' },
  { id: 'opinion',    name: 'Opinion',    icon: '✒️', desc: 'Personal perspectives, commentary, and essays' },
  { id: 'lifestyle',  name: 'Lifestyle',  icon: '☕', desc: 'Daily habits, productivity, and modern living' },
  { id: 'travel',     name: 'Travel',     icon: '🗺️', desc: 'Stories from distant places, cities, and journeys' },
  { id: 'science',    name: 'Science',    icon: '🔬', desc: 'Discoveries, space, nature, and research' },
  { id: 'education',  name: 'Education',  icon: '📚', desc: 'Learning, teaching, universities, and skills' },
  { id: 'business',   name: 'Business',   icon: '💼', desc: 'Startups, leadership, economics, and markets' },
  { id: 'finance',    name: 'Finance',    icon: '🪙', desc: 'Money, investing, crypto, and economy' },
  { id: 'fiction',    name: 'Fiction',    icon: '📖', desc: 'Short stories, creative writing, and poetry' },
  { id: 'food',       name: 'Food',       icon: '🍲', desc: 'Cooking, recipes, restaurants, and food culture' },
  { id: 'health',     name: 'Health',     icon: '🌿', desc: 'Fitness, mental health, wellness, and medicine' },
  { id: 'gaming',     name: 'Gaming',     icon: '🎲', desc: 'Video games, design, and interactive media' },
]

export const CATEGORY_NAMES = CATEGORIES.map(c => c.name)

export const DEFAULT_CATEGORY = 'Technology'

export const getCategoryDetails = (name) => {
  return CATEGORIES.find(c => c.name.toLowerCase() === (name || '').toLowerCase()) || {
    id: 'general',
    name: name || 'General',
    icon: '📰',
    desc: 'Articles and essays on various topics'
  }
}
