import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { supportedLocales, defaultLocale } from '../i18n'
import { localePath, pathFromLocale } from '../router'

export function useLocale() {
  const { locale, t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  return {
    locale,
    t,
    supportedLocales,
    defaultLocale,
    localePath,
    setLocale(code) {
      if (!supportedLocales.some((l) => l.code === code)) return
      locale.value = code
      const pathSeg = pathFromLocale(code)
      if (route.name && route.params?.locale != null) {
        router.push({
          name: route.name,
          params: { ...route.params, locale: pathSeg },
          query: route.query,
          hash: route.hash,
        })
      } else {
        router.push(localePath(code))
      }
    },
  }
}
