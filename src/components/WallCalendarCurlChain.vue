<template>
  <div
    v-if="depth < segmentCount"
    class="wall-calendar-page__curl-seg"
    :style="segmentStyle"
  >
    <WallCalendarCurlChain
      :depth="depth + 1"
      :segment-count="segmentCount"
      :page-angle-deg="pageAngleDeg"
    >
      <slot />
    </WallCalendarCurlChain>
  </div>
  <div
    v-else
    class="wall-calendar-page__curl-leaf"
  >
    <slot />
  </div>
</template>

<script>
import WallCalendarCurlChain from "./WallCalendarCurlChain.vue";

export default {
  name: "WallCalendarCurlChain",
  components: { WallCalendarCurlChain },
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
.wall-calendar-page__curl-seg {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.wall-calendar-page__curl-leaf {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
</style>
