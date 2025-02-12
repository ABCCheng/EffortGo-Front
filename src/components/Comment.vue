<script setup lang="ts">
import { ref, reactive,onMounted, nextTick } from 'vue';
import { IconUser, IconThumbUp, IconAlertTriangle, IconMessage } from '@tabler/icons-vue';
import { getComments, likeComment, reportComment } from '@/api/commentApi';
import { addLikedComment, addReportedComment, isLikedComment, isReportedComment } from '@/stores/comment.store';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import dayjs from 'dayjs';

const message = useMessage();
const { t, locale } = useI18n();

const props = defineProps({
  toolPath: String,
  parentId: Number,
});

const state = reactive ({
  comments: [] as any[],
  page: 1,
  size: 10,
  loading: false,
  hasMore: true
});

const totalComments = ref(0);

const isCommentFetch = ref(false);
const isSubmitting = ref(false);
const activeReplyId = ref<number | null>(null);

const formatDate = (date: string) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const toggleReplyInput = (commentId: number) => {
  if (activeReplyId.value === commentId) {
    activeReplyId.value = null;
  } else {
    activeReplyId.value = commentId;
  }
};

const fetchComments = async (init: boolean = false) => {
  if (state.loading || (!init && !state.hasMore)) return;

  state.loading = true;
  try {
    const response = await getComments(props.toolPath, init ? 1 : state.page, state.size, locale.value);
    if (response.code === 200 && response.data) {
      const newComments = response.data.comments || [];
      if (init) {
        state.comments = newComments;
      } else {
        state.comments.push(...newComments);
      }

      state.hasMore = state.comments.length < response.data.totalCount;
      if (state.hasMore) {
        state.page += 1;
      }

      totalComments.value = response.data.totalCount || 0;
      isCommentFetch.value = true;
    } 
  } catch (error) {
  }
  state.loading = false;
};

const handleCommentSubmitted = () => {
  state.comments = [];
  state.page = 1;
  state.size = 10;
  state.loading = false;
  state.hasMore = true;
  fetchComments(true);
};

const handleSubCommentSubmitted = async (commentId: number) => {
  handleCommentSubmitted();
  activeReplyId.value = 0;
};


const fetchLikeComment = async (commentId: number) => {
  isSubmitting.value = true;
  try {
    const response = await likeComment(commentId, locale.value);
    if (response.code === 200) {
      const comment = state.comments.find(c => c.id === commentId);
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

const reportCommentId = ref(0);
const showCaptchaModal = ref(false);
const captchaResult = ref<number | null>(null);
const captchaAnswer = ref<number | null>(null);
const num1 = ref(0);
const num2 = ref(0);

const generateCaptcha = () => {
  num1.value = Math.floor(Math.random() * 20);
  num2.value = Math.floor(Math.random() * 20);
  captchaResult.value = num1.value + num2.value;
  captchaAnswer.value = null;
};

const fetchReportComment = async (commentId: number = 0) => {
  if (!showCaptchaModal.value) {
    generateCaptcha();
    showCaptchaModal.value = true;
    reportCommentId.value = commentId;
    return;
  }

  if (captchaAnswer.value !== captchaResult.value) {
    message.error(t('message.calculateError'));
    return;
  }

  isSubmitting.value = true;
  showCaptchaModal.value = false;
  try {
    const response = await reportComment(reportCommentId.value, locale.value);
    if (response.code === 200) {
      const comment = state.comments.find(c => c.id === reportCommentId.value);
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
  fetchComments(true);
});
</script>

<template>
  <div class="comment-scroll" v-if="isCommentFetch" max-w-600px mx-auto mb-60px>
    <n-spin size="large" v-if="isSubmitting" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
    <div flex items-center justify-between mt-1 mb-0>
      <h3 m-0>{{ t('comment.comments') }}</h3>
      <div>{{ t('comment.total-prefix') + totalComments + t('comment.total-suffix')}} </div>
    </div>

    <CommentInput mt-2 :parentId="parentId" :toolPath="toolPath" @reload-comments="handleCommentSubmitted()" />

    <n-infinite-scroll mt-0 @load="fetchComments()" target="parent">
      <div v-for="comment in state.comments" :key="comment.id" mt-2>
        <n-divider style="padding: 0; margin: 0; width: 100%;" />

        <div class="comment-header flex items-start justify-between mt-1 gap-1">
          <div mt-1>
            <n-icon size="40" :component="IconUser" />
          </div>

          <div w-full flex flex-col items-start>
            <div w-full class="flex items-center justify-between">
              <div class="font-bold justify-start">{{ comment.username }}</div>
              <span class="text-sm text-gray-500">{{ formatDate(comment.createTime) }}</span>
            </div>

            <div class="comment-content text-left items-start justify-start">{{ comment.content }}</div>

            <div w-full class="flex items-center justify-end gap-1">
              <n-button @click="fetchLikeComment(comment.id)" class="flex items-center"
                data-track-label="Button_ThumpupComment" variant="text" text :bordered="false" type="primary"
                :disabled="isLikedComment(comment.id)">
                <n-icon size="20" :component="IconThumbUp" />
                <n-badge :value="comment.likes" :max="99" show-zero />
              </n-button>

              <n-button @click="fetchReportComment(comment.id)" class="flex items-center"
                data-track-label="Button_ReportComment" variant="text" text :bordered="false" type="primary"
                :disabled="isReportedComment(comment.id)">
                <n-icon size="20" :component="IconAlertTriangle" />
                <n-badge :value="comment.reports" :max="99" show-zero />
              </n-button>

              <n-button class="flex items-center" data-track-label="Button_ReplyComment" variant="text" text
                :bordered="false" type="primary" @click="toggleReplyInput(comment.id)">
                <n-icon size="20" :component="IconMessage" />
                <n-badge :value="comment.subCount" :max="99" show-zero />
              </n-button>
            </div>

            <!-- 嵌套评论输入 -->
            <CommentInput v-if="activeReplyId === comment.id" w-full mt-1 :parentId="comment.id" :toolPath="toolPath"
              @reload-comments="handleSubCommentSubmitted(comment.id)" :autofocus="true" />

            <!-- 嵌套评论列表 -->
            <SubComment v-if="comment.subCount > 0" :parent-id="comment.id" :id="'sub-comment-' + comment.id" />
          </div>
        </div>
      </div>

      <div v-if="state.loading" class="text" text-center>loading...</div>
      <div v-if="!state.hasMore" text-center mt-2>
        <n-divider style="padding: 0; margin: 0 auto; width: 30%;" />
        <div mt-1>{{ t('comment.end-comment') }}</div>
      </div>
    </n-infinite-scroll>
  </div>

  <!-- 举报确认弹窗 -->
  <n-modal v-model:show="showCaptchaModal" style="width: 280px" :title="t('comment.report-confirm')" preset="dialog">
    <div style="display: flex; justify-content: center; align-items: center;">
      <div style="width: auto;">{{ num1 }} + {{ num2 }} = </div>
      <n-input-number size="small" v-model:value="captchaAnswer" :show-button="false" style="width: 80px; margin-left: 5px;" placeholder="" />
      <n-button size="small" style="margin-left: 5px; " type="primary" @click="fetchReportComment()">OK</n-button>
    </div>
  </n-modal>
</template>

<style scoped>
::v-deep(.n-badge-sup) {
  background-color: transparent !important;
  color: inherit !important;
  border: none !important;
  box-shadow: none !important;
  margin-left: -5px !important;
}
</style>
