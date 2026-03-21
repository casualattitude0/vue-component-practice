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
    redirect: (to) => ({
      name: 'ComponentRoadmap',
      params: { locale: to.params.locale },
    }),
  },
  {
    path: '/:locale(en|tw)/card-demo',
    redirect: (to) => ({
      name: 'ComponentCard',
      params: { locale: to.params.locale },
    }),
  },
  {
    path: '/:locale(en|tw)/carousel',
    redirect: (to) => ({
      name: 'ComponentCarousel',
      params: { locale: to.params.locale },
    }),
  },
  {
    path: '/:locale(en|tw)/components/roadmap',
    name: 'ComponentRoadmap',
    component: () => import('../views/Roadmap.vue'),
  },
  {
    path: '/:locale(en|tw)/figam-transfer-test',
    name: 'FigamTransferTest',
    component: () => import('../views/FigamTransferTest.vue'),
  },
  {
    path: '/:locale(en|tw)/components/card',
    name: 'ComponentCard',
    component: () => import('../views/CardDemo.vue'),
  },
  {
    path: '/:locale(en|tw)/components/carousel',
    name: 'ComponentCarousel',
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
  {
    path: '/:locale(en|tw)/book-calendar',
    name: 'BookCalendarPage',
    component: () => import('../views/BookCalendarPage.vue'),
  },
  {
    path: '/:locale(en|tw)/notebook',
    name: 'NotebookPage',
    component: () => import('../views/NotebookPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
