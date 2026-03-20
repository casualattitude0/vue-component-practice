<template>
  <main class="page">
    <nav class="home-nav" aria-label="Pages">
      <router-link
        class="home-nav__link"
        :to="{ name: 'Roadmap', params: { locale } }"
      >
        {{ $t('nav.roadmap') }}
      </router-link>
      <router-link
        class="home-nav__link"
        :to="{ name: 'FigamTransferTest', params: { locale } }"
      >
        {{ $t('nav.figamTransferTest') }}
      </router-link>
    </nav>
    <section class="section section--hero">
      <HelloWorld :msg="$t('sections.hero.welcome')" />
    </section>
    <ScrollFadeIn>
      <section id="section-1" class="section section--placeholder">
        <div class="section__inner">
          <h2 class="section__title">{{ $t('sections.title', { n: 1 }) }}</h2>
          <p class="section__placeholder">{{ $t('sections.placeholder') }}</p>
        </div>
      </section>
    </ScrollFadeIn>
    <ScrollFadeIn>
      <section id="section-2" class="section section--placeholder">
        <div class="section__inner">
          <h2 class="section__title">{{ $t('sections.title', { n: 2 }) }}</h2>
          <p class="section__placeholder">{{ $t('sections.placeholder') }}</p>
        </div>
      </section>
    </ScrollFadeIn>
    <ScrollFadeIn>
      <section id="section-3" class="section section--placeholder">
        <div class="section__inner">
          <h2 class="section__title">{{ $t('sections.title', { n: 3 }) }}</h2>
          <p class="section__placeholder">{{ $t('sections.placeholder') }}</p>
        </div>
      </section>
    </ScrollFadeIn>
  </main>
</template>

<script>
import HelloWorld from '../components/HelloWorld.vue'
import ScrollFadeIn from '../components/ScrollFadeIn.vue'

export default {
  name: 'HomePage',
  components: { HelloWorld, ScrollFadeIn },
  computed: {
    locale() {
      return this.$route.params.locale
    },
  },
}
</script>

<style scoped>
.home-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  justify-content: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(44, 62, 80, 0.12);
}
.home-nav__link {
  color: #2c3e50;
  font-weight: 500;
  text-decoration: none;
}
.home-nav__link:hover {
  text-decoration: underline;
}
.home-nav__link.router-link-active {
  font-weight: 700;
}
</style>
