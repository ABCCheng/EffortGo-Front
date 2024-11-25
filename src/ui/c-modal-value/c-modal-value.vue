<script lang="ts" setup>
import { useCopy } from '@/composable/copy';

const props = withDefaults(defineProps<{ value: string; label?: string; copyable?: boolean }>(), { label: undefined, copyable: true });
const { value, label } = toRefs(props);

const { copy, isJustCopied } = useCopy({ source: value });

const isModalOpen = ref(false);
const toggleModal = useToggle(isModalOpen);
</script>

<template>
  <slot name="label" :value="value" :toggle-modal="toggleModal" :is-modal-open="isModalOpen">
    <n-button class="text-left" @click="isModalOpen = true">
      {{ label }}
    </n-button>
  </slot>

  <c-modal v-model:open="isModalOpen">
    <slot name="value" :value="value" :toggle-modal="toggleModal" :is-modal-open="isModalOpen">
      {{ value }}
    </slot>

    <div mt-4 flex justify-center>
      <n-button class="w-full" @click="copy">
        {{ isJustCopied ? 'Copied!' : 'Copy' }}
      </n-button>
    </div>
  </c-modal>
</template>
