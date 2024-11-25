<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { IconError404Off } from '@tabler/icons-vue';

useHead({ title: 'EffortGo - Page not found' });
</script>

<template>
  <div mt-20 flex flex-col items-center>
    <span text-90px lh-1 op-50>
      <n-icon size="150" :component="IconError404Off" />
    </span>

    <h1 m-0 mt-3>
      {{ $t('404.notFound') }}
    </h1>
    <div mt-4 op-60>
      {{ $t('404.sorry') }}
    </div>
    <div mb-8 op-60>
      {{ $t('404.maybe') }}
    </div>

    <router-link to="/">
      <n-button>
        {{ $t('404.backHome') }}
      </n-button>
    </router-link>
  </div>
</template>
