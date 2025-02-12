<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { addComment } from '@/api/commentApi';
import { useI18n } from 'vue-i18n';
import { useMessage } from 'naive-ui';
import { getOrGenerateDeviceId, setUserName, getUserName } from '@/stores/device.store';

const message = useMessage();
const { t, locale } = useI18n();

const inputRef = ref<InstanceType<typeof import("naive-ui")["NInput"]> | null>(null);

const emit = defineEmits(['reload-comments']);

const props = defineProps({
  toolPath: String,
  parentId: Number,
  autofocus: {
    type: Boolean,
    default: false,
  },
});

const newComment = ref<string | null>('');
const userName = ref<string | null>(getUserName() || t('comment.default-name'));
const captchaResult = ref<number | null>(null);
const captchaAnswer = ref<number | null>(null);
const num1 = ref(0);
const num2 = ref(0);
const isSubmitting = ref(false);

// 生成验证码的函数
const generateCaptcha = () => {
  num1.value = Math.floor(Math.random() * 30);
  num2.value = Math.floor(Math.random() * 30);
  captchaResult.value = num1.value + num2.value;
  captchaAnswer.value = null;
};

const submitComment = async () => {
  if (!newComment.value || captchaAnswer.value !== captchaResult.value) {
    message.error(t('message.calculateError'));
    return;
  }

  isSubmitting.value = true;

  const commentData = {
    deviceId: getOrGenerateDeviceId(), // 设备 ID，存入缓存
    username: userName.value || t('comment.default-name'), // 用户名
    toolPath: props.toolPath, // 工具路径
    content: newComment.value, // 评论内容
    parentId: props.parentId, // 父评论 ID
  };

  try {
    const response = await addComment(commentData, locale.value);
    if (response.code === 200) {
      setUserName(userName.value);
      newComment.value = '';  // 清空评论框
      emit('reload-comments');   // 重新加载评论列表
      message.success(response.message + ' - Code: ' + response.code.toString());
    } else {
      message.error(response.message + ' - Code: ' + response.code.toString());
    }
  } catch (error) {
    message.error(t('message.operateError'));
    generateCaptcha();
  }
  isSubmitting.value = false;
};

watch([newComment, userName], ([newCommentVal, userNameVal], [oldCommentVal, oldUserNameVal]) => {
  // 处理空格修剪
  if (newCommentVal && newCommentVal !== newCommentVal.trim()) {
    nextTick(() => newCommentVal && (newComment.value = newCommentVal.trim()));
  }
  if (userNameVal && userNameVal !== userNameVal.trim()) {
    nextTick(() => userNameVal && (userName.value = userNameVal.trim()));
  }

  // 处理长度限制
  if (newCommentVal && newCommentVal.length > 150) {
    nextTick(() => (newComment.value = oldCommentVal));
    return;
  }

  if (userNameVal && userNameVal.length > 20) {
    nextTick(() => (userName.value = oldUserNameVal));
    return;
  }

  // 评论内容变化时刷新验证码
  generateCaptcha();
});

onMounted(() => {
  generateCaptcha();  // 初始化时生成验证码
  if (inputRef.value && props.autofocus) {
    inputRef.value.focus(); // 手动聚焦
  }
});
</script>

<template>
  <div class="comment-input">
    <n-spin size="large" v-if="isSubmitting" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
    <n-input ref="inputRef" v-model:value="newComment" :placeholder="t('comment.rule')" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" clearable />
    <div v-if="newComment" flex mt-1 items-center justify-center>
      <div class="whitespace-nowrap min-w-fit"> {{ t('comment.word-limit-prefix') + (150 - (newComment?.length || 0)) + t('comment.word-limit-suffix')}} </div>
      <n-divider vertical />
      <div flex items-center justify-start gap-1 flex-1>
        <div class="whitespace-nowrap">{{ t('comment.change-name') }}</div>
        <n-input size="tiny" v-model:value="userName" placeholder="" clearable />
      </div>
    </div>

    <div v-if="newComment" flex items-center justify-end>
      <div flex items-center mt-1 gap-1>
        <div> {{ num1 }} + {{ num2 }} =</div>
        <n-input-number size="tiny" v-model:value="captchaAnswer" :show-button="false" style="width: 50px;" placeholder="" />
        <n-button size="tiny" type="primary" @click="submitComment">{{ t('comment.add-comment') }}</n-button>
      </div>
    </div>
  </div>
</template>
