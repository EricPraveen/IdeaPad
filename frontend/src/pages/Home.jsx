import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BlogCard from '../components/BlogCard'
import GenreFilter from '../components/GenreFilter'
import SearchBar from '../components/SearchBar'
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

const CATEGORY_CARDS = [
  { name: 'Technology', icon: '⚡', desc: 'Computing, artificial intellect, tools of tomorrow' },
  { name: 'Opinion', icon: '✒️', desc: 'Provocative perspectives and commentary on the state of affairs' },
  { name: 'Culture', icon: '🏛️', desc: 'Literature, philosophy, aesthetics, and social currents' },
  { name: 'Lifestyle', icon: '☕', desc: 'Habits, design, wellness, and the art of deliberate living' },
  { name: 'Travel', icon: '🗺️', desc: 'Dispatches from distant roads, railways, and forgotten cities' },
  { name: 'Fiction', icon: '📖', desc: 'Original tales, short narratives, and prose reveries' }
]

export default function Home() {
  const { user } = useAuth()
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
      alert('No posts available to retrieve!')
    }
  }

  // 1. Hero Story: First featured or first post with cover image
  const heroStory = useMemo(() => {
    if (featured.length > 0) return featured[0]
    return posts.find(p => p.coverImage) || posts[0] || null
  }, [featured, posts])

  // 2. Trending Articles: sorted by likes
  const trendingArticles = useMemo(() => {
    const sorted = [...posts].sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
    return sorted.filter(p => heroStory ? p.id !== heroStory.id : true).slice(0, 4)
  }, [posts, heroStory])

  // 3. Editor's Picks
  const editorsPicks = useMemo(() => {
    if (featured.length > 1) {
      return featured.slice(1, 3)
    }
    return posts.filter(p => p.isFeatured && (!heroStory || p.id !== heroStory.id)).slice(0, 2)
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

      {/* ─── PRESS WIRE TICKER ─────────────────────────────── */}
      <div className="bg-[#1A1A1A] text-[#FAF6EE] py-2 px-4 sm:px-8 overflow-hidden border-b border-[#3A3530]">
        <div className="max-w-7xl mx-auto flex items-center">
          <span className="shrink-0 bg-[#7A1C2E] text-[#FAF6EE] px-2.5 py-0.5 text-[10px] uppercase font-mono tracking-widest rounded mr-4">
            PRESS WIRE
          </span>
          <div className="overflow-hidden flex-1">
            <span className="ticker-text text-xs font-mono text-[#C8B89A]">
              {posts.length > 0
                ? posts.slice(0, 6).map(p => p.title).join('   ·   ') + '   ·   Welcome to IdeaPad — The Independent Voice of Ideas   ·   '
                : 'Welcome to IdeaPad — The Independent Voice of Ideas · Devoted to the Written Word · '}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">

        {/* ─── BROADSHEET WELCOME HEADER ─────────────────────── */}
        <div className="text-center py-6 border-b-2 border-[#1A1A1A] relative">
          <div className="flex items-center justify-between text-xs font-mono text-[#8F8679] mb-2 px-2">
            <span>THE MORNING GAZETTE</span>
            <span>NO. 142</span>
          </div>
          
          <h2 className="font-serif font-black text-3xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight">
            The Daily IdeaPad
          </h2>
          
          <p className="font-body italic text-sm sm:text-base text-[#6B6358] mt-2 max-w-2xl mx-auto">
            Essays, field investigations, and literary dispatches published for the curious and discerning.
          </p>

          <div className="flex items-center justify-center gap-4 mt-5">
            <button
              onClick={handleSurpriseMe}
              className="ink-btn-ghost text-xs py-1.5 px-4 rounded-full flex items-center gap-1.5"
            >
              <span>🎲</span> Surprise Me With an Article
            </button>
            <Link
              to="/write"
              className="stamp-btn text-xs py-1.5 px-4"
            >
              <span>🖋</span> Submit a Story
            </Link>
          </div>
        </div>

        {/* ─── 1. HERO FEATURED STORY ────────────────────────── */}
        {heroStory && (
          <section className="fade-in">
            <div className="section-header">LEAD DISPATCH OF THE DAY</div>
            <BlogCard post={heroStory} variant="hero" />
          </section>
        )}

        {/* ─── 2. TRENDING ARTICLES (01, 02, 03, 04) ──────────── */}
        {trendingArticles.length > 0 && (
          <section>
            <div className="section-header">MOST ENGAGED &amp; DISCUSSED</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingArticles.map((post, idx) => (
                <div
                  key={post.id}
                  className="paper-card p-5 flex flex-col justify-between group transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-serif font-black text-2xl text-[#C5A059] opacity-90">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#7A1C2E] border border-[#7A1C2E] px-1.5 py-0.5 rounded">
                        Trending
                      </span>
                    </div>

                    <Link to={`/post/${post.id}`}>
                      <h3 className="font-serif font-bold text-lg text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors leading-snug line-clamp-3 mb-2">
                        {post.title}
                      </h3>
                    </Link>

                    <p className="font-body text-xs text-[#6B6358] line-clamp-2 mb-4">
                      {post.content?.replace(/<[^>]+>/g, '') || ''}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#DDD2C1] flex items-center justify-between text-xs font-mono text-[#8F8679]">
                    <span className="truncate max-w-[120px]">
                      By {post.isAnonymous ? 'Anonymous' : post.authorName}
                    </span>
                    <span>♥ {post.likeCount || 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── 3. EDITOR'S PICKS ─────────────────────────────── */}
        {editorsPicks.length > 0 && (
          <section className="bg-[#FAF6EE] p-6 lg:p-8 rounded-lg border border-[#DDD2C1] shadow-xs">
            <div className="section-header">EDITOR-IN-CHIEF'S CURATION</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {editorsPicks.map(post => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        {/* ─── 4. POPULAR CATEGORIES ─────────────────────────── */}
        <section>
          <div className="section-header">EXPLORE BY EDITORIAL DESK</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {CATEGORY_CARDS.map(cat => (
              <button
                key={cat.name}
                onClick={() => handleGenreSelect(cat.name)}
                className="paper-card p-4 text-left group hover:border-[#7A1C2E] transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <span className="text-2xl block mb-2">{cat.icon}</span>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors">
                    {cat.name}
                  </h4>
                </div>
                <p className="text-[11px] font-body text-[#8F8679] line-clamp-2 mt-2 leading-tight">
                  {cat.desc}
                </p>
              </button>
            ))}
          </div>
        </section>

        {/* ─── 5. LATEST STORIES (DISPATCH ARCHIVE) ──────────── */}
        <section>
          <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
            <div className="section-header mb-0 flex-1">
              {selectedGenre === 'All' ? 'THE DISPATCH ARCHIVE' : `${selectedGenre.toUpperCase()} DEPARTMENT`}
            </div>
            <span className="text-xs font-mono text-[#8F8679]">
              {posts.length} {posts.length === 1 ? 'Dispatch' : 'Dispatches'} on Record
            </span>
          </div>

          <SearchBar onSearch={handleSearch} />
          <GenreFilter selected={selectedGenre} onSelect={handleGenreSelect} />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#DDD2C1] border-t-[#7A1C2E] rounded-full animate-spin mb-4"></div>
              <p className="font-mono text-xs text-[#8F8679]">Setting the metal type for the press…</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="paper-card p-12 text-center max-w-md mx-auto my-8">
              <span className="text-4xl block mb-3 opacity-60">📰</span>
              <h3 className="font-serif font-bold text-xl text-[#1A1A1A] mb-1">
                No dispatches found
              </h3>
              <p className="font-body text-xs text-[#6B6358] mb-4">
                We could not locate any reports matching your search query or selected department.
              </p>
              <button
                onClick={() => { setSelectedGenre('All'); loadPosts(); }}
                className="ink-btn-ghost text-xs py-1.5 px-4"
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

        {/* ─── 6. RECOMMENDED AUTHORS (CORRESPONDENTS GUILD) ──── */}
        <section id="authors-section" className="pt-4">
          <div className="section-header">CORRESPONDENTS &amp; AUTHORS GUILD</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {recommendedAuthors.length > 0 ? (
              recommendedAuthors.map(author => (
                <Link
                  key={author.id}
                  to={`/user/${author.id}`}
                  className="paper-card p-4 text-center group hover:border-[#7A1C2E] transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-[#EFE8DC] border border-[#C5A059] flex items-center justify-center font-serif font-bold text-lg text-[#7A1C2E] mx-auto mb-2.5 group-hover:scale-105 transition-transform">
                    {author.name.charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] group-hover:text-[#7A1C2E] transition-colors truncate">
                    {author.name}
                  </h4>
                  <p className="text-[10px] font-mono text-[#8F8679] mt-0.5">
                    {author.count} {author.count === 1 ? 'Dispatch' : 'Dispatches'}
                  </p>
                </Link>
              ))
            ) : (
              <div className="col-span-full paper-card p-6 text-center text-xs text-[#8F8679] font-mono">
                Authors will appear as new dispatches are published.
              </div>
            )}
          </div>
        </section>

        {/* ─── 7. QUOTE OF THE DAY ───────────────────────────── */}
        <section className="my-12 py-10 px-6 paper-subtle text-center rounded-lg relative overflow-hidden border-2 border-[#DDD2C1]">
          <span className="font-serif text-6xl text-[#C5A059]/40 absolute top-2 left-6 select-none">
            “
          </span>
          <div className="max-w-2xl mx-auto relative z-10">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A1C2E] block mb-3">
              LITERARY REFLECTION OF THE DAY
            </span>
            <blockquote className="font-serif italic text-xl sm:text-2xl text-[#1A1A1A] leading-relaxed mb-4">
              "{quote.text}"
            </blockquote>
            <cite className="font-mono text-xs text-[#6B6358] tracking-widest uppercase not-italic">
              — {quote.author}
            </cite>
          </div>
        </section>

      </div>
    </div>
  )
}
