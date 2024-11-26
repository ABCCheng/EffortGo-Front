<template>
  <c-card w-full important:flex-1 important:pa-0>
    <c-diff-editor/>
  </c-card>
</template>

<style lang="less" scoped>
.c-card {
  height: calc(var(--vh, 1vh) * 100 - 220px) !important;
}
</style>
