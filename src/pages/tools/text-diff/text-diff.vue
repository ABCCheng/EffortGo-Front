<template>
  <c-card w-full important:flex-1 important:pa-0>
    <c-diff-editor/>
  </c-card>
</template>

<style lang="less" scoped>
.c-card {
  height: calc(var(--vheight) - 130px) !important;
  border: 2px solid transparent;
  border-color: #FF7F50;
}
</style>
