/** Read the deployed static JSON file; no API or authentication is required. */
export async function fetchPublishedEvents() {
  const response = await fetch('/data/events.json', { cache: 'no-cache' })
  if (!response.ok) throw new Error('暫時無法讀取活動公告。')
  const data = await response.json()
  if (!Array.isArray(data.events)) throw new Error('活動資料格式不正確。')
  return data.events
}
