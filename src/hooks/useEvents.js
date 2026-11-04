import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * 讓元件取得活動資料的自訂 hook。
 *
 * 用法：const { status, events, error, reload } = useEvents(fetchPublishedEvents)
 *   status：'loading'（讀取中）、'ready'（完成）、'error'（失敗）
 *   reload：重新讀取靜態活動資料
 *
 * loader 要傳「固定不變的函式」（例如從 store.js 匯入的函式），
 * 否則每次畫面更新都會重新讀取。
 */
export function useEvents(loader) {
  const [state, setState] = useState({ status: 'loading', events: [], error: null })
  const generation = useRef(0)

  const reload = useCallback(async () => {
    const current = ++generation.current
    try {
      const events = await loader()
      if (current !== generation.current) return
      setState({ status: 'ready', events, error: null })
    } catch (error) {
      if (current !== generation.current) return
      setState((prev) => ({ ...prev, status: 'error', error }))
    }
  }, [loader])

  useEffect(() => {
    reload()
    const refresh = () => { if (document.visibilityState === 'visible') reload() }
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => { generation.current++; window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh) }
  }, [reload])

  return { ...state, reload }
}
