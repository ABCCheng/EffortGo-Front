<script setup lang="ts">
import type { Component } from 'vue';

const props = defineProps<{ icon: Component; title: string }>();
const { icon, title } = toRefs(props);
</script>

<template>
  <c-card class="colored-card">
    <div flex flex-row items-center gap-2>
      <n-icon size="30" :component="icon" />
      <n-h2 class="title">
        <n-ellipsis>{{ title }}</n-ellipsis>
      </n-h2>
    </div>

    <div class="description">
      <n-ellipsis :line-clamp="3" :tooltip="false">
        <slot />
      </n-ellipsis>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.colored-card {
  background: linear-gradient(48deg, rgba(91, 66, 53, 1) 0%, rgba(113, 83, 70, 1) 60%, rgba(145, 112, 92, 1) 100%);

  color: #fff;
  border: none;
  padding: 5px 15px;


  .title {
    color: #fff;
    margin: 5px 0;
  }

  .description {
    opacity: 0.8;

    margin: 0;

    ::v-deep(a) {
      color: inherit;
      text-decoration: underline;
      font-weight: bold;
      transition: color ease 0.2s;

      &:hover {
        color: #FF7F50;
      }
    }
  }
}
</style>
