import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPost, updatePost, getPostById } from '../services/postService'
import { useAuth } from '../context/AuthContext'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'

const genres = [
  'Technology', 'Travel', 'Food', 'Lifestyle',
  'Fiction', 'Opinion', 'Health', 'Finance',
  'Gaming', 'Culture', 'Sports', 'Else'
]

const ToolbarBtn = ({ onClick, active, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`px-2.5 py-1 text-xs font-mono rounded transition-all cursor-pointer border ${
      active
        ? 'bg-[#7A1C2E] text-[#FAF6EE] border-[#7A1C2E]'
        : 'bg-[#FAF6EE] text-[#3A3530] border-[#DDD2C1] hover:bg-[#EFE8DC] hover:text-[#7A1C2E]'
    }`}
  >
    {children}
  </button>
)

export default function WritePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const editId = searchParams.get('edit')

  const [form, setForm] = useState({
    title: '',
    genre: 'Technology',
    coverImage: '',
    status: 'published',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ underline: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({
        placeholder: 'Compose your dispatch upon the press...'
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[380px] leading-relaxed vintage-prose'
      }
    }
  })

  useEffect(() => {
    if (!user) navigate('/login')
    if (editId) loadPost()
  }, [])

  const loadPost = async () => {
    try {
      const data = await getPostById(editId)
      setForm({
        title: data.title,
        genre: data.genre || 'Technology',
        coverImage: data.coverImage || '',
        status: data.status || 'published'
      })
      if (editor && data.content) {
        editor.commands.setContent(data.content)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (editor && editId) loadPost()
  }, [editor])

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const getContent = useCallback(() => {
    return editor ? editor.getHTML() : ''
  }, [editor])

  // Word count & read time
  const metrics = useMemo(() => {
    if (!editor) return { words: 0, mins: 1 }
    const text = editor.getText() || ''
    const words = text.split(/\s+/).filter(Boolean).length
    const mins = Math.max(1, Math.round(words / 200))
    return { words, mins }
  }, [editor?.getText()])

  const handleSaveDraft = async () => {
    setLoading(true)
    setError('')
    try {
      const content = getContent()
      if (editId) {
        await updatePost(editId, { ...form, content, status: 'draft' })
      } else {
        await createPost({ ...form, content, status: 'draft' })
      }
      navigate('/profile')
    } catch {
      setError('Failed to save draft. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const content = getContent()
      if (!content || content === '<p></p>') {
        setError('Please write content for your dispatch before publishing.')
        setLoading(false)
        return
      }
      if (editId) {
        await updatePost(editId, { ...form, content, status: 'published' })
        navigate(`/post/${editId}`)
      } else {
        const res = await createPost({ ...form, content, status: 'published' })
        navigate(res && res.id ? `/post/${res.id}` : '/')
      }
    } catch {
      setError('Failed to publish post. Please check connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="paper-card p-6 sm:p-10 bg-[#FAF6EE] border-2 border-[#DDD2C1] shadow-lg">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-[#DDD2C1] mb-8">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#7A1C2E] mb-1">
              THE WRITER'S DESK
            </div>
            <h1 className="font-serif font-black text-2xl sm:text-4xl text-[#1A1A1A]">
              {editId ? 'Revise Dispatch' : 'Compose New Dispatch'}
            </h1>
            <p className="font-body italic text-xs sm:text-sm text-[#6B6358] mt-1">
              Draft your article for distribution across the Gazette readership.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="ink-btn-ghost text-xs py-1.5 px-3"
          >
            ← Back
          </button>
        </div>

        {error && (
          <div className="bg-[#FBF0F0] border border-[#7A1C2E] text-[#7A1C2E] p-4 rounded-md text-xs font-mono mb-6">
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="byline block mb-2">Headline</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="e.g. The Quiet Architecture of Timeless Prose…"
              className="w-full text-xl sm:text-2xl font-serif font-bold p-3 bg-[#FAF6EE] border border-[#DDD2C1] rounded-md focus:outline-none focus:border-[#7A1C2E] focus:ring-2 focus:ring-[#7A1C2E]/10"
            />
          </div>

          {/* Department & Cover Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="byline block mb-2">Editorial Department</label>
              <select
                name="genre"
                value={form.genre}
                onChange={handleChange}
                className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-md font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
              >
                {genres.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="byline block mb-2">Illustration / Cover Image URL</label>
              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-[#FAF6EE] border border-[#DDD2C1] rounded-md font-mono text-xs text-[#1A1A1A] focus:outline-none focus:border-[#7A1C2E]"
              />
            </div>
          </div>

          {/* Image Preview if provided */}
          {form.coverImage && (
            <div className="editorial-frame aspect-[21/9] max-h-48 overflow-hidden rounded border border-[#DDD2C1]">
              <img
                src={form.coverImage}
                alt="Cover Preview"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          {/* TipTap Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="byline">Prose Composition</label>
              <span className="text-[11px] font-mono text-[#8F8679]">
                {metrics.words} words · ~{metrics.mins} min read
              </span>
            </div>

            {/* Vintage Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-[#EFE8DC] border border-[#DDD2C1] rounded-t-md">
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold">
                <b>B</b>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic">
                <i>I</i>
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline">
                <u>U</u>
              </ToolbarBtn>

              <span className="w-px h-5 bg-[#DDD2C1] mx-1"></span>

              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">
                H2
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">
                H3
              </ToolbarBtn>

              <span className="w-px h-5 bg-[#DDD2C1] mx-1"></span>

              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet List">
                • List
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Ordered List">
                1. List
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Blockquote">
                “ Quote
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive('codeBlock')} title="Code block">
                &lt;/&gt;
              </ToolbarBtn>

              <span className="w-px h-5 bg-[#DDD2C1] mx-1"></span>

              <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} title="Undo">
                ↺
              </ToolbarBtn>
              <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} title="Redo">
                ↻
              </ToolbarBtn>
            </div>

            {/* Editor Canvas */}
            <div
              className="border border-t-0 border-[#DDD2C1] rounded-b-md p-6 bg-[#FAF6EE] min-h-[380px] cursor-text"
              onClick={() => editor?.commands.focus()}
            >
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#DDD2C1] flex items-center justify-between flex-wrap gap-4">
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="ink-btn-ghost text-xs py-2.5 px-5"
            >
              Save as Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="stamp-btn text-xs py-2.5 px-7"
            >
              {loading ? 'Submitting to Press…' : editId ? '✦ Update Dispatch' : '✦ Publish to Gazette'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}
