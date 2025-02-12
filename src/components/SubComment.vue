<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { IconMessageCircle, IconThumbUp, IconAlertTriangle } from '@tabler/icons-vue';
import { getSubComments, likeComment, reportComment } from '@/api/commentApi';
import { addLikedComment, addReportedComment, isLikedComment, isReportedComment } from '@/stores/comment.store';
import dayjs from 'dayjs';

const message = useMessage();
const { t, locale } = useI18n();

const props = defineProps({
  parentId: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  }
});

const isSubmitting = ref(false);

const state = reactive({
  data: [] as any[],
  page: 1,
  loadSize: 5, // 每次加载 5 条
  loading: false,
  hasMore: true,
  leftCount: 0
});

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const refreshComments = () => {
  console.log('refresh-comments received');
  state.data = [];
  state.page = 1;
  state.loadSize = 5;
  state.loading = false;
  state.hasMore = true;
  state.leftCount = 0;
  loadSubComments(true);
};

const loadSubComments = async (init = false) => {
  if (state.loading || (!init && !state.hasMore)) return;
  
  state.loading = true;
  try {
    const response = await getSubComments(props.parentId, state.page, init ? 1 : state.loadSize, locale.value);
    if (response.code === 200) {
      const newComments = response.data.comments || [];
      if (state.page === 1) {
        state.data = newComments;
      } else {
        state.data.push(...newComments);
      }
      
      state.hasMore = state.data.length < response.data.totalCount;
      if (state.hasMore) {
        state.page = init ? 1 : state.page + 1;
      }
      state.leftCount = response.data.totalCount - state.data.length;
    }
  } catch (error) {
  } finally {
    state.loading = false;
  }
};

const handleLike = async (commentId: number) => {
  isSubmitting.value = true;
  try {
    const response = await likeComment(commentId, locale.value);
    if (response.code === 200) {
      const comment = state.data.find(c => c.id === commentId);
      if (comment) {
        comment.likes += 1;
        addLikedComment(commentId);
      }
      message.success(response.message + ' - Code: ' + response.code.toString());
    } else {
      message.error(response.message + ' - Code: ' + response.code.toString());
    }
  } catch (error) {
    message.error(t('message.operateError'));
  }
  
  isSubmitting.value = false;
};

// 添加响应式变量
const reportCommentId = ref(0);
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

const handleReport = async (commentId: number = 0) => {
  // 第一次点击，显示验证码
  if (!showCaptchaModal.value) {
    generateCaptcha();
    showCaptchaModal.value = true;
    reportCommentId.value = commentId;
    return;
  }

  // 验证答案
  if (captchaAnswer.value !== captchaResult.value) {
    message.error(t('message.calculateError'));
    return;
  }

  isSubmitting.value = true;
  showCaptchaModal.value = false;
  try {
    const response = await reportComment(reportCommentId.value, locale.value);
    if (response.code === 200) {
      const comment = state.data.find(c => c.id === reportCommentId.value);
      if (comment) {
        comment.reports += 1;
        addReportedComment(reportCommentId.value);
      }
      message.success(response.message + ' - Code: ' + response.code.toString());
    } else {
      message.error(response.message + ' - Code: ' + response.code.toString());
    }
  } catch (error) {
    message.error(t('message.operateError'));
  }
  isSubmitting.value = false;
};

onMounted(() => {
  loadSubComments(true);

  const element = document.querySelector(`#${props.id}`);
  if (element) {
    element.addEventListener('refresh-comments', refreshComments);
  }
});

onUnmounted(() => {
  const element = document.querySelector(`#${props.id}`);
  if (element) {
    element.removeEventListener('refresh-comments', refreshComments);
  }
});
</script>

<template>
  <div :id="id" class="w-full">
    <n-spin size="large" v-if="isSubmitting" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />

    <div v-for="item in state.data" :key="item.id" mt-2>
      <n-divider style="padding: 0; margin: 0; width: 100%;" />

      <div class="sub-comment-item flex items-start gap-1 mt-1">
        <div>
          <n-icon size="20" :component="IconMessageCircle" />
        </div>

        <div class="w-full flex flex-col">
          <div class="flex justify-between">
            <div class="font-bold text-sm">{{ item.username }}</div>
            <span class="text-xs text-gray-500">{{ formatDate(item.createTime) }}</span>
          </div>

          <div class="text-sm mt-1">{{ item.content }}</div>

          <div class="flex items-center justify-end gap-2 mt-2">
            <n-button @click="handleLike(item.id)" size="small" text variant="text" type="primary" :disabled="isLikedComment(item.id)">
              <n-icon size="16" :component="IconThumbUp" />
              <n-badge :value="item.likes" :max="99" show-zero />
            </n-button>

            <n-button @click="handleReport(item.id)" size="small" text variant="text" type="primary" :disabled="isReportedComment(item.id)">
              <n-icon size="16" :component="IconAlertTriangle" />
              <n-badge :value="item.reports" :max="99" show-zero />
            </n-button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="state.hasMore" class="text-left mt-1">
      <n-button type="primary" text size="small" @click="loadSubComments()">{{ t('comment.replyleft-prefix') }} {{ state.leftCount }} {{ t('comment.replyleft-suffix') }}</n-button>
    </div>

    <div v-if="state.loading" class="text-center text-sm mt-2">loading...</div>


    <!-- 举报确认弹窗 -->
    <n-modal v-model:show="showCaptchaModal" style="width: 280px" :title="t('comment.report-confirm')" preset="dialog">
      <div class="flex items-center justify-center">
        <div>{{ num1 }} + {{ num2 }} = </div>
        <n-input-number v-model:value="captchaAnswer" placeholder="" :show-button="false" style="width: 80px; margin-left: 5px;" size="small" />
        <n-button type="primary" size="small" style="margin-left: 5px;" @click="handleReport()">OK</n-button>
      </div> 
    </n-modal>
  </div>
</template>
