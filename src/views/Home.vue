<template>
  <main class="page">
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
}
</script>
