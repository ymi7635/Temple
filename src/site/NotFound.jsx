import { Link } from 'react-router-dom'
import btn from '../styles/buttons.module.css'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <main className={styles.page}>
      <title>找不到頁面｜清水慈聖宮</title>
      <h1 className={styles.title}>找不到這個頁面</h1>
      <p>網址可能打錯了，或是頁面已經移除。</p>
      <Link to="/" className={btn.primary}>
        回到首頁
      </Link>
    </main>
  )
}
