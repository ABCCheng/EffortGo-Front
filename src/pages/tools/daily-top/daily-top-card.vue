<script setup lang="ts">
import { defineProps, toRefs, h } from 'vue';
import { useI18n } from 'vue-i18n';
import { IconTransitionTop,
  IconNumber10Small, IconCircleNumber1Filled, IconCircleNumber2Filled, IconCircleNumber3Filled,
  IconNumber4Small, IconNumber5Small, IconNumber6Small, IconNumber7Small, IconNumber8Small, IconNumber9Small
} from '@tabler/icons-vue';
import type { DailyTop } from './daily-top.types';
import dayjs from 'dayjs';
import { useThemeVars } from 'naive-ui';


const props = defineProps<{ index: number, dailyTop: DailyTop, setTopOrder: Function }>();
const { index, dailyTop } = toRefs(props);
const theme = useThemeVars();
const { locale } = useI18n();

// 图标数组
const icons = [
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
  IconNumber4Small,
  IconNumber5Small,
  IconNumber6Small,
  IconNumber7Small,
  IconNumber8Small,
  IconNumber9Small,
  IconNumber10Small,
];

const setTopOrder = () => {
  props.setTopOrder(dailyTop.value.platform);
};

const formatDate = (date: string) => {
  const now = dayjs();
  const target = dayjs(date);
  const diffMinutes = now.diff(target, 'minute');

  if (diffMinutes === 0) {
    return locale.value === 'zh' ? '刚刚更新' : 'Just updated';
  } else if (diffMinutes < 60) {
    return locale.value === 'zh' ? `${diffMinutes} 分钟前更新` : `Updated ${diffMinutes} minutes ago`;
  }

  return target.format('MM-DD HH:mm');
};


const formatNumber = (num: number): string => {
  if (num >= 8000000) {
    return `${(num / 10000000).toFixed(2)}kw`;
  }
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}w`;
  }
  return num.toString();
}; 

const rankColor = (index: number): string => {
  if (index === 0) {
    return '#EA444D';
  } else if (index === 1) {
    return '#ED702D';
  } else if (index === 2) {
    return '#EFAD3F';
  } else {
    return '#C28C70';
  }
}; 

</script>

<template>
  <c-card flex flex-col gap-1 style="border-radius: 8px; margin: 0px; padding: 10px">
    <div flex justify-between items-end>
      <div flex items-center justify-start gap-2>
        <n-image :src="dailyTop.image" width="30" height="30" style="pointer-events: none; border-radius: 4px; border-color: 0xFF7F50;"/>
        <div flex flex-col justify-center items-start>
          <div font-size-4 font-bold>{{ dailyTop.title }}</div>
          <div mt--5px font-size-3 >{{ formatDate(dailyTop.updateTime) }}</div>
        </div>
      </div>
      <div flex flex-col justify-center items-end>
        <n-button v-show="index !== 0" size="small" data-track-label="Button_DailyTopSetTopOrder" @click="setTopOrder" text variant="text">
          <n-icon size="20" :component="IconTransitionTop" :color="theme.primaryColor" />
        </n-button>
        <div font-size-3 font-bold >{{ dailyTop.type }}</div>
      </div>
    </div>
    <n-divider  style="margin: 0"/>
    <div mt--5px vertical align="start">
      <div flex flex-row justify-between items-center v-for="(item, index) in dailyTop.listData" :key="index">
        <div class="mt-10px mr-5px flex items-center">
          <n-icon :ml="index < 3 ? 0 : -0.5" :mr="index < 3 ? 0.5 : -0.5" :component="() => h(icons[index])" :size="index < 3 ? 25 : 30" :color="rankColor(index)"/>
          <a :href="item.mobileUrl" target="_blank"  class="no-underline w-full text-[var(--n-primary-color)] hover:text-[#FF7F50] flex-1">{{ item.title }}</a>
        </div>
        <div mt-10px text-right style="color: #FF7F50;">{{ formatNumber(item.hot) }}</div>
      </div>
    </div>
  </c-card>
</template>

