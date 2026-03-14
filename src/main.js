import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import i18n from './i18n'
import router from './router'
import { localeFromPath } from './router'

const app = createApp(App)
app.use(i18n).use(router)

router.beforeEach((to, _from, next) => {
  if (to.params.locale) {
    i18n.global.locale.value = localeFromPath(to.params.locale)
  }
  next()
})

app.mount('#app')
