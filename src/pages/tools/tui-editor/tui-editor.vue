<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';

import { IconArrowsMaximize, IconArrowsMinimize, IconDownload, IconFileDots } from '@tabler/icons-vue';

const fullscreenElementRef = ref<HTMLDivElement | null>(null);
const isFullscreen = ref(false);

const editorRef = ref<HTMLDivElement | null>(null);
let editorInstance: ImageEditor | null = null;
const fileInput = ref<HTMLInputElement | null>(null);

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


const initializeEditor = (filePath: string, fileName: string) => {
  const editorRect = editorRef.value.getBoundingClientRect();
  const width = editorRect.width;
  const height = editorRect.height;

  if (editorInstance) {
    editorInstance.destroy();
    editorInstance = null;
  }

  editorInstance = new ImageEditor(editorRef.value, {
    includeUI: {
      loadImage: {
        path: filePath,
        name: fileName,
      },
      theme: {
        'common.bi.image': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4/wcAAwAB/LeJzVYAAAAASUVORK5CYII=',
      },
      menu: ['resize', 'crop', 'flip', 'rotate', 'draw', 'shape', 'icon', 'text', 'mask', 'filter'],
      initMenu: '',
      uiSize: {
        width: `${width - 30}px`,
        height: `${height}px`,
      },
      menuBarPosition: 'bottom',
    },
    cssMaxWidth: width - 30,
    cssMaxHeight: height - 140,
    usageStatistics: false,
  });
};

const loadFileInput = () => {
  fileInput.value?.click();
};

const loadImage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file && editorInstance) {
    const reader = new FileReader();

    reader.onload = (e) => {
      const imageData = e.target?.result as string;
      initializeEditor(imageData, file.name);
    };

    reader.readAsDataURL(file);
  }
};

const exportImage = () => {
  if (editorInstance) {
    const dataURL = editorInstance.toDataURL();
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'effortgo-edited-image.png';
    link.click();
  }
};

const resizeEditor = () => {
  const editorRect = editorRef.value.getBoundingClientRect();
  const width = editorRect.width;
  const height = editorRect.height;

  const dimension: ICanvasSize = {
    width: width - 30,
    height: height - 140,
  }
  const editorSize: IEditorSize = {
    uiSize: {
      width: `${width - 30}px`,
      height: `${height}px`,
    }
  };

  if (editorInstance) {
    editorInstance.resizeCanvasDimension(dimension);
    editorInstance.ui.resizeEditor(editorSize);
  }
};

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });

    initializeEditor('/local-tui-editor/assets/sample.png', 'SampleImage');

    window.addEventListener('resize', resizeEditor);

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeEditor);
    });
  }
});
</script>

<template>
  <div w-full ref="fullscreenElementRef" class="editor-container" :class="{ fullscreen: isFullscreen }">
    <n-button class="fullscreen_button" data-track-label="Button_ToggleFullScreen" @click="enterFullscreen" circle variant="text" :bordered="false">
      <n-icon v-if="!isFullscreen" size="25" :component="IconArrowsMaximize" />
      <n-icon v-else size="25" :component="IconArrowsMinimize" />
    </n-button>

    <input type="file" ref="fileInput" @change="loadImage" style="display: none" />
    <n-button class="download_button" data-track-label="Button_TuiEditorDownload" @click="exportImage" circle variant="text" :bordered="false">
      <n-icon size="25" :component="IconDownload" />
    </n-button>

    <n-button class="load_button" data-track-label="Button_TuiEditorLoad" @click="loadFileInput" circle variant="text" :bordered="false">
      <n-icon size="25" :component="IconFileDots" />
    </n-button>
    <div ref="editorRef" class="editor"></div>
  </div>
</template>

<style lang="less" scoped>
.editor-container {
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
      border: 2px solid transparent;
      z-index: 9999;
    }
}

.editor {
  width: 100% !important;
  height: 100% !important;
}

::v-deep(.tui-image-editor-header-buttons) {
  display: none !important;
}

.fullscreen_button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgb(111, 76, 62);
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: all ease 0.2s !important;
  opacity: 50%;
  z-index: 9999;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
    opacity: 100%;
  }
}

.download_button {
  position: absolute;
  top: 5px;
  right: 45px;
  background: rgb(111, 76, 62);
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: all ease 0.2s !important;
  opacity: 50%;
  z-index: 9999;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
    opacity: 100%;
  }
}

.load_button {
  position: absolute;
  top: 5px;
  right: 85px;
  background: rgb(111, 76, 62);
  background: linear-gradient(48deg, rgba(111, 76, 62, 1) 0%, rgba(133, 92, 78, 1) 60%, rgba(165, 122, 106, 1) 100%);
  color: #fff !important;
  transition: all ease 0.2s !important;
  opacity: 50%;
  z-index: 9999;

  &:hover {
    color: #fff;
    background: linear-gradient(48deg, rgba(133, 92, 78, 1) 0%, rgba(165, 122, 106, 1) 60%, rgba(111, 76, 62, 1) 100%);
    opacity: 100%;
  }
}
</style>
