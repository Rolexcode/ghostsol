'use client'

import { useState } from 'react'

const CONTRACT = ''

export default function CopyContract() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    if (!CONTRACT) return
    await navigator.clipboard.writeText(CONTRACT)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button className="copy-button" onClick={copy} disabled={!CONTRACT}>
      <span>{CONTRACT ? (copied ? 'COPIED' : 'COPY CONTRACT') : 'CONTRACT COMING SOON'}</span>
      <span aria-hidden="true">↗</span>
    </button>
  )
}
