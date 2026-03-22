<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useClickParticles } from '../../composables/useClickParticles'

const { start, stop } = useClickParticles()

onMounted(start)
onUnmounted(stop)
</script>

<template>
  <div aria-hidden="true" style="position: fixed; width: 0; height: 0; overflow: hidden;" />
</template>
