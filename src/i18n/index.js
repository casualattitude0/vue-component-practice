import { createI18n } from 'vue-i18n'
import en from '../locales/en'
import zhTW from '../locales/zh-TW'

export const defaultLocale = 'en'
export const supportedLocales = [
  { code: 'en', name: 'English', abbr: 'EN' },
  { code: 'zh-TW', name: '繁體中文', abbr: '繁中' },
]

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    'zh-TW': zhTW,
  },
})

export default i18n
