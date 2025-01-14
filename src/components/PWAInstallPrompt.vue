<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const { t } = useI18n();

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const disablePrompt = ref(false);
const showPrompt = ref(false);

const shouldShowPrompt = (): boolean => {
  const lastPromptTime = localStorage.getItem("lastPWAInstallPromptTime");
  if (!lastPromptTime) {
    return true;
  }
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const monthDays = oneDay * 30;
  const inteval = now - parseInt(lastPromptTime)

  if (inteval > monthDays) {
    return true;
  }

  const disablePrompt = localStorage.getItem("disablePWAInstallPrompt");
  if (localStorage.getItem("disablePWAInstallPrompt") === "true" || inteval < oneDay) {
    return false;
  }

  return true;
};

const installApp = async () => {
  if (!deferredPrompt.value) {
    return;
  }
  deferredPrompt.value.prompt();
  const choiceResult = await deferredPrompt.value.userChoice;
  // console.log(choiceResult.outcome === "accepted" ? "accepted" : "canceled");
  deferredPrompt.value = null;
  showPrompt.value = false;
};


const handleClose = () => {
  showPrompt.value = false;
  localStorage.setItem("disablePWAInstallPrompt", disablePrompt.value.toString());
  localStorage.setItem("lastPWAInstallPromptTime", Date.now().toString());
};

const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
  event.preventDefault();
  deferredPrompt.value = event;
  showPrompt.value = shouldShowPrompt();
};

onMounted(() => {
  window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>

<template>
  <n-notification-provider v-if="showPrompt">
    <c-card style="position: fixed; bottom: -30px; left: 50%; transform: translateX(-50%);
             display: flex; flex-direction: column; align-items: center;
             padding: 5px 0 50px; width: 100%; max-width: 420px; gap: 16px; 
             border-radius: 30px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
             z-index: 9999;">
      <div>
        <h3>{{ $t('pwa.install-prompt.title') }}</h3>
        <div style="display: flex; gap: 16px;">
          <img src="/android-chrome-192x192.png" alt="App Icon"
            style="width: 48px; height: 48px; border-radius: 8px;" />
          <div>
            <p style="font-weight: bold; margin: 0;">EffortGo</p>
            <p style="margin: 0; color: grey;">https://www.effortgo.com/</p>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; align-items: center;">
        <n-checkbox v-model:checked="disablePrompt" size="large">{{ $t('pwa.install-prompt.disable-reminder')}}</n-checkbox>
        <n-button data-track-label="Button_PWAInstallCancel" style="width: 80px; " @click="handleClose">
          {{ $t('pwa.install-prompt.cancel') }}
        </n-button>
        <n-button data-track-label="Button_PWAInstallConfirm" style="width: 80px;" type="primary" @click="installApp">
          {{ $t('pwa.install-prompt.confirm') }}
        </n-button>
      </div>
    </c-card>
  </n-notification-provider>
</template>
