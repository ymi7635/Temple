import { Route, Routes } from 'react-router-dom'
import SitePage, { EventDetail } from './site/TempleSite.jsx'
import NotFound from './site/NotFound.jsx'

/** 路由表：網址 → 要顯示的畫面 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SitePage />} />
      <Route path="/events/:id" element={<EventDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
