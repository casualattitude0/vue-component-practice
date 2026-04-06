import { homeMessages } from '../data/home'
import footer from '../data/footer'
import { notebookPageMessages } from '../data/notebook/messages'

export default {
  langSwitcher: {
    aria: '切換為 {lang}',
  },
  nav: {
    home: '首頁',
    mainNav: '主要導覽',
  },
  home: homeMessages('zh-TW'),
  footer: footer['zh-TW'],
  notebookPage: notebookPageMessages['zh-TW'],
}
