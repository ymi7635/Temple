import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { SITE } from '../config/site.js'
import { fetchPublishedEvents } from '../data/store.js'
import { useEvents } from '../hooks/useEvents.js'
import { categoryLabel, formatRocDate } from '../data/eventUtils.js'
import IncenseIntro from './intro/IncenseIntro.jsx'
import './temple.css'
gsap.registerPlugin(ScrollTrigger, useGSAP)
const external = { target: '_blank', rel: 'noopener noreferrer' }
const nav = [['about','關於慈聖'],['events','活動公告'],['query','參香查詢'],['visit','參拜交通']]

export function Header({ home = false }) {
  const [open, setOpen] = useState(false), [active, setActive] = useState('')
  const button = useRef(null)
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && open) { setOpen(false); button.current?.focus() } }
    window.addEventListener('keydown', onKey)
    const observer = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) }), { rootMargin: '-20% 0px -60%' })
    nav.forEach(([id]) => { const el = document.getElementById(id); if (el) observer.observe(el) })
    return () => { window.removeEventListener('keydown', onKey); observer.disconnect() }
  }, [open])
  return <header className="temple-header">
    <a className="skip-link" href="#main">跳至主要內容</a>
    <Link className="wordmark" to="/" aria-label="清水慈聖宮首頁"><span className="seal" aria-hidden="true">慈聖</span><span>清水慈聖宮<small>QINGSHUI CISHENG TEMPLE</small></span></Link>
    <button ref={button} className="menu-toggle" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="temple-nav">{open ? '關閉 ×' : '選單 ☰'}</button>
    <nav id="temple-nav" className={open ? 'is-open' : ''} aria-label="主要導覽">{nav.map(([id,label],i) => <a key={id} href={`${home ? '' : '/'}#${id}`} aria-current={active === id ? 'location' : undefined} onClick={() => setOpen(false)}><small>0{i+1}</small>{label}</a>)}</nav>
  </header>
}
function IncenseArt() {
  return <div className="incense-art" aria-hidden="true"><div className="halo"/><svg className="smoke-drawing" viewBox="0 0 400 620"><defs><filter id="soft-smoke"><feGaussianBlur stdDeviation="9"/></filter><linearGradient id="smoke-ink" x2="0" y2="1"><stop stopColor="#e7d7be" stopOpacity="0"/><stop offset=".5" stopColor="#c6b79f" stopOpacity=".35"/><stop offset="1" stopColor="#e7d7be" stopOpacity=".05"/></linearGradient></defs><g fill="none" stroke="url(#smoke-ink)" filter="url(#soft-smoke)"><path strokeWidth="20" d="M200 580 C270 490 115 420 202 330 S320 190 176 90 S195 20 220 0"/><path strokeWidth="11" d="M200 580 C140 470 280 410 214 300 S125 140 250 50"/></g></svg><div className="incense-stick"><i/></div><span className="art-caption">一炷清香 · 一念平安</span></div>
}
function Hero() {
  return <section className="temple-hero" aria-labelledby="hero-title"><div className="hero-vertical" aria-hidden="true">合境平安　・　元辰光彩</div><div className="hero-copy"><p className="eyebrow">TAIWAN · QINGSHUI</p><h1 id="hero-title"><span>清水</span>慈聖宮<span className="title-dot">。</span></h1><p className="hero-line">一炷清香，<br/>安放心中的祈願。</p><a className="light-link" href="#about">走進慈聖宮 <span>↗</span></a></div>{SITE.photography.hero ? <figure className="hero-photo"><img src={SITE.photography.hero} alt={SITE.photography.alt} fetchPriority="high" width="900" height="1200"/>{SITE.photography.credit && <figcaption>{SITE.photography.credit}</figcaption>}</figure> : <IncenseArt/>}<div className="hero-bottom"><span>心有所寄　・　願有所依</span><a href="#events">向下探索 <span>↓</span></a><span className="hero-index">01 — 04</span></div></section>
}
function SectionLabel({ n, en, children }) { return <div className="section-label"><span>{n} / {en}</span><h2>{children}</h2></div> }
function About() {
  return <section id="about" className="about-section section-pad"><SectionLabel n="01" en="OUR TEMPLE">慈心所向<br/>聖境所在</SectionLabel><div className="about-content"><p className="editorial-lead">在一炷香的時間裡，<br/>讓心慢下來。</p><p>歡迎來到清水慈聖宮。透過這裡，了解宮廟資訊、查看活動公告，或為下一次參拜做好準備。</p><div className="deity-row"><span>主祀神明</span><h3>{SITE.mainDeity}</h3><small>依既有網站資料</small></div><p className="content-note">宮廟沿革、神明介紹與正式影像，待廟方提供確認後刊登。</p></div><div className="about-imprint" aria-hidden="true">慈</div></section>
}
function EventSection({ state }) {
  const [filter, setFilter] = useState('all')
  const today = new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Taipei',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
  const events = state.events.filter(e => filter === 'all' || (filter === 'upcoming' ? e.date >= today : e.date < today))
  return <section id="events" className="events-section section-pad"><div className="section-top"><SectionLabel n="02" en="NEWS & EVENTS">宮中記事</SectionLabel><p>相聚的日子，<br/>每一份心意都值得記錄。</p></div><div className="event-filters" aria-label="活動篩選">{[['all','全部公告'],['upcoming','即將舉行'],['past','歷年活動']].map(([key,label]) => <button key={key} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label}</button>)}</div>
    {state.status === 'loading' && <p className="empty-state" role="status">正在讀取活動公告…</p>}
    {state.status === 'error' && <div className="empty-state" role="alert">暫時無法載入活動。<button className="text-button" onClick={state.reload}>重新讀取 ↻</button></div>}
    {state.status === 'ready' && (events.length ? <div className="event-grid">{events.map(e => <Link className="event-card" key={e.id} to={`/events/${e.id}`}><div className="event-image">{e.poster ? <img src={e.poster} alt={`${e.title}封面`} loading="lazy" width="640" height="480"/> : <span className="event-placeholder" aria-hidden="true">慈聖宮<span>宮 中 記 事</span></span>}</div><p className="event-meta"><time dateTime={e.date}>{e.date.replaceAll('-',' . ')}</time><span>{categoryLabel(e.category)}</span></p><h3>{e.title}</h3><p>{e.summary || e.description?.slice(0,80)}</p><span className="read-event">閱讀公告 <span>↗</span></span></Link>)}</div> : <div className="empty-state"><span className="empty-number">—</span><h3>靜候下一次相聚</h3><p>目前沒有{filter === 'upcoming' ? '即將舉行的' : filter === 'past' ? '歷年' : '已發布的'}活動公告，敬請留意宮方後續消息。</p></div>)}
  </section>
}
function Query() { return <section id="query" className="query-section section-pad"><SectionLabel n="03" en="PILGRIMAGE">參香之行<br/>心意同行</SectionLabel><div><h3>{SITE.registration.title}</h3><p>已完成報名的善信，可前往原有報名系統查詢結果。</p><a className="outline-link" href={SITE.registration.url} {...external}>前往報名結果查詢 <span>↗</span></a><small>另開 Ragic 查詢頁面，依頁面說明填寫報名資料。</small></div></section> }
function FacebookIcon() { return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="white"/><path fill="#0866ff" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.026 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.973h-1.513c-1.49 0-1.956.931-1.956 1.887v2.261h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z"/></svg> }
function Visit() { return <section id="visit" className="visit-section section-pad"><div><SectionLabel n="04" en="PLAN YOUR VISIT">來宮走走</SectionLabel><p className="visit-intro">參拜、問候，或只是片刻停留。<br/>期待與您在慈聖宮相見。</p><a className="text-link map-link" href={SITE.mapUrl} {...external}><img src="/brands/google-maps.svg" alt="Google Maps" width="98" height="18"/>查看位置 ↗</a></div><div className="visit-details"><dl><div><dt>宮廟地址</dt><dd>{SITE.address}</dd></div><div><dt>聯絡電話</dt><dd>{SITE.phones.map(p => <a key={p.tel} href={`tel:${p.tel}`}>{p.display}</a>)}</dd></div><div><dt>參拜時間</dt><dd>開放時間待確認，來訪前請先電話洽詢。</dd></div></dl><a className="social-link" aria-label="在 Facebook 開啟清水慈聖宮粉絲專頁（另開分頁）" href={SITE.facebook.url} {...external}><FacebookIcon/>宮方粉絲專頁 <span>↗</span></a><p className="content-note">地址、電話及連結沿用既有專案，正式上線前請廟方覆核。LINE 官方帳號尚待確認。</p></div></section> }
export function Footer({ replay }) { return <footer className="temple-footer"><div><Link to="/" className="footer-name">清水慈聖宮</Link><span>一念慈心，日日平安。</span></div><div>{replay && <button className="text-button" onClick={replay}>重看一炷香開場 ↗</button>}<small>© {new Date().getFullYear()} 清水慈聖宮</small></div></footer> }
export default function TempleSite() {
  const state = useEvents(fetchPublishedEvents), root = useRef(null), [replay, setReplay] = useState(0), [introDone,setIntroDone] = useState(false)
  const finishIntro = useCallback(() => setIntroDone(true), [])
  useEffect(() => {
    if (!introDone || !window.location.hash) return
    const target = document.getElementById(window.location.hash.slice(1))
    const frame = requestAnimationFrame(() => target?.scrollIntoView({ behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }, [introDone])
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      if (introDone) gsap.from('.hero-copy > *', { y: 22, opacity: 0, stagger: .13, duration: .9, clearProps:'all' })
      gsap.utils.toArray('.section-label, .about-content, .event-card, .visit-details').forEach(el => gsap.from(el, { y: 28, opacity: 0, duration: .8, clearProps:'all', scrollTrigger: { trigger: el, start: 'top 92%', once: true } }))
      gsap.to('.progress-ember', { top: '100%', ease:'none', scrollTrigger: { start: 0, end: 'max', scrub: true } })
    })
    return () => media.revert()
  }, { scope: root, dependencies: [state.status,introDone], revertOnUpdate: true })
  return <div className="temple-site" ref={root}><Header home/><main id="main"><Hero/><About/><EventSection state={state}/><Query/><Visit/></main><Footer replay={() => {setIntroDone(false);setReplay(v => v + 1)}}/><div className="incense-progress" aria-hidden="true"><i className="progress-ember"/></div><IncenseIntro key={replay} replay={replay > 0} onDone={finishIntro}/></div>
}
export function EventDetail() {
  const { id } = useParams(), state = useEvents(fetchPublishedEvents), event = state.events.find(e => e.id === id)
  useEffect(() => { window.scrollTo(0,0) }, [id])
  return <div className="temple-site"><Header/><main id="main" className="event-detail section-pad"><Link className="text-link" to="/#events">← 返回活動公告</Link>{state.status === 'loading' ? <p role="status">正在讀取…</p> : state.status === 'error' ? <p role="alert">讀取失敗。<button onClick={state.reload}>重試</button></p> : !event ? <h1>活動不存在或尚未發布</h1> : <article><title>{event.title}｜清水慈聖宮</title><p className="eyebrow">{categoryLabel(event.category)} · {formatRocDate(event.date)}</p><h1>{event.title}</h1><p className="editorial-lead">{event.summary}</p><dl className="detail-facts"><div><dt>日期時間</dt><dd>{event.date} {event.time}</dd></div>{event.location && <div><dt>活動地點</dt><dd>{event.location}</dd></div>}</dl>{event.poster && <img className="detail-poster" src={event.poster} alt={`${event.title}海報`}/>}<p className="prose">{event.description}</p>{event.schedule?.length > 0 && <section><h2>活動流程</h2><ol className="event-schedule">{event.schedule.map((r,i) => <li key={i}><time>{r.time}</time>{r.text}</li>)}</ol></section>}{event.stops?.length > 0 && <section><h2>參香行程</h2><ol>{event.stops.map((s,i) => <li key={i}>{s}</li>)}</ol></section>}{event.notice && <aside className="event-notice"><h2>注意事項</h2><p className="prose">{event.notice}</p></aside>}{event.showRegistration && <a href={SITE.registration.url} {...external}>查詢報名結果 ↗</a>}</article>}</main><Footer/></div>
}
