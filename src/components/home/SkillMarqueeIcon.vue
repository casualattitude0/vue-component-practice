<template>
  <span class="skill-marquee-icon">
    <span
      class="skill-marquee-icon__glyph"
      :class="{ 'skill-marquee-icon__glyph--simple': kind === 'simple' }"
      aria-hidden="true"
    >
      <svg
        v-if="kind === 'simple' && simple"
        class="skill-marquee-icon__svg"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <path
          fill="currentColor"
          :d="simple.path"
        />
      </svg>
      <component
        :is="heroComponent"
        v-else-if="kind === 'hero' && heroComponent"
        class="skill-marquee-icon__hero"
      />
    </span>
    <span class="skill-marquee-icon__label">{{ label }}</span>
  </span>
</template>

<script>
import {
  RectangleGroupIcon,
  SwatchIcon,
  FilmIcon,
  MagnifyingGlassCircleIcon,
  LinkIcon,
  Squares2X2Icon,
  PaintBrushIcon,
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  PhotoIcon,
  PencilSquareIcon,
  VideoCameraIcon,
} from "@heroicons/vue/24/outline";
import { SIMPLE_BRAND_PATHS } from "../../data/home/simpleBrandPaths";

const HERO = {
  RectangleGroupIcon,
  SwatchIcon,
  FilmIcon,
  MagnifyingGlassCircleIcon,
  LinkIcon,
  Squares2X2Icon,
  PaintBrushIcon,
  ClipboardDocumentCheckIcon,
  PuzzlePieceIcon,
  PhotoIcon,
  PencilSquareIcon,
  VideoCameraIcon,
};

const SIMPLE = SIMPLE_BRAND_PATHS;

export default {
  name: "SkillMarqueeIcon",
  props: {
    kind: {
      type: String,
      required: true,
      validator: (v) => v === "hero" || v === "simple",
    },
    name: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      required: true,
    },
  },
  computed: {
    heroComponent() {
      if (this.kind !== "hero" || !this.name) return null;
      return HERO[this.name] || null;
    },
    simple() {
      if (this.kind !== "simple" || !this.slug) return null;
      return SIMPLE[this.slug] || null;
    },
  },
};
</script>

<style scoped>
.skill-marquee-icon {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  flex-shrink: 0;
  color: #222;
}

.skill-marquee-icon__glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #333;
}

.skill-marquee-icon__glyph--simple {
  color: #1a1a1a;
}

.skill-marquee-icon__svg {
  width: 1.35em;
  height: 1.35em;
  display: block;
}

.skill-marquee-icon__hero {
  width: 1.35em;
  height: 1.35em;
}

.skill-marquee-icon__label {
  font-weight: inherit;
  letter-spacing: inherit;
  white-space: nowrap;
}
</style>
