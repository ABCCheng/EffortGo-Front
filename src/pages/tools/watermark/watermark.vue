<script setup lang="ts">
import { ref, computed } from 'vue';
import domtoimage from 'dom-to-image';

const preview = ref<string | null>(null);
const configVisible = ref(true);
const options = ref({
  fontSize: 15,
  text: '仅供xxx使用',
  alpha: 5,
  color: '#FF0000',
  rotate: 330,
  width: 10
});

const svg = computed(() => {
  let width = options.value.fontSize * options.value.text.split('').length;
  width += (options.value.width / 100) * width;

  const svgText = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}px" height="${width}px">
      <text x="50%" y="50%" alignment-baseline="middle" text-anchor="middle"
          stroke="${options.value.color}" opacity="${options.value.alpha / 10}"
          transform="translate(${width / 2}, ${width / 2}) rotate(${options.value.rotate}) translate(-${width / 2}, -${width / 2})"
          font-weight="100" font-size="${options.value.fontSize}" font-family="microsoft yahe">
          ${options.value.text}
      </text>
  </svg>`;
  const encoder = new TextEncoder();
  const bytes = encoder.encode(svgText);
  
  const base64String = btoa(String.fromCharCode(...bytes));

  return 'data:image/svg+xml;base64,' + base64String;
});

async function onVerifyClicked(uploadedFile: File) {
  preview.value = URL.createObjectURL(uploadedFile);
}

function toggleConfig() {
  configVisible.value = !configVisible.value;
}

</script>

<template>
  <div class="container">
    <!-- 预览区 -->
    <n-card class="preview">
      <c-file-upload important:justify-start :width="'100%'" py-2 title="Drag and drop, or click to select a image file" accept="*.*" @file-upload="onVerifyClicked" />
      <button @click="toggleConfig" class="config-toggle-button">
        {{ configVisible ? '收起配置' : '展开配置' }}
      </button>
      <n-image v-if="preview" :src="preview" class="previewImage" style="border-radius: 8px;" :width="'100%'" />
      <div v-if="preview" class="watermark" :style="{ backgroundImage: `url(${svg})` }"></div>
    </n-card>
    <!-- 配置区 -->
    <n-card class="config" :class="{ 'config-hidden': !configVisible }"> 
      <div style="margin: 0; padding: 0">请输入水印文字</div>
      <n-input style="margin: 0; padding: 0" v-model:value="options.text" placeholder="Hello EffortGo" fullwidth />
      <div style="margin: 0; padding: 0">字体大小</div>
      <n-slider style="margin: 0; padding: 0" v-model:value="options.fontSize" lazy :min="10" :max="30" />
      <div style="margin: 0; padding: 0">透明度</div>
      <n-slider style="margin: 0; padding: 0" v-model:value="options.alpha" lazy :min="0" :max="10" />
      <div style="margin: 0; padding: 0">旋转角度</div>
      <n-slider style="margin: 0; padding: 0" v-model:value="options.rotate" lazy :min="0" :max="360" />
      <div style="margin: 0; padding: 0">文本间距</div>
      <n-slider style="margin: 0; padding: 0" v-model:value="options.width" lazy :min="0" :max="100" />
      <div style="margin: 0; padding: 0">文本颜色</div>
      <n-color-picker style="margin: 0; padding: 0" v-model:value="options.color" :show-preview="true" />
    </n-card>
  </div>
</template>


<style lang="less">
.container {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 100%;
  max-width: 800px;
  height: calc(var(--vheight) - 130px);
}

.preview {
  position: relative;
  width: 100%;
  height: calc(100% - 100px);
}

.config {
  position: absolute;
  right: 0;
  top: 0;
  width: 200px;
  transition: transform 0.3s ease;
}

.config-hidden {
  transform: translateX(200%);
  
}

.config-toggle-button {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.previewImage {
  position: absolute;
  left: 0;
  top: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.watermark {
  position: absolute;
  left: 0;
  top: 20;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

@media (max-width: 800px) {
  .container {
    flex-direction: column;
  }
  .preview {
    width: 100%;
    height: 300px;
    max-height: 100vw;
  }
  .config {
    position: static;
    width: 100%;
  }
  .config-hidden {
    display: none;
  }
}
</style>
