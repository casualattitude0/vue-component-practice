<template>
  <div
    id="app"
    class="app app--layout"
  >
    <router-link
      class="skip-link"
      :to="{ name: 'Home', params: { locale: $route.params.locale || 'en' }, hash: '#home-hero' }"
    >Skip to content</router-link>
    <ClickParticles />
    <LanguageFloatButton v-if="$route.name !== 'Home'" />
    <div class="app__main">
      <router-view />
    </div>
    <SiteFooter v-if="showSiteFooter" />
  </div>
</template>

<script>
import ClickParticles from './components/site/ClickParticles.vue'
import LanguageFloatButton from './components/site/LanguageFloatButton.vue'
import SiteFooter from './components/site/SiteFooter.vue'

export default {
  name: 'App',
  components: { ClickParticles, LanguageFloatButton, SiteFooter },
  computed: {
    showSiteFooter() {
      const n = this.$route.name
      return Boolean(n) && n !== 'Home'
    },
  },
}
</script>

<style>
.skip-link {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  padding: 0.5rem 0.85rem;
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  background: #111;
  color: #fff;
  text-decoration: none;
  border-radius: 0 0 6px 0;
  transform: translateY(-120%);
  transition: transform 0.2s ease;
}

.skip-link:focus {
  transform: translateY(0);
  outline: 2px solid #fff;
  outline-offset: 2px;
}

html,
body {
  margin: 0;
  overflow-x: hidden;
  /* Hide scrollbar globally if needed, but usually better to target specific elements */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
html::-webkit-scrollbar,
body::-webkit-scrollbar {
  display: none;
}
#app,
.app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.app--layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1 0 auto;
  min-width: 0;
}

.page {
  position: relative;
  min-height: 100vh;
}

.section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  box-sizing: border-box;
}

.section--hero {
  padding-top: 60px;
  flex-direction: column;
}

.section--placeholder {
  background: #f8f9fa;
}

.section--placeholder:nth-of-type(even) {
  background: #fff;
}

.section__inner {
  text-align: center;
  max-width: 640px;
}

.section__title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.section__placeholder {
  margin: 0;
  color: #6c757d;
  font-size: 0.95rem;
}
</style>
