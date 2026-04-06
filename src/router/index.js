import { createRouter, createWebHistory } from 'vue-router'
import { defaultLocale } from '../i18n'

const pathToLocale = { en: 'en', tw: 'zh-TW' }
const localeToPath = { en: 'en', 'zh-TW': 'tw' }

export function localeFromPath(pathSegment) {
  return pathToLocale[pathSegment] || defaultLocale
}

export function pathFromLocale(localeCode) {
  return localeToPath[localeCode] ?? 'en'
}

export function localePath(localeCode) {
  const path = pathFromLocale(localeCode)
  return path === 'en' ? '/en' : `/${path}`
}

const routes = [
  {
    path: '/',
    redirect: () => localePath(defaultLocale),
  },
  {
    path: '/:locale(en|tw)',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/:locale(en|tw)/notebook',
    name: 'Notebook',
    component: () => import('../views/NotebookPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
