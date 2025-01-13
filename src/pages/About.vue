<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useParamStore } from '@/stores/param.store';

const paramStore = useParamStore();
paramStore.setPageTitle('EffortGo');

useHead({ title: 'EffortGo - About' });

</script>

<template>
  <c-markdown :markdown="$t('about.content')" mx-auto max-w-600px />
</template>
