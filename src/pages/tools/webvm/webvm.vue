<template>
    <div class="webvm-container">
        <iframe src="/local-webvm/index.html" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>
    </div>
</template>

<style scoped>
.webvm-container {
    position: relative;
    width: 100%;
    height: calc(var(--vheight) - 240px) !important;
    border: 4px solid transparent;
    border-color: #FF7F50;
    padding-top: 0px;
    margin-bottom: 10px;
}
</style>
  
