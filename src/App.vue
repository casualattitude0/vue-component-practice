<template>
  <div id="app" class="app">
    <ClickParticles />
    <router-view />
  </div>
</template>

<script>
import ClickParticles from './components/ClickParticles.vue'

export default {
  name: 'App',
  components: { ClickParticles },
}
</script>

<style>
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
