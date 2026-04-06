<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLocale } from '../composables/useLocale'

const route = useRoute()
const { supportedLocales, setLocale } = useLocale()

const homeTo = computed(() => ({
  name: 'Home',
  params: { locale: route.params.locale },
}))

const otherLocale = computed(() => {
  const cur = route.params.locale
  const code =
    cur === 'tw'
      ? supportedLocales.find((l) => l.code === 'en')
      : supportedLocales.find((l) => l.code === 'zh-TW')
  return code ?? supportedLocales[0]
})

function switchLang() {
  setLocale(otherLocale.value.code)
}
</script>

<template>
  <header
    class="page-site-nav"
    role="navigation"
    :aria-label="$t('nav.mainNav')"
  >
    <router-link
      class="page-site-nav__back"
      :to="homeTo"
    >
      ← {{ $t('nav.home') }}
    </router-link>
    <button
      type="button"
      class="page-site-nav__lang"
      :aria-label="$t('langSwitcher.aria', { lang: otherLocale.name })"
      @click="switchLang"
    >
      {{ otherLocale.abbr }}
    </button>
  </header>
</template>

<style scoped>
.page-site-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem max(1rem, env(safe-area-inset-left)) 0.5rem
    max(1rem, env(safe-area-inset-right));
  max-width: min(72rem, 100%);
  margin: 0 auto;
}

.page-site-nav__back {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.page-site-nav__back:hover {
  border-bottom-color: rgba(44, 62, 80, 0.35);
}

.page-site-nav__lang {
  flex-shrink: 0;
  padding: 0.35rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  border: 1px solid rgba(44, 62, 80, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: #2c3e50;
  cursor: pointer;
}

.page-site-nav__lang:hover {
  background: rgba(0, 0, 0, 0.05);
}
</style>
