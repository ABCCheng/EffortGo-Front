<script setup lang="ts">
import { h, ref, onMounted, computed} from 'vue';
import { useI18n } from 'vue-i18n';
import { useMessage, useThemeVars } from 'naive-ui'
import { IconShare2, IconBug, IconArrowBackUp } from '@tabler/icons-vue';
import type { Tool } from '@/pages/tools/tools.types';
import { getToolStatic, reportError } from '@/api/toolStaticsApi';


const message = useMessage();
const theme = useThemeVars();
const { t, locale} = useI18n();
const isShareSupported = ref(false);
const loading = ref(false);
const reportErrorAlready = ref(false);

interface ToolStatic {
  reportErrorCount: number;
  favoriteCount: number;
}

const props = defineProps<{
  visible: boolean
  tool: Tool | null
}>();

const toolStatic = ref<ToolStatic>({
  reportErrorCount: 0,
  favoriteCount: 0
});

const fetchToolStatic = async () => {
  if (!props.tool) return;
  
  try {
    const response = await getToolStatic(props.tool.path.replace(/^\//, ''), locale.value);
    if (response.code === 200) {
      toolStatic.value = response.data;
    }
  } catch (error) {
  }
};

onMounted(() => {
  isShareSupported.value = !!navigator.share;
  fetchToolStatic();
});

const emit = defineEmits<{
  'update:visible': [value: boolean]
}>();

const handleShare = async () => {
  try {
    const shareData = {
      title: 'EffortGo - ' + props.tool.name,
      url: window.location.href,
    };
    await navigator.share(shareData);
  } catch (error) {
  }
};


// 添加响应式变量
const showCaptchaModal = ref(false);
const captchaResult = ref<number | null>(null);
const captchaAnswer = ref<number | null>(null);
const num1 = ref(0);
const num2 = ref(0);

// 生成验证码的函数
const generateCaptcha = () => {
  num1.value = Math.floor(Math.random() * 20);
  num2.value = Math.floor(Math.random() * 20);
  captchaResult.value = num1.value + num2.value;
  captchaAnswer.value = null;
};

// 修改报错处理函数
const handleReportError = async () => {
  if (!props.tool) return;
  
  // 第一次点击，显示验证码
  if (!showCaptchaModal.value) {
    generateCaptcha();
    showCaptchaModal.value = true;
    return;
  }

  // 验证答案
  if (captchaAnswer.value !== captchaResult.value) {
    message.error(t('message.calculateError'));
    return;
  }
  
  loading.value = true;
  // 验证通过，发送请求
  try {
    const response = await reportError(props.tool.path.replace(/^\//, ''), locale.value);
    if (response.code === 200) {
      toolStatic.value.reportErrorCount++;
      showCaptchaModal.value = false;
      message.success(response.message + ' - Code: ' + response.code.toString());
    } else {
      message.error(response.message + ' - Code: ' + response.code.toString());
    }
  } catch (error) {
    message.error(t('message.operateError'));
  }

  loading.value = false;
  reportErrorAlready.value = true;
};

</script>

<template>
  <div flex items-center justify-between gap-10px>
    <div flex items-center gap-10px>
      <n-icon :component="() => h(props.tool.icon)" size="30" :color='theme.primaryColor' />
      <h2>{{ t('tools.tool-detail.title') + ' - ' + props.tool.name }}</h2>
    </div>
  </div>

  <div style="word-break: break-word;"  v-html="props.tool.innerDescription" mb-1 />

  <div style="display: flex; flex-direction: row-reverse; gap: 10px; margin-bottom: 10px;">
    <c-tooltip v-if="isShareSupported" position="bottom" :tooltip="t('toolDetail.share')">
      <n-button data-track-label="Button_ShareTool" variant="text" text :bordered="false" type="primary"
        @click="handleShare">
        <n-icon size="25" :component="IconShare2" py-12px />
      </n-button>
    </c-tooltip>

    <c-tooltip position="bottom" :tooltip="t('toolDetail.reportError')">
      <n-button :disabled="reportErrorAlready" data-track-label="Button_ReportErrorTool" variant="text" text
        :bordered="false" type="primary" @click="handleReportError">
        <n-icon size="28" :component="IconBug" py-10px />
      </n-button>
    </c-tooltip>

    <FavoriteButton data-track-label="Button_ToolFavorite" :tool="tool" :badgeValue="toolStatic.favoriteCount" />
  </div>

  <Comment :toolPath="props.tool.path.replace(/^\//, '')" />

  <n-modal v-model:show="showCaptchaModal" style="width: 250px" :title="t('toolDetail.reportErrorConfirm')"preset="dialog">
    <n-spin size="large" v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="width: auto;">{{ num1 }} + {{ num2 }} = </div>
      <n-input-number size="small" v-model:value="captchaAnswer" :show-button="false" style="width: 80px; margin-left: 5px;" placeholder="" />
      <n-button size="small" style="margin-left: 5px; " type="primary" @click="handleReportError">OK</n-button>
    </div>
  </n-modal>
</template>
