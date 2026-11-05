/**
 * 蓮花線稿：純裝飾用，螢幕閱讀器會略過（aria-hidden）。
 * 顏色跟著外層文字色（currentColor），大小由 className 在 temple.css 設定。
 */
export default function LotusMark({ className = '' }) {
  return (
    <svg className={`lotus ${className}`.trim()} viewBox="0 0 64 44" aria-hidden="true" focusable="false">
      <g fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M30 37C18 38 7 33 2 24C12 22 22 27 30 37Z" />
        <path d="M34 37C46 38 57 33 62 24C52 22 42 27 34 37Z" />
        <path d="M31 36C20 34 13 26 12 15C21 17 28 24 31 36Z" />
        <path d="M33 36C44 34 51 26 52 15C43 17 36 24 33 36Z" />
        <path d="M32 4C40 14 40 26 32 36C24 26 24 14 32 4Z" />
      </g>
      <path d="M14 41C26 44 38 44 50 41" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
