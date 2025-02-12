<script lang="ts" setup>
import { ref, toRefs } from 'vue';
import { useThemeVars } from 'naive-ui';
import JsonEditor from 'vue3-ts-jsoneditor';
import { useStyleStore } from '@/stores/style.store';

const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);

const jsonData = ref({
    array: [1, 2, 3],
    boolean: true,
    number: 123,
    seconds: 0,
    object: {a: 'b', c: 'd'},
    string: 'Hello World',
  });

const theme = useThemeVars();
</script>

<template>
  <div w-full class="editor-container" :style="{ height: isSmallScreen ? 'calc(var(--vheight) - 120px)' : 'calc(var(--vheight) - 130px)' }">
    <json-editor class="awesome-json-editor" mode="text" v-model:json="jsonData" />
  </div>
</template>

<style lang="less" scoped>
.editor-container {
  position: relative;
  width: 100%;
  border: 2px solid transparent;
  border-color: #FF7F50;
  padding-top: 0px;
  margin-bottom: 10px;
}

.awesome-json-editor {
  height: 100%;
  --jse-theme-color: v-bind('theme.primaryColor');
  --jse-theme-color-highlight: v-bind('theme.primaryColorHover');
}

</style>
