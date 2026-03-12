<template>
  <div id="app" class="app">
    <ClickParticles />
    <main class="page">
      <section class="section section--hero">
        <HelloWorld msg="Welcome" />
      </section>
      <ScrollFadeIn>
        <section id="section-1" class="section section--placeholder">
          <div class="section__inner">
            <h2 class="section__title">Section 1</h2>
            <p class="section__placeholder">Content / asset placeholder</p>
          </div>
        </section>
      </ScrollFadeIn>
      <ScrollFadeIn>
        <section id="section-2" class="section section--placeholder">
          <div class="section__inner">
            <h2 class="section__title">Section 2</h2>
            <p class="section__placeholder">Content / asset placeholder</p>
          </div>
        </section>
      </ScrollFadeIn>
      <ScrollFadeIn>
        <section id="section-3" class="section section--placeholder">
          <div class="section__inner">
            <h2 class="section__title">Section 3</h2>
            <p class="section__placeholder">Content / asset placeholder</p>
          </div>
        </section>
      </ScrollFadeIn>
    </main>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import ClickParticles from './components/ClickParticles.vue'
import ScrollFadeIn from './components/ScrollFadeIn.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    ClickParticles,
    ScrollFadeIn,
  },
}
</script>

<style>
html, body { margin: 0; }
#app,
.app {
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
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
