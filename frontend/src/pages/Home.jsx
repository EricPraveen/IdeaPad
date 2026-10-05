import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import BlogCard from '../components/BlogCard'
import GenreFilter from '../components/GenreFilter'
import SearchBar from '../components/SearchBar'
import { CATEGORIES } from '../constants/categories'
import {
  getAllPosts,
  getPostsByGenre,
  searchPosts,
  getRandomPost,
  getFeaturedPosts
} from '../services/postService'

const QUOTES = [
  { text: "The pen is mightier than the sword, and much easier to write with.", author: "Marty Feldman" },
  { text: "A writer only begins a book. A reader finishes it.", author: "Samuel Johnson" },
  { text: "You can't use up creativity. The more you use, the more you have.", author: "Maya Angelou" },
  { text: "There is no greater agony than bearing an untold story inside you.", author: "Maya Angelou" },
  { text: "Start writing, no matter what. The water does not flow until the faucet is turned on.", author: "Louis L'Amour" },
  { text: "Ideas are like rabbits. You get a couple and learn how to look after them, and pretty soon you have a dozen.", author: "John Steinbeck" }
]

export default function Home() {
  const [posts, setPosts] = useState([])
  const [featured, setFeatured] = useState([])
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  useEffect(() => {
    const genre = searchParams.get('genre')
    const q = searchParams.get('q')
    if (q) {
      handleSearch(q)
    } else if (genre) {
      setSelectedGenre(genre)
      handleGenreSelect(genre)
    } else {
      loadPosts()
    }
    loadFeatured()
  }, [searchParams])

  const loadPosts = async () => {
    try {
      const data = await getAllPosts()
      setPosts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadFeatured = async () => {
    try {
      const data = await getFeaturedPosts()
      setFeatured(data || [])
    } catch (err) {
      console.error(err)
    }
  }

  const handleGenreSelect = async (genre) => {
    setSelectedGenre(genre)
    setLoading(true)
    try {
      const data = genre === 'All' ? await getAllPosts() : await getPostsByGenre(genre)
      setPosts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query) => {
    if (!query) return loadPosts()
    setLoading(true)
    try {
      const data = await searchPosts(query)
      setPosts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSurpriseMe = async () => {
    try {
      const post = await getRandomPost()
      navigate(`/post/${post.id}`)
    } catch {
      alert('No articles available to retrieve!')
    }
  }

  // 1. Lead Story: First featured or first post with cover image
  const heroStory = useMemo(() => {
    if (featured.length > 0) return featured[0]
    return posts.find(p => p.coverImage) || posts[0] || null
  }, [featured, posts])

  // 2. Trending Articles: sorted by likes
  const trendingArticles = useMemo(() => {
    const sorted = [...posts].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    return sorted.filter(p => heroStory ? p.id !== heroStory.id : true).slice(0, 4)
  }, [posts, heroStory])

  // 3. Secondary Featured Curations (Newspaper Columns)
  const secondaryStories = useMemo(() => {
    const pool = featured.length > 1 ? featured.slice(1) : posts.filter(p => heroStory ? p.id !== heroStory.id : true)
    return pool.slice(0, 2)
  }, [featured, posts, heroStory])

  // 4. Recommended Authors: extracted from active posts
  const recommendedAuthors = useMemo(() => {
    const authorsMap = new Map()
    posts.forEach(p => {
      if (p.authorId && p.authorName && !p.isAnonymous) {
        if (!authorsMap.has(p.authorId)) {
          authorsMap.set(p.authorId, {
            id: p.authorId,
            name: p.authorName,
            count: 1
          })
        } else {
          authorsMap.get(p.authorId).count += 1
        }
      }
    })
    return Array.from(authorsMap.values()).slice(0, 6)
  }, [posts])

  return (
    <div className="w-full">

      {/* ─── NEWS TICKER ───────────────────────────────────── */}
      <div className="bg-[#141311] text-[#FAF6EE] py-2 px-4 sm:px-8 overflow-hidden border-b border-[#282521]">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="shrink-0 bg-[var(--accent-primary)] text-[var(--text-on-accent)] px-2.5 py-0.5 text-[9px] uppercase font-mono tracking-widest rounded-xs mr-4 font-bold">
            LATEST
          </span>
          <div className="overflow-hidden flex-1">
            <span className="ticker-text text-xs font-mono text-[#C4B59F]">
              {posts.length > 0
                ? posts.slice(0, 6).map(p => p.title).join('   ·   ') + '   ·   IDEAPAD — A Place for Ideas Worth Publishing   ·   '
                : 'Welcome to IDEAPAD — A Place for Ideas Worth Publishing · Join and share your thoughts · '}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ─── BROADSHEET WELCOME HEADER ─────────────────────── */}
        <div className="text-center py-6 border-b-2 border-[#161412] relative">
          <div className="flex items-center justify-between text-xs font-mono text-[#8E857B] mb-2 px-2">
            <span>DAILY EDITION</span>
            <span>ISSUE NO. 142</span>
          </div>
          
          <h1 className="font-serif font-black text-4xl sm:text-6xl lg:text-7xl text-[#161412] tracking-tight">
            The Daily IDEAPAD
          </h1>
          
          <p className="font-body italic text-sm sm:text-base text-[#5C554D] mt-2 max-w-2xl mx-auto">
            Articles, personal essays, and independent ideas published by writers around the world.
          </p>

          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={handleSurpriseMe}
              className="editorial-btn-secondary text-xs py-2 px-4 flex items-center gap-2"
            >
              <span>🎲</span> Random Article
            </button>
            <Link
              to="/write"
              className="editorial-btn-primary text-xs py-2 px-4"
            >
              <span>✍</span> Write an Article
            </Link>
          </div>
        </div>

        {/* ─── 1. FEATURED ARTICLE ───────────────────────────── */}
        {heroStory && (
          <section className="fade-in">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1] mb-4">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
                FEATURED ARTICLE
              </span>
              <span className="text-[10px] font-mono text-[#8E857B]">
                EDITOR'S PICK
              </span>
            </div>
            <BlogCard post={heroStory} variant="hero" />
          </section>
        )}

        {/* ─── 2. NEWSPAPER COLUMNS & MOST POPULAR ───────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-b border-[#DDD2C1] py-8">
          
          {/* Curated Stories Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1]">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
                CURATED STORIES
              </span>
              <span className="text-[10px] font-mono text-[#8E857B]">RECOMMENDED</span>
            </div>

            {secondaryStories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secondaryStories.map(story => (
                  <BlogCard key={story.id} post={story} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-xs font-mono text-[#8E857B] bg-[#FAF6EE] border border-[#DDD2C1]">
                Recommended articles will appear here.
              </div>
            )}
          </div>

          {/* Most Popular (01, 02, 03, 04) */}
          <div className="lg:col-span-5 lg:border-l lg:border-[#DDD2C1] lg:pl-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1]">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
                MOST POPULAR
              </span>
              <span className="text-[10px] font-mono text-[#A67C48]">TOP READS</span>
            </div>

            <div className="divide-y divide-[#DDD2C1]">
              {trendingArticles.map((post, idx) => (
                <div key={post.id} className="py-3.5 flex items-start gap-4 group">
                  <span className="font-serif font-black text-2xl text-[#A67C48] leading-none shrink-0 w-7">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono uppercase text-[var(--accent-primary)]">
                        {post.genre || 'General'}
                      </span>
                      <span className="text-[10px] font-mono text-[#8E857B]">
                        · ♥ {post.likeCount || 0}
                      </span>
                    </div>
                    <Link to={`/post/${post.id}`}>
                      <h4 className="font-serif font-bold text-sm text-[#161412] group-hover:text-[var(--accent-primary)] transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </h4>
                    </Link>
                    <span className="text-[11px] font-mono text-[#8E857B] block mt-1">
                      By {post.isAnonymous ? 'Anonymous' : post.authorName}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* ─── 3. EXPLORE BY CATEGORY ────────────────────────── */}
        <section>
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1] mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
              EXPLORE BY CATEGORY
            </span>
            <span className="text-[10px] font-mono text-[#8E857B]">
              {CATEGORIES.length} TOPICS
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.slice(0, 6).map(cat => (
              <button
                key={cat.name}
                onClick={() => handleGenreSelect(cat.name)}
                className="p-4 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-left group hover:border-[#7A1C2E] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-xl block mb-2">{cat.icon}</span>
                  <h4 className="font-serif font-bold text-sm text-[#161412] group-hover:text-[var(--accent-primary)] transition-colors">
                    {cat.name}
                  </h4>
                </div>
                <p className="text-[11px] font-body text-[#6E665D] line-clamp-2 mt-2 leading-tight">
                  {cat.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ─── 4. LATEST ARTICLES ────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4 pb-2 border-b border-[#DDD2C1]">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
              {selectedGenre === 'All' ? 'LATEST ARTICLES' : `${selectedGenre.toUpperCase()} ARTICLES`}
            </span>
            <span className="text-xs font-mono text-[#8E857B]">
              {posts.length} {posts.length === 1 ? 'Article' : 'Articles'}
            </span>
          </div>

          <SearchBar onSearch={handleSearch} />
          <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-3"></div>
              <p className="font-mono text-xs text-[#8E857B]">Loading articles…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center max-w-md mx-auto my-8 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs">
              <span className="text-4xl block mb-3 opacity-60">📰</span>
              <h3 className="font-serif font-bold text-xl text-[#161412] mb-1">
                No articles found
              </h3>
              <p className="font-body text-xs text-[#5C554D] mb-4">
                We could not find any articles matching your search query or selected category.
              </p>
              <button
                onClick={() => { setSelectedGenre('All'); loadPosts(); }}
                className="editorial-btn-secondary text-xs py-1.5 px-4"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map(post => (
                <BlogCard
                  key={post.id}
                  post={post}
                  onDelete={(id) => setPosts(prev => prev.filter(p => String(p.id) !== String(id)))}
                />
              ))}
            </div>
          )}
        </section>

        {/* ─── 5. WRITERS & AUTHORS ──────────────────────────── */}
        <section id="authors-section" className="pt-4 border-t border-[#DDD2C1]">
          <div className="flex items-center justify-between pb-2 border-b border-[#DDD2C1] mb-5">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-primary)] font-semibold">
              FEATURED AUTHORS &amp; WRITERS
            </span>
            <span className="text-[10px] font-mono text-[#8E857B]">COMMUNITY</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {recommendedAuthors.length > 0 ? (
              recommendedAuthors.map(author => (
                <Link
                  key={author.id}
                  to={`/user/${author.id}`}
                  className="p-4 bg-[#FAF6EE] border border-[#DDD2C1] rounded-xs text-center group hover:border-[#7A1C2E] transition-all"
                >
                  <div className="w-11 h-11 rounded-xs bg-[#EFE8DC] border border-[#DDD2C1] flex items-center justify-center font-serif font-bold text-base text-[var(--accent-primary)] mx-auto mb-2.5 group-hover:scale-105 transition-transform">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#161412] group-hover:text-[var(--accent-primary)] transition-colors truncate">
                    {author.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#8E857B] mt-0.5">
                    {author.count} {author.count === 1 ? 'Article' : 'Articles'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-full p-6 text-center text-xs text-[#8E857B] font-mono bg-[#FAF6EE] border border-[#DDD2C1]">
                Authors will appear as new articles are published.
              </div>
            )}
          </div>
        </section>

        {/* ─── 6. QUOTE OF THE DAY ───────────────────────────── */}
        <section className="my-10 py-8 px-6 bg-[#FAF6EE] text-center border border-[#DDD2C1] rounded-xs relative">
          <div className="max-w-2xl mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-[0.24em] text-[var(--accent-primary)] block mb-2 font-semibold">
              QUOTE OF THE DAY
            </span>
            <blockquote className="font-serif italic text-lg sm:text-2xl text-[#161412] leading-relaxed mb-3">
              "{quote.text}"
            </blockquote>
            <cite className="font-mono text-xs text-[#5C554D] tracking-widest uppercase not-italic">
              — {quote.author}
            </cite>
          </div>
        </section>

      </div>
    </div>
  )
}
