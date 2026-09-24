export default function GhostMark({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 420 520" fill="none" aria-hidden="true">
      <path
        d="M87 480V205C87 105 141 42 210 42s123 63 123 163v275l-32-28-31 28-30-28-30 28-30-28-30 28-31-28-32 28Z"
        fill="currentColor"
      />
      <path d="M133 196c16-23 44-35 77-35 34 0 61 12 78 35" stroke="#070707" strokeWidth="18" strokeLinecap="round" />
      <path d="M126 184h68l-15 49h-48l-5-49Zm168 0h-68l15 49h48l5-49Z" fill="#070707" />
      <path d="M195 190h30" stroke="#070707" strokeWidth="10" strokeLinecap="round" />
      <path d="M174 270c24 16 48 16 72 0" stroke="#070707" strokeWidth="10" strokeLinecap="round" />
      <path d="M105 292c72 48 138 48 210 0" stroke="#070707" strokeWidth="14" opacity=".92" />
      <circle cx="210" cy="331" r="30" fill="#070707" />
      <path d="M210 309v44M196 320h24c10 0 10 12 0 12h-20c-10 0-10 12 0 12h25" stroke="#f0eee9" strokeWidth="7" strokeLinecap="round" />
    </svg>
  )
}
