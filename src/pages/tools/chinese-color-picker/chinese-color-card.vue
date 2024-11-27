<script setup lang="ts">
import type { ColorInfo } from './chinese-color.types';
import { useCopy } from '@/composable/copy';
import { toRefs, defineProps } from 'vue';

const props = defineProps<{ colorInfo: ColorInfo }>();
const { colorInfo } = toRefs(props);

const { copy } = useCopy();
const { t } = useI18n();

</script>

<template>
  <c-card class="cardblock" flex items-center gap-3 important:py-8px important:pl-10px important:pr-5px>
    <div class="bg" :style="{ backgroundColor: colorInfo.hex, boxShadow: `0px 10px 30px 5px rgba(${colorInfo.RGB.join(',')}, 0.6)`}"
      cursor-pointer
      w-12 h-12 rounded
    ></div>
    <div flex flex-col gap-1>
      <div flex flex-col gap-0 text-xs>
        <div truncate font-bold>{{ colorInfo.name }} </div>
        <div truncate font-bold>{{ colorInfo.pinyin }}</div>
      </div>
      <div flex flex-col gap-0 text-sm font-mono font-semibold text-primary>
        <span cursor-pointer transition hover:text-orange-600 
          @click="copy(colorInfo.RGB.join(','), { notificationMessage: `RGB '${colorInfo.RGB.join(',')}' ${t('message.copy')}` })"
        > RGB:{{ colorInfo.RGB.join(',') }} </span>
        <span cursor-pointer transition hover:text-orange-600
          @click="copy(colorInfo.hex, { notificationMessage: `HEX '${colorInfo.hex}' ${t('message.copy')}` })"
        >HEX:{{ colorInfo.hex}}</span>
        <span cursor-pointer transition hover:text-orange-600
          @click="copy(colorInfo.CMYK.join(','), { notificationMessage: `CMYK '${colorInfo.CMYK.join(',')}' ${t('message.copy')}` })"
        >CMYK:{{ colorInfo.CMYK.join(',') }}</span>
      </div>
    </div>
  </c-card>
</template>

<style lang="less" scoped>
.cardblock {
  position: relative;

  .bg {
    width: 100px;
    height: 100px;
    transition: all 0.3s ease;
    box-sizing: border-box;
  }
  
  &:hover {
    .copy {
      opacity: 1;
    }

    .bg {
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0) !important;
    }
  }
}
</style>
