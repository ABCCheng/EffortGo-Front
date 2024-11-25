<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = withDefaults(defineProps<{ tooltip?: string; position?: 'top' | 'bottom' | 'left' | 'right' }>(), {
  tooltip: undefined,
  position: 'top',
});
const { tooltip, position } = toRefs(props);

const isHovered = ref(false);
const isTouch = ref(false);  // 用于区分触摸操作和鼠标操作
const targetRef = ref<HTMLElement | null>(null);

// 显示 tooltip
const showTooltip = () => {
  isHovered.value = true;
};

// 隐藏 tooltip
const hideTooltip = () => {
  isHovered.value = false;
};

// 处理鼠标进入事件
const handleMouseEnter = () => {
  if (!isTouch.value) {  // 如果是触摸设备则不处理鼠标事件
    showTooltip();
  }
};

// 处理鼠标离开事件
const handleMouseLeave = () => {
  if (!isTouch.value) {
    hideTooltip();
  }
};

// 处理触摸开始事件（移动端）
const handleTouchStart = () => {
  isTouch.value = true;  // 标记为触摸操作
  showTooltip();
};

// 处理触摸结束事件（移动端）
const handleTouchEnd = () => {
  isTouch.value = false;  // 结束触摸操作
  hideTooltip();
};

// 点击外部隐藏 tooltip
const handleClickOutside = (e: MouseEvent | TouchEvent) => {
  if (targetRef.value && !targetRef.value.contains(e.target as Node)) {
    hideTooltip();
  }
};

onMounted(() => {
  // 监听点击事件和触摸事件
  document.addEventListener('click', handleClickOutside);
  document.addEventListener('touchstart', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('touchstart', handleClickOutside);
});
</script>

<template>
  <div relative inline-block>
    <div
      ref="targetRef"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <slot />
    </div>

    <div
      v-if="tooltip || $slots.tooltip"
      class="absolute z-10 whitespace-nowrap rounded bg-black px-12px py-6px text-sm text-white shadow-lg transition duration-200"
      :class="{
        'op-0 scale-0': !isHovered,
        'op-100 scale-100': isHovered,
        'bottom-100% left-50% -translate-x-1/2 mb-5px': position === 'top',
        'top-100% left-50% -translate-x-1/2 mt-5px': position === 'bottom',
        'right-100% top-50% -translate-y-1/2 mr-5px': position === 'left',
        'left-100% top-50% -translate-y-1/2 ml-5px': position === 'right',
      }"
    >
      <slot name="tooltip">
        {{ tooltip }}
      </slot>
    </div>
  </div>
</template>
