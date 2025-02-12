<script setup lang="ts">
import { ref, watchEffect, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStorage } from '@vueuse/core';
import { IconPlus, IconTrash, IconEdit } from '@tabler/icons-vue';
import { marked } from 'marked';
import { useThemeVars, useMessage } from 'naive-ui';

const theme = useThemeVars();
const message = useMessage();
const { t } = useI18n();

const CACHE_KEY = 'note-ease-cache';
const notes = useStorage(CACHE_KEY, [""] as string[]);
const editingIndex = ref<number | null>(null);

const addNewNote = (index: number) => {
  if (notes.value.length >= 20) {
    message.warning(t('tools.note-ease.limit'));
    return;
  }
  notes.value.splice(index + 1, 0, '');
  editingIndex.value = index + 1;

  nextTick(() => {
    const newNoteElement = document.getElementById(`note-${index + 1}`);
    if (newNoteElement) {
      newNoteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
};

const deleteNote = (index: number) => {
  notes.value.splice(index, 1);
  updateLS();
  if (editingIndex.value) {
    editingIndex.value = null;
  }
};

const editNote = (index: number) => {
  editingIndex.value = editingIndex.value === index ? null : index;
};

const updateLS = () => {
  localStorage.setItem(CACHE_KEY, JSON.stringify(notes.value));
};

watchEffect(() => {
  updateLS();
});

onMounted (() => {
  if (notes.value.length > 0 && notes.value[0] === "") {
    editingIndex.value = 0;
    return;
  }
})
</script>

<template>
  <div class="mx-auto w-full max-w-900px flex justify-center items-center">
    <div w-full grid grid-cols-1 gap-2 lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2>
      <c-card v-for="(note, index) in notes" :key="index" :id="`note-${index}`" style="border-radius: 8px; margin: 0px; padding: 0px; height: 480px;">
        <div flex flex-col h-full gap-0.5>
          <div flex justify-between p-1 :style="{ backgroundColor: theme.primaryColor }">
            <n-button size="small" data-track-label="Button_NoteEaseEdit" @click="editNote(index)" circle variant="text">
              <n-icon size="20" :component="IconEdit" :color="editingIndex !== index ? 'white' : '#FF7F50'" />
            </n-button>
            <div class="tools flex justify-start gap-2" color="color-red">
              <n-button size="small" :disabled="1 === notes.length" data-track-label="Button_NoteEaseDelete" @click="deleteNote(index)" circle variant="text">
                <n-icon size="20" :component="IconTrash" color="white" />
              </n-button>
              <n-button size="small" data-track-label="Button_NoteEaseAdd" @click="addNewNote(index)" circle variant="text">
                <n-icon size="20" :component="IconPlus" color="white" />
              </n-button>
            </div>
          </div>

          <n-input v-if="editingIndex === index" v-model:value="notes[index]" :placeholder="$t('tools.note-ease.inputPlaceHolder')" class="w-full h-full text-xl" :autosize="{ minRows: 1, maxRows: 12 }" multiline type="textarea" clearable/>
          <n-scrollbar v-else class="w-full h-full flex-1" style="padding: 0 10px;">
            <div class="markdown-content break-words" v-html="marked(note)"></div>
          </n-scrollbar>
        </div>
      </c-card>
    </div>
  </div>
</template>


<style scoped>
.markdown-content {
  line-height: 1.0;
}
</style>