/**
 * Central content configuration. Existing project data has not been independently
 * verified against the reference site in this revision. Confirm before launch.
 * Never substitute another temple's photos or invent an official social URL.
 */
export const SITE = {
  mainDeity: '觀音佛祖',
  address: '台中市清水區高美路280-2號',
  mapUrl: 'https://maps.app.goo.gl/UaTAuU3EukBMLyTYA?g_st=ic',
  phones: [
    { display: '0986-527-773', tel: '+886986527773' },
    { display: '0921-656-361', tel: '+886921656361' },
  ],
  // 參拜交通區的外部連結，依序顯示：LINE → Facebook → Google 地圖（mapUrl）
  line: { id: '@747bkhci', label: 'LINE 官方帳號', url: 'https://line.me/R/ti/p/@747bkhci' },
  facebook: { label: '宮方粉絲專頁', url: 'https://www.facebook.com/share/1CYxtXwBiu/?mibextid=wwXIfr' },
  registration: {
    title: '丙午年參香報名結果查詢',
    url: 'https://ap16.ragic.com/qscsg/ragicsales-order-management/4?ragic-web-embed=true&webaction=query&showSheetName',
  },
  // Local, licensed images only; no photograph is presented as this temple yet.
  photography: { hero: null, alt: '', credit: '' },
}
