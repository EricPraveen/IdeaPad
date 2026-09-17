import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
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

// Vintage toolbar button
const ToolbarButton = ({ onClick, active, title, children }) => (
    <button
        type="button"
        onClick={onClick}
        title={title}
        className="text-xs px-2 py-1 transition-all"
        style={{
            fontFamily: "'Special Elite', monospace",
            background: active ? '#1F1B16' : 'transparent',
            color: active ? '#F5EAD7' : '#8B5A2B',
            border: `1px solid ${active ? '#1F1B16' : '#C8B89A'}`,
            borderRadius: '1px',
            cursor: 'pointer',
        }}
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
                placeholder: 'Begin your dispatch here…'
            })
        ],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none min-h-[340px] leading-relaxed vintage-prose'
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
            setForm({ title: data.title, genre: data.genre, status: data.status })
            if (editor && data.content) {
                editor.commands.setContent(data.content)
            }
        } catch (err) { console.error(err) }
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

    const handleSaveDraft = async () => {
        setLoading(true)
        try {
            const content = getContent()
            if (editId) {
                await updatePost(editId, { ...form, content, status: 'draft' })
            } else {
                await createPost({ ...form, content, status: 'draft' })
            }
            navigate('/')
        } catch {
            setError('Failed to save draft. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            const content = getContent()
            if (editId) {
                await updatePost(editId, { ...form, content })
            } else {
                await createPost({ ...form, content })
            }
            navigate('/')
        } catch {
            setError('Failed to publish post. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 md:px-6 py-10 w-full">
                <div className="paper-card p-6 md:p-10 ink-reveal">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-8">
                        <div>
                            <div className="vintage-rule-double mb-4" style={{ maxWidth: '200px' }}></div>
                            <h1
                                className="text-3xl font-black text-[#1F1B16]"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                {editId ? 'Edit Your Dispatch' : 'Write a New Dispatch'}
                            </h1>
                            <p className="byline mt-1">Compose your article for the press</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="ink-btn-ghost text-xs px-3 py-2"
                        >
                            ← Back
                        </button>
                    </div>

                    {error && (
                        <div className="border border-[#7A2E2E] bg-[#FBF0F0] text-[#7A2E2E] p-4 mb-6 text-sm flex items-center gap-3">
                            <span>⚠</span>
                            <span style={{ fontFamily: "'IBM Plex Serif', serif" }}>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                        {/* Title */}
                        <div>
                            <label className="byline block mb-2">Headline</label>
                            <input
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                                placeholder="Enter a captivating headline…"
                                className="ink-input w-full text-lg"
                                style={{ fontFamily: "'Playfair Display', serif", fontWeight: '700' }}
                            />
                        </div>

                        {/* Genre */}
                        <div>
                            <label className="byline block mb-2">Section / Genre</label>
                            <select
                                name="genre"
                                value={form.genre}
                                onChange={handleChange}
                                className="ink-select w-full max-w-xs"
                            >
                                {genres.map(g => (
                                    <option key={g} value={g}>{g}</option>
                                ))}
                            </select>
                        </div>

                        {/* TipTap Editor — vintage typewriter style */}
                        <div>
                            <label className="byline block mb-2">Article Body</label>

                            {/* Vintage toolbar */}
                            <div
                                className="flex flex-wrap gap-1 p-2 border border-[#C8B89A] border-b-0"
                                style={{ background: '#EADCC5' }}
                            >
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive('bold')} title="Bold">
                                    <b>B</b>
                                </ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive('italic')} title="Italic">
                                    <i>I</i>
                                </ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive('underline')} title="Underline">
                                    <u>U</u>
                                </ToolbarButton>

                                <span className="w-px bg-[#C8B89A] mx-1 self-stretch"></span>

                                <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive('heading', { level: 1 })} title="Heading 1">H1</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} active={editor?.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>

                                <span className="w-px bg-[#C8B89A] mx-1 self-stretch"></span>

                                <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive('bulletList')} title="Bullet List">• List</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive('orderedList')} title="Ordered List">1. List</ToolbarButton>

                                <span className="w-px bg-[#C8B89A] mx-1 self-stretch"></span>

                                <ToolbarButton onClick={() => editor?.chain().focus().toggleBlockquote().run()} active={editor?.isActive('blockquote')} title="Quote">❝ Quote</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().toggleCodeBlock().run()} active={editor?.isActive('codeBlock')} title="Code">&lt;/&gt;</ToolbarButton>

                                <span className="w-px bg-[#C8B89A] mx-1 self-stretch"></span>

                                <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('left').run()} active={editor?.isActive({ textAlign: 'left' })} title="Left">←</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('center').run()} active={editor?.isActive({ textAlign: 'center' })} title="Center">↔</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().setTextAlign('right').run()} active={editor?.isActive({ textAlign: 'right' })} title="Right">→</ToolbarButton>

                                <span className="w-px bg-[#C8B89A] mx-1 self-stretch"></span>

                                <ToolbarButton onClick={() => editor?.chain().focus().undo().run()} title="Undo">↩</ToolbarButton>
                                <ToolbarButton onClick={() => editor?.chain().focus().redo().run()} title="Redo">↪</ToolbarButton>
                            </div>

                            {/* Editor content area */}
                            <div
                                className="border border-[#C8B89A] p-5 min-h-[340px]"
                                style={{ background: '#FAF6EE', fontFamily: "'IBM Plex Serif', serif", lineHeight: '1.9' }}
                                onClick={() => editor?.commands.focus()}
                            >
                                <EditorContent editor={editor} />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3 mt-4 pt-6 border-t border-[#C8B89A]">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                disabled={loading}
                                className="ink-btn-ghost text-xs px-8 py-3"
                            >
                                Save to Drafts
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="stamp-btn text-xs px-8 py-3 tracking-widest"
                            >
                                {loading ? 'Sending to Press…' : editId ? '✦ Update Article' : '✦ Publish to Press'}
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    )
}
