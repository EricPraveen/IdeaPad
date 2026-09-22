import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to Light Newspaper Theme' : 'Switch to Dark Nocturne Theme'}
      title={isDark ? 'Switch to Light Newspaper Theme (Press to toggle)' : 'Switch to Dark Nocturne Theme (Press to toggle)'}
      className={`relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xs transition-all duration-300 cursor-pointer border select-none group ${
        isDark
          ? 'bg-[#1B1B1B] text-[#C9A227] border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[#232323] shadow-[0_0_10px_rgba(201,162,39,0.15)]'
          : 'bg-[#FAF6EE] text-[#7A1C2E] border-[#DDD2C1] hover:border-[#7A1C2E] hover:bg-[#EFE8DC]'
      } ${className}`}
    >
      {/* Icon with smooth flip & rotation animation */}
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isDark ? (
          <span
            className="text-sm transform transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12 inline-block"
            role="img"
            aria-label="Moon"
          >
            🌙
          </span>
        ) : (
          <span
            className="text-sm transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-45 inline-block"
            role="img"
            aria-label="Sun"
          >
            🌞
          </span>
        )}
      </div>

      {/* Optional or Responsive Text Label */}
      <span
        className={`text-[10px] font-mono tracking-widest uppercase font-semibold ${
          isDark ? 'text-[#E6DEC8]' : 'text-[#35312C]'
        } ${showLabel ? 'inline-block' : 'hidden sm:inline-block'}`}
      >
        {isDark ? 'DARK' : 'LIGHT'}
      </span>

      {/* Decorative antique indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
          isDark ? 'bg-[#C9A227]' : 'bg-[#7A1C2E]'
        }`}
      />
    </button>
  )
}
