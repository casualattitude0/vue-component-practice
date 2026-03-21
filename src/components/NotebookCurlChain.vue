<template>
  <div
    v-if="depth < segmentCount"
    class="notebook-page__curl-seg"
    :style="segmentStyle"
  >
    <NotebookCurlChain
      :depth="depth + 1"
      :segment-count="segmentCount"
      :page-angle-deg="pageAngleDeg"
    >
      <slot />
    </NotebookCurlChain>
  </div>
  <div
    v-else
    class="notebook-page__curl-leaf"
  >
    <slot />
  </div>
</template>

<script>
import NotebookCurlChain from "./NotebookCurlChain.vue";

export default {
  name: "NotebookCurlChain",
  components: { NotebookCurlChain },
  props: {
    depth: { type: Number, default: 0 },
    segmentCount: { type: Number, default: 14 },
    pageAngleDeg: { type: Number, required: true },
  },
  computed: {
    segmentStyle() {
      const n = this.segmentCount;
      const d = this.depth;
      const sumW = (n * (n + 1) * (2 * n + 1)) / 6;
      const w = (d + 1) * (d + 1);
      const delta = (this.pageAngleDeg * w) / sumW;
      return {
        transform: `translateZ(0) rotateX(${-delta}deg)`,
        transformOrigin: "top center",
        transformStyle: "preserve-3d",
        willChange: "transform",
      };
    },
  },
};
</script>

<style scoped>
.notebook-page__curl-seg {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.notebook-page__curl-leaf {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
