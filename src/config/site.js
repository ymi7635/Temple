/**
 * Central content configuration. Existing project data has not been independently
 * verified against the reference site in this revision. Confirm before launch.
 * Never substitute another temple's photos or invent an official social URL.
 */
export const SITE = {
  fullName: '清水慈聖宮',
  mainDeity: '觀音佛祖',
  address: '台中市清水區高美路280-2號',
  mapUrl: 'https://maps.app.goo.gl/UaTAuU3EukBMLyTYA?g_st=ic',
  phones: [
    { display: '0986-527-773', tel: '+886986527773' },
    { display: '0921-656-361', tel: '+886921656361' },
  ],
  facebook: { label: '清水慈聖宮臉書粉絲團', url: 'https://www.facebook.com/share/1CYxtXwBiu/?mibextid=wwXIfr' },
  // Keep unverified links disabled; supply official accounts after confirmation.
  line: { id: null, url: null },
  instagram: { id: null, url: null },
  registration: {
    title: '丙午年參香報名結果查詢',
    url: 'https://ap16.ragic.com/qscsg/ragicsales-order-management/4?ragic-web-embed=true&webaction=query&showSheetName',
  },
  // Local, licensed images only; no photograph is presented as this temple yet.
  photography: { hero: null, alt: '', credit: '' },
}
