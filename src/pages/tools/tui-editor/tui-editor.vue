<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ImageEditor from 'tui-image-editor';
import 'tui-image-editor/dist/tui-image-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';

import { IconArrowsMaximize, IconArrowsMinimize, IconDownload, IconFileDots } from '@tabler/icons-vue';

const { locale } = useI18n();

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

const locale_zh = {
    ZoomIn: '放大',
    ZoomOut: '缩小',
    Hand: '抓手工具',
    History: '历史',
    Undo: '撤销',
    Redo: '恢复',
    Reset: '重置',
    Delete: '删除',
    DeleteAll: '全部删除',
    Resize: '尺寸',
    Width: '宽度',
    Height: '高度',
    'Lock Aspect Ratio': '锁定宽高比例',
    Apply: '应用',
    Cancel: '取消',
    Flip: '镜像',
    'Flip X': 'X 轴',
    'Flip Y': 'Y 轴',
    Mask: '蒙版',
    'Load Mask Image': '上传蒙版图片',
    Crop: '裁剪',
    Square: '正方形',
    Rotate: '旋转',
    Range: '区间',
    Draw: '画笔',
    Free: '曲线',
    Straight: '直线',
    Color: '颜色',
    Shape: '图形',
    Rectangle: '矩形',
    Circle: '圆形',
    Triangle: '三角形',
    Fill: '填充',
    Stroke: '描边',
    Icon: '图标',
    Arrow: '箭头',
    'Arrow-2': '箭头2',
    'Arrow-3': '箭头3',
    'Star-1': '五角星',
    'Star-2': '多角形',
    Polygon: '多边形',
    Location: '定位',
    Heart: '心形',
    Bubble: '气泡',
    'Custom icon': '自定义图标',
    Text: '文字',
    Bold: '加粗',
    Italic: '斜体',
    Underline: '下划线',
    Left: '左对齐',
    Center: '居中',
    Right: '右对齐',
    'Text size': '字体大小',
    Filter: '滤镜',
    Grayscale: '灰度',
    Sepia: '棕色',
    Blur: '模糊',
    Emboss: '浮雕',
    Invert: '底片',
    Sepia2: '棕色2',
    Sharpen: '锐化',
    'Remove White': '除去白色',
    Distance: '距离',
    Brightness: '亮度',
    Noise: '铜板雕刻',
    Pixelate: '马赛克',
    'Color Filter': '彩色滤镜',
    Threshold: '阈值',
    Tint: '色调',
    Multiply: '正片叠底',
    Blend: '混合色',
    Custom: '自定义',
    load: '上传',
    download:'下载',
  };


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
      locale: locale.value==='en' ? '' : locale_zh,
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

::v-deep(.tui-colorpicker-palette-container ul) {
  width: 160px !important;
}

::v-deep(.tui-colorpicker-palette-container li) {
  padding: 0 !important;
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
