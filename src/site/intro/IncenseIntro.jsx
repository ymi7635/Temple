import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './incense.css'
const KEY = 'csg-incense-seen'
function shouldPlay(replay) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  try { return replay || !sessionStorage.getItem(KEY) } catch { return true }
}
export default function IncenseIntro({ replay, onDone }) {
  const [playing, setPlaying] = useState(() => shouldPlay(replay))
  const root = useRef(null), canvas = useRef(null), skip = useRef(null)
  const finish = useCallback(() => {
    try { sessionStorage.setItem(KEY, '1') } catch { /* Storage may be disabled. */ }
    setPlaying(false)
  }, [])
  useEffect(() => { if (!playing) onDone() }, [playing,onDone])
  useGSAP(() => {
    if (!playing) return
    const timeline = gsap.timeline({ onComplete: finish })
    timeline.from('.intro-incense, .intro-caption', { opacity:0, duration:.7, stagger:.2 })
      .to('.intro-smoke', { opacity:1, duration:1.4 }, .4)
      .to('.intro-smoke', { scale:1.7, opacity:.35, duration:1.2 }, 2.1)
      .to(root.current, { opacity:0, duration:1.1 }, 2.8)
  }, { scope:root, dependencies:[playing] })
  useEffect(() => {
    if (!playing) return
    let dispose, cancelled = false
    const previousFocus = document.activeElement
    const regions = [...document.querySelectorAll('.temple-site > header, .temple-site > main, .temple-site > footer')]
    const oldInert = regions.map(el => el.inert)
    regions.forEach(el => { el.inert = true })
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    skip.current?.focus({preventScroll:true})
    const key = e => { if (e.key === 'Escape') finish(); if (e.key === 'Tab') { e.preventDefault(); skip.current?.focus() } }
    window.addEventListener('keydown',key)
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    const reduced = e => { if (e.matches) finish() }
    media.addEventListener('change',reduced)
    const watchdog = setTimeout(finish, 5000)
    // Mobile retains the light CSS smoke; WebGL loads only on larger screens.
    if (!matchMedia('(max-width: 720px)').matches) {
      import('./smokeScene.js').then(({ createSmoke }) => {
        if (cancelled) return
        try { dispose = createSmoke(canvas.current, finish) } catch { finish() }
      }).catch(finish)
    }
    return () => {
      cancelled = true; dispose?.(); clearTimeout(watchdog)
      window.removeEventListener('keydown',key); media.removeEventListener('change',reduced)
      document.documentElement.style.overflow = previousOverflow
      regions.forEach((el,i) => { el.inert = oldInert[i] })
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({preventScroll:true})
    }
  }, [playing,finish])
  if (!playing) return null
  return <div className="incense-intro" ref={root} role="dialog" aria-modal="true" aria-label="一炷香開場動畫"><p className="intro-brand">清 水 慈 聖 宮</p><div className="intro-smoke"><canvas ref={canvas} aria-hidden="true"/><div className="mobile-smoke"/></div><div className="intro-incense" aria-hidden="true"><i/></div><p className="intro-caption">一 炷 清 香　・　一 念 平 安</p><button ref={skip} onClick={finish}>略過動畫 <span>↗</span></button></div>
}
