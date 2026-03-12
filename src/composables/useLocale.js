import { useI18n } from 'vue-i18n'
import { supportedLocales, defaultLocale } from '../i18n'

export function useLocale() {
  const { locale, t } = useI18n()
  return {
    locale,
    t,
    supportedLocales,
    defaultLocale,
    setLocale(code) {
      if (supportedLocales.some((l) => l.code === code)) {
        locale.value = code
      }
    },
  }
}
