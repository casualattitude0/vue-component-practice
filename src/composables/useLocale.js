import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { supportedLocales, defaultLocale } from '../i18n'
import { localePath } from '../router'

export function useLocale() {
  const { locale, t } = useI18n()
  const router = useRouter()
  return {
    locale,
    t,
    supportedLocales,
    defaultLocale,
    localePath,
    setLocale(code) {
      if (supportedLocales.some((l) => l.code === code)) {
        locale.value = code
        router.push(localePath(code))
      }
    },
  }
}
