import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import i18n from './i18n'
import router from './router'
import { localeFromPath } from './router'
import { applyMeta } from './utils/meta'
import { siteDefaults } from './data/site'

const app = createApp(App)
app.use(i18n).use(router)

router.beforeEach((to, _from, next) => {
  if (to.params.locale) {
    i18n.global.locale.value = localeFromPath(to.params.locale)
  }
  next()
})

router.afterEach((to) => {
  let title = siteDefaults.title
  if (to.name === 'Notebook') {
    const segment = i18n.global.t('notebookPage.title')
    title = `${segment} — Chen Jia-Zhen`
  }
  const url =
    typeof window !== 'undefined' ? window.location.href : undefined
  applyMeta({
    title,
    description: siteDefaults.description,
    imagePath: siteDefaults.ogImagePath,
    url,
  })
})

app.mount('#app')
