import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Build-time content preparation only. Nothing here runs on the deployed website.
export function publishedEvents(data) {
  if (!Array.isArray(data?.events)) throw new Error('content/events.json 必須包含 events 陣列。')
  const ids = new Set()
  const events = []
  for (const source of data.events) {
    if (source?.published !== true) continue
    const fail = message => { throw new Error(`活動 ${source.id || '(無 id)'}：${message}`) }
    if (!/^[A-Za-z0-9_-]+$/.test(source.id || '') || ids.has(source.id)) fail('id 必須唯一，且只能使用英數字、底線與連字號。')
    ids.add(source.id)
    if (!source.title?.trim()) fail('請填寫 title。')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(source.date || '') || !Number.isFinite(Date.parse(source.date)) || new Date(source.date).toISOString().slice(0,10) !== source.date) fail('date 必須是有效的 YYYY-MM-DD 日期。')
    const event = { id: source.id, published: true }
    for (const key of ['title','date','time','location','summary','description','notice','lunarDate','category','poster']) {
      if (source[key] != null && typeof source[key] !== 'string') fail(`${key} 必須是文字。`)
      event[key] = source[key]?.trim() || ''
    }
    if (event.poster && !/^\/images\/[A-Za-z0-9_/-]+\.(jpg|jpeg|png|webp)$/i.test(event.poster)) fail('poster 必須是 /images/ 下的 JPG、PNG 或 WebP 路徑。')
    if (event.time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(event.time)) fail('time 必須是 HH:mm。')
    event.schedule = source.schedule ?? []
    event.stops = source.stops ?? []
    if (!Array.isArray(event.schedule) || event.schedule.some(row => !row || typeof row.text !== 'string' || (row.time != null && typeof row.time !== 'string'))) fail('schedule 必須是含 text、time 的陣列。')
    if (!Array.isArray(event.stops) || event.stops.some(stop => typeof stop !== 'string')) fail('stops 必須是文字陣列。')
    event.schedule = event.schedule.map(({time = '',text}) => ({time,text}))
    event.showRegistration = source.showRegistration === true
    events.push(event)
  }
  return { version: 1, events: events.sort((a,b) => b.date.localeCompare(a.date)) }
}

export async function buildEvents(root) {
  const input = JSON.parse(await fs.readFile(path.join(root,'content/events.json'),'utf8'))
  const output = publishedEvents(input)
  for (const event of output.events) {
    if (event.poster) await fs.access(path.join(root,'public',event.poster.slice(1)))
  }
  const directory = path.join(root,'public/data')
  await fs.mkdir(directory,{recursive:true})
  await fs.writeFile(path.join(directory,'events.json'),JSON.stringify(output,null,2)+'\n')
  return output
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..',import.meta.url))
  const output = await buildEvents(root)
  console.log(`已產生靜態活動資料：${output.events.length} 筆已發布活動。`)
}
