<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from 'vue-i18n';
import { getIpInfo } from '@/api/ipInfoApi';

const { t, locale } = useI18n();
const ipInput = ref('');
const ipData = ref(null); 
const loading = ref(false);

// 查询IP地址归属地
const queryIPLocation = async () => {
  loading.value = true;
  try {
    const response = await getIpInfo(ipInput.value, locale.value);
    ipData.value = response;
  } catch (error) {
    ipData.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  queryIPLocation();
});

</script>

<template>
  <n-spin size="large" v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
  <div w-full max-w-600px important:flex-1>
    <div flex items-center gap-2 mb-3>
      <n-auto-complete v-model:value="ipInput" clearable :placeholder="$t('tools.ip-location.inputPlaceHolder')" @keyup.enter="queryIPLocation"/>
      <n-button data-track-label="Button_IPLocationQuery" @click="queryIPLocation" type="primary">{{ t('tools.ip-location.queryIP') }}</n-button>
    </div>

    <c-card v-if="ipData" style="margin: 0; padding: 5px 15px; overflow-x: auto;">
      <pre>{{ JSON.stringify(ipData, null, 2) }}</pre> 
    </c-card>
  </div>
</template>
