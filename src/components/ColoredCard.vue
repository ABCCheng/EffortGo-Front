<script setup lang="ts">
import type { Component } from 'vue';
import { ref, toRefs, onMounted, onBeforeUnmount} from 'vue';
import { IconShare2, IconSquarePlus} from '@tabler/icons-vue';

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null); 

const props = defineProps<{ icon: Component; title: string }>();
const { icon, title } = toRefs(props);

const { t } = useI18n();

const isShareSupported = ref(false);
onMounted(() => {
  isShareSupported.value = !!navigator.share;

  window.addEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    deferredPrompt.value = event;
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', (event: BeforeInstallPromptEvent) => {
    event.preventDefault();
    deferredPrompt.value = event;
  });
});

const handleShare = async () => {
  try {
    const shareData = {
      title: t('home.browser-title'),
      url: window.location.href,
    };
    await navigator.share(shareData);
  } catch (error) {
  }
};

const triggerInstallPrompt = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    
    deferredPrompt.value.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('user accepted installation');
      } else {
        console.log('user denied installation');
      }
      deferredPrompt.value = null;
    });
  }
};

</script>

<template>
  <c-card class="colored-card" style="position: relative;">
    <c-tooltip v-if="deferredPrompt" position="left" :tooltip="$t('pwa.install-prompt.addButtonTip')" style="position: absolute; top: 5px; right: 30px;">
        <n-button class="share-button" data-track-label="Button_addToHomeScreen" text :bordered="false" @click="triggerInstallPrompt">
          <n-icon size="25" :component="IconSquarePlus"/>
        </n-button>
    </c-tooltip>

    <c-tooltip v-if="isShareSupported" position="left" :tooltip="$t('shareButton.buttonTip')" style="position: absolute; top: 5px; right: 5px;">
        <n-button class="share-button" data-track-label="Button_websiteShare" text :bordered="false" @click="handleShare">
          <n-icon size="25" :component="IconShare2"/>
        </n-button>
    </c-tooltip>

    <div flex flex-row items-center gap-2>
      <n-icon size="25" :component="icon" />
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

  .share-button {
    color: #FF7F50;
    transition: color 0.2s ease; 
    &:hover {
      color: var(--n-primary-color-hover);
    }
  }

  .title {
    color: #fff;
    margin: 5px 0;
  }

  .description {
    opacity: 0.8;
    margin: 0;
    ::v-deep(a) {
      color: #FF7F50;
      text-decoration: underline;
      font-weight: bold;
      transition: color ease 0.2s;

      &:hover {
        color: var(--n-primary-color-hover);
      }
    }
  }
}
</style>
