/** 公開活動類別與日期顯示工具。 */
export const CATEGORIES = [
  { value: 'birthday', label: '聖誕祝壽' },
  { value: 'pilgrimage', label: '參香' },
  { value: 'ceremony', label: '法會' },
  { value: 'other', label: '其他' },
]

export function categoryLabel(value) {
  return CATEGORIES.find((c) => c.value === value)?.label ?? '其他'
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

/** 今天在台灣的日期，格式 YYYY-MM-DD（不受使用者電腦時區影響） */
export function todayInTaipei(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now)
}

/** 把 YYYY-MM-DD 拆成民國年、月、日、星期 */
export function dateParts(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const weekday = WEEKDAYS[new Date(Date.UTC(y, m - 1, d)).getUTCDay()]
  return { rocYear: y - 1911, month: m, day: d, weekday }
}

/** 115/4/25（六） */
export function formatRocDate(iso) {
  const { rocYear, month, day, weekday } = dateParts(iso)
  return `${rocYear}/${month}/${day}（${weekday}）`
}

