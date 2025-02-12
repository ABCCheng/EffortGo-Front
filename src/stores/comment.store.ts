import { ref, watch } from 'vue';

const LIKED_COMMENTS_KEY = 'liked_comments';
const REPORTED_COMMENTS_KEY = 'reported_comments';

const MAX_RECORDS = 50;

// 让数据成为响应式的
const likedComments = ref<number[]>(JSON.parse(localStorage.getItem(LIKED_COMMENTS_KEY) || '[]'));
const reportedComments = ref<number[]>(JSON.parse(localStorage.getItem(REPORTED_COMMENTS_KEY) || '[]'));

// 监听变化并自动同步到 localStorage
watch(likedComments, (newVal) => {
  localStorage.setItem(LIKED_COMMENTS_KEY, JSON.stringify(newVal));
}, { deep: true });

watch(reportedComments, (newVal) => {
  localStorage.setItem(REPORTED_COMMENTS_KEY, JSON.stringify(newVal));
}, { deep: true });

export const addLikedComment = (commentId: number): void => {
  if (!likedComments.value.includes(commentId)) {
    likedComments.value.push(commentId);
    if (likedComments.value.length > MAX_RECORDS) {
      likedComments.value.shift(); // 超过 50 条，删除最早的
    }
  }
};

export const addReportedComment = (commentId: number): void => {
  if (!reportedComments.value.includes(commentId)) {
    reportedComments.value.push(commentId);
    if (reportedComments.value.length > MAX_RECORDS) {
      reportedComments.value.shift();
    }
  }
};

// 直接从响应式变量中获取数据
export const isLikedComment = (commentId: number): boolean => {
  return likedComments.value.includes(commentId);
};

export const isReportedComment = (commentId: number): boolean => {
  return reportedComments.value.includes(commentId);
};
