<script setup lang="ts">
import { ref } from 'vue';
import { IconArrowsMaximize } from '@tabler/icons-vue';

const fullscreenElement = ref<HTMLDivElement | null>(null);

const enterFullscreen = () => {
  const element = fullscreenElement.value;
  if (element) {
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullscreen) {
      (element as any).webkitRequestFullscreen(); // Safari
    } else if ((element as any).msRequestFullscreen) {
      (element as any).msRequestFullscreen(); // IE/Edge
    }
  }
};
</script>

<template>
    <div class="webvm-container">
        <n-button class="fullscreen_button" data-track-label="Button_ToggleFullScree" @click="enterFullscreen"
          circle variant="text" :bordered="false">
            <n-icon size="25" :component="IconArrowsMaximize" />
        </n-button>
        <iframe ref="fullscreenElement"  src="/local-webvm/index.html" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
    </div>
</template>

<style lang="less" scoped>
.webvm-container {
    position: relative;
    width: 100%;
    height: calc(var(--vheight) - 240px) !important;
    border: 4px solid transparent;
    border-color: #FF7F50;
    padding-top: 0px;
    margin-bottom: 10px;
}
.fullscreen_button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgb(111, 76, 62);
    background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
    color: #fff !important;
    transition: padding ease 0.2s !important;

    &:hover {
        color: #fff;
        background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
    }
}
</style>
  
