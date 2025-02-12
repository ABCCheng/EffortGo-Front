<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { useParamStore } from '@/stores/param.store';
import Comment from '@/components/Comment.vue';

const paramStore = useParamStore();
paramStore.setPageTitle('EffortGo');

useHead({ title: 'EffortGo - About' });

</script>

<template>
  <c-markdown style="word-break: break-word;" :markdown="$t('about.content')" mx-auto w-full max-w-600px />
  <Comment :toolPath="'about'"/>
</template>
