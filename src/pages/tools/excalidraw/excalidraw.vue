<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount} from 'vue';
import { IconArrowsMaximize, IconArrowsMinimize } from '@tabler/icons-vue';

const excalidrawContainer = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const React = (await import('react')).default;
    const ReactDOM = (await import('react-dom/client')).default;
    const { Excalidraw, MainMenu } = await import('@excalidraw/excalidraw');
    const root = ReactDOM.createRoot(excalidrawContainer.value);

    const CustomMainMenu = () => {
      return React.createElement(
        MainMenu,
        null,
        React.createElement(MainMenu.DefaultItems.LoadScene),
        React.createElement(MainMenu.DefaultItems.Export),
        React.createElement(MainMenu.DefaultItems.SaveAsImage),
        React.createElement(MainMenu.DefaultItems.Help),
        React.createElement(MainMenu.DefaultItems.ClearCanvas),

        React.createElement(MainMenu.Separator),

        React.createElement(MainMenu.DefaultItems.ToggleTheme),
        React.createElement(MainMenu.DefaultItems.ChangeCanvasBackground),
      );
    };

    root.render(
      React.createElement(Excalidraw, {
        children: React.createElement(CustomMainMenu)
      })
    );

  } catch (error) {
    console.error('Failed to load Excalidraw:', error);
  }

  isLoading.value = false;
});



const fullscreenElementRef = ref<HTMLDivElement | null>(null);
const isFullscreen = ref(false);

const enterFullscreen = () => {
  const container = fullscreenElementRef.value;
  if (container) {
    if (!isFullscreen.value) {
      isFullscreen.value = true;
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      document.exitFullscreen?.();
      isFullscreen.value = false;
    }
  }
};

const handleFullscreenChange = () => {
  isFullscreen.value = document.fullscreenElement === fullscreenElementRef.value;
};
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange);
});

onBeforeUnmount(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
});

</script>

<template>
  <div ref="fullscreenElementRef" class="drawfree-container" :class="{ fullscreen: isFullscreen }">
    <n-button class="fullscreen_button" data-track-label="Button_ToggleFullScreen" @click="enterFullscreen" size="small"
      circle variant="text" :bordered="false">
      <n-icon v-if="!isFullscreen" size="20" :component="IconArrowsMaximize" />
      <n-icon v-else size="20" :component="IconArrowsMinimize" />
    </n-button>

    <div v-if="isLoading" class="loading-state">
      <n-spin size="small" />
    </div>
    <div ref="excalidrawContainer" style="height: 100%;"></div>
  </div>
</template>

<style lang="less" scoped>
.drawfree-container {
  position: relative;
  width: 100%;
  height: calc(var(--vheight) - 240px) !important;
  border: 2px solid transparent;
  border-color: #FF7F50;
  padding-top: 0px;
  margin-bottom: 10px;

  &.fullscreen {
    position: fixed !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--vheight) !important;
    z-index: 9999;
    border: 2px solid transparent;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #666;
}

.fullscreen_button {
  position: absolute;
  top: 0px;
  right: 0px;
  background: rgb(111, 76, 62);
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: all ease 0.2s !important;
  opacity: 50%;
  z-index: 5;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
    opacity: 100%;
  }
}
</style>

