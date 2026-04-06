<script setup>
import { computed, ref } from "vue";
import { useLocale } from "../../composables/useLocale";

// eslint-disable-next-line no-undef -- Vue 3 script setup compiler macro
const props = defineProps({
  popOut: {
    type: Boolean,
    default: false,
  },
});

const { locale, supportedLocales, setLocale } = useLocale();

const pulse = ref(false);

const current = computed(() => {
  return (
    supportedLocales.find((l) => l.code === locale.value) ?? supportedLocales[0]
  );
});

const target = computed(() => {
  const other = supportedLocales.find((l) => l.code !== locale.value);
  return other ?? supportedLocales[0];
});

function onClick() {
  setLocale(target.value.code);
  pulse.value = false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    requestAnimationFrame(() => {
      pulse.value = true;
      window.setTimeout(() => {
        pulse.value = false;
      }, 280);
    });
    return;
  }
  requestAnimationFrame(() => {
    pulse.value = true;
  });
}

function onPulseEnd(event) {
  if (event.animationName === "lang-float-pulse") {
    pulse.value = false;
  }
}
</script>

<template>
  <button
    type="button"
    class="lang-float"
    :class="{ 'lang-float--pulse': pulse, 'lang-float--pop-out': props.popOut }"
    :aria-label="$t('langSwitcher.aria', { lang: target.name })"
    @click="onClick"
    @animationend="onPulseEnd"
  >
    <span class="lang-float__label">{{ current.abbr }}</span>
  </button>
</template>

<style scoped>
.lang-float {
  position: fixed;
  bottom: max(0.75rem, env(safe-area-inset-bottom));
  left: max(0.75rem, env(safe-area-inset-left));
  z-index: 50;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid rgba(44, 62, 80, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.92);
  color: #2c3e50;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  letter-spacing: 0.02em;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform-origin: center;
  transition: transform 0.38s cubic-bezier(0.34, 1.45, 0.64, 1),
    box-shadow 0.28s ease, border-color 0.18s ease, background-color 0.22s ease;
}

.lang-float__label {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.lang-float:hover {
  transform: translateY(-3px) rotate(-14deg) scale(1.08);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(66, 184, 131, 0.12);
  border-color: rgba(44, 62, 80, 0.38);
  background: rgba(255, 255, 255, 0.98);
}

.lang-float:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.lang-float:active {
  transform: translateY(1px) rotate(12deg) scale(0.88);
  transition-duration: 0.1s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 14px rgba(0, 0, 0, 0.16),
    inset 0 2px 6px rgba(0, 0, 0, 0.06);
}

@keyframes lang-float-pulse {
  0% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08), 0 0 0 0 rgba(66, 184, 131, 0.45);
    transform: rotate(0deg) scale(1);
  }
  28% {
    transform: rotate(-22deg) scale(1.07) translateY(-2px);
  }
  52% {
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1), 0 0 0 10px rgba(66, 184, 131, 0);
    transform: rotate(14deg) scale(1.02) translateY(-1px);
  }
  78% {
    transform: rotate(-6deg) scale(1);
  }
  100% {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    transform: rotate(0deg) scale(1);
  }
}

.lang-float--pulse {
  animation: lang-float-pulse 0.62s cubic-bezier(0.34, 1.2, 0.64, 1);
}

@keyframes lang-float-pop-out {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.12) translateY(-10px);
    opacity: 0;
  }
}

.lang-float--pop-out {
  pointer-events: none;
  animation: lang-float-pop-out 0.48s ease forwards;
}

@media (prefers-reduced-motion: reduce) {
  .lang-float {
    transition: border-color 0.15s ease;
  }

  .lang-float:hover {
    transform: none;
  }

  .lang-float:active {
    transform: none;
    transition-duration: 0s;
  }

  .lang-float--pulse {
    animation: none;
    border-color: rgba(66, 184, 131, 0.65);
    transition: border-color 0.25s ease;
  }

  .lang-float--pop-out {
    animation: none;
    opacity: 0;
    transform: none;
    transition: opacity 0.2s ease;
  }
}
</style>
