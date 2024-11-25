<script lang="ts" setup>
const modal1 = ref();
</script>

<template>
  <div>
    <n-button @click="() => modal1?.open()">
      Open Modal
    </n-button>

    <c-modal ref="modal1">
      Content
    </c-modal>
  </div>
</template>
