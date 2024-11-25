<script lang="ts" setup>

import MenuLayout from './MenuLayout.vue';

</script>

<template>
  <MenuLayout class="menu-layout">
    <template #content>
      <slot />
    </template>
  </MenuLayout>
</template>

<style lang="less" scoped>
</style>
