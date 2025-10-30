import React, { useState } from 'react'

export default function App() {
  const [query, setQuery] = useState('')
  const [running, setRunning] = useState(false)
  const [links, setLinks] = useState([])
  const [error, setError] = useState(null)

  const SOCIAL_DOMAINS = [
    'linkedin.com','twitter.com','facebook.com','instagram.com','youtube.com','tiktok.com',
    'pinterest.com','reddit.com','medium.com','github.com','crunchbase.com','glassdoor.com',
    'behance.net','dribbble.com','slideshare.net','quora.com'
  ]

  const extractUrls = (obj) => {
    const urls = new Set()
    const walk = (v) => {
      if (!v) return
      if (typeof v === 'string') {
        const re = /https?:\/\/[\w-./?&=#%:\u00C0-\u017F]+/g
        const found = v.match(re)
        if (found) found.forEach(u => urls.add(u))
      } else if (Array.isArray(v)) v.forEach(walk)
      else if (typeof v === 'object') Object.values(v).forEach(walk)
    }
    walk(obj)
    return [...urls]
  }

  async function queryJina(q) {
    const url = `https://s.jina.ai/?q=${encodeURIComponent(q)}`
    const res = await fetch(url)
    try {
      const data = await res.json()
      return extractUrls(data)
    } catch {
      const text = await res.text()
      return extractUrls(text)
    }
  }

  async function run() {
    if (!query.trim()) return
    setRunning(true)
    setError(null)
    setLinks([])

    try {
      const results = await Promise.all(
        SOCIAL_DOMAINS.map(async (d) => {
          const q = `\"${query}\" site:${d}`
          try {
            return await queryJina(q)
          } catch {
            return []
          }
        })
      )

      const merged = [...new Set(results.flat())]
      setLinks(merged)
      if (merged.length === 0) setError('No results found or API blocked.')
    } catch (e) {
      setError(String(e))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div style={{minHeight:'100vh', padding:24, fontFamily:'sans-serif', background:'#f8fafc'}}>
      <div style={{maxWidth:900, margin:'0 auto', background:'#fff', borderRadius:14, padding:20, boxShadow:'0 6px 18px rgba(0,0,0,0.06)'}}>
        <h1 style={{fontSize:22, marginBottom:8}}>Jina Social Link Exporter</h1>
        <p style={{color:'#475569', marginBottom:12}}>输入公司域名或公司名（可带引号），工具将针对多个社交域发起查询并列出发现的链接（平铺、不分组）。</p>

        <div style={{display:'flex', gap:8, marginBottom:12}}>
          <input
            style={{flex:1, padding:10, borderRadius:6, border:'1px solid #e6e9ef'}}
            placeholder='例如：example.com 或 "Example Inc"'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            style={{padding:'10px 16px', borderRadius:6, background:'#2563eb', color:'#fff', border:'none', cursor: running ? 'default' : 'pointer'}}
            disabled={running || !query.trim()}
            onClick={run}
          >{running ? 'Searching…' : 'Search'}</button>
        </div>

        {error && <div style={{color:'#b91c1c', marginBottom:12}}>{error}</div>}

        <div style={{border:'1px solid #eef2f7', borderRadius:8, padding:12, background:'#fff', maxHeight:360, overflow:'auto'}}>
          {links.length === 0 ? (
            <div style={{color:'#64748b'}}>暂无链接。点击 Search 开始查询。</div>
          ) : (
            <ol style={{paddingLeft:18}}>
              {links.map((l, i) => (
                <li key={i} style={{wordBreak:'break-word', padding:'6px 0'}}>
                  <a href={l} target="_blank" rel="noreferrer">{l}</a>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
