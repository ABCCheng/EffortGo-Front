<script setup lang="ts">
import markdownit from 'markdown-it';
import TextareaCopyable from '@/components/TextareaCopyable.vue';
import { ref, computed } from 'vue';
import showdown from 'showdown';
const inputText = ref('# Hello World \n## 世界，你好 \n### hello world \n#### 世界，你好');
const convertDirection = ref<'md-to-html' | 'html-to-md'>('md-to-html');

const mdParser = markdownit();

const converter = new showdown.Converter();


const outputText = computed(() => {
  if (convertDirection.value === 'md-to-html') {
    return mdParser.render(inputText.value);
  } else {
    return converter.makeMarkdown(inputText.value);
  }
});
</script>

<template>
  <div w-full max-w-800px>
    <n-radio-group v-model:value="convertDirection" name="convert-direction" flex justify-center gap-10px>
      <n-radio value="md-to-html">Markdown → HTML</n-radio>
      <n-radio value="html-to-md">HTML → Markdown</n-radio>
    </n-radio-group>

    <n-divider />

    <c-input-text v-model:value="inputText" multiline raw-text 
        :placeholder="convertDirection === 'md-to-html' ? 'Your Markdown content...' : 'Your HTML content...'"
        rows="8" autofocus clearable/>
    <n-divider />
    <n-form-item>
      <TextareaCopyable :value="outputText" :word-wrap="true" :language="convertDirection === 'md-to-html' ? 'html' : 'markdown'" />
    </n-form-item>
  </div>
</template>
