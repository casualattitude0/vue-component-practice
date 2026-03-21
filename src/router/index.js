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
    path: '/:locale(en|tw)/roadmap',
    name: 'Roadmap',
    component: () => import('../views/Roadmap.vue'),
  },
  {
    path: '/:locale(en|tw)/figam-transfer-test',
    name: 'FigamTransferTest',
    component: () => import('../views/FigamTransferTest.vue'),
  },
  {
    path: '/:locale(en|tw)/card-demo',
    name: 'CardDemo',
    component: () => import('../views/CardDemo.vue'),
  },
  {
    path: '/:locale(en|tw)/carousel',
    name: 'CarouselPage',
    component: () => import('../views/CarouselPage.vue'),
  },
  {
    path: '/:locale(en|tw)/skills',
    name: 'SkillsPage',
    component: () => import('../views/SkillsPage.vue'),
  },
  {
    path: '/:locale(en|tw)/art-showcase',
    name: 'ArtShowcase',
    component: () => import('../views/ArtShowcase.vue'),
  },
  {
    path: '/:locale(en|tw)/wall-calendar',
    name: 'WallCalendarPage',
    component: () => import('../views/WallCalendarPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
