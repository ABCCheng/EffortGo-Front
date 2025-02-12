<script setup lang="ts">
import { ref, onMounted, h } from "vue";
import { useI18n } from 'vue-i18n';
import { useThemeVars, useMessage } from 'naive-ui';
import {
  IconTransitionTop, IconX,
  IconCircleNumber1Filled, IconCircleNumber2Filled, IconCircleNumber3Filled,
  IconNumber4Small, IconNumber5Small, IconNumber6Small, IconNumber7Small, IconNumber8Small, IconNumber9Small,
  IconNumber10Small, IconNumber11Small, IconNumber12Small, IconNumber13Small, IconNumber14Small, IconNumber15Small,
} from '@tabler/icons-vue'

const CACHE_KEY = 'todo-list-cache';

type Todo = {
  item: string;
  completed: boolean;
};

const { t } = useI18n();
const theme = useThemeVars();
const message = useMessage();
const todoInput = ref('');
const todoList = ref<Todo[]>([]);

const icons = [
  IconCircleNumber1Filled,
  IconCircleNumber2Filled,
  IconCircleNumber3Filled,
  IconNumber4Small,
  IconNumber5Small,
  IconNumber6Small,
  IconNumber7Small,
  IconNumber8Small,
  IconNumber9Small,
  IconNumber10Small,
  IconNumber11Small,
  IconNumber12Small,
  IconNumber13Small,
  IconNumber14Small,
  IconNumber15Small,
];

const rankColor = (index: number): string => {
  if (index === 0) {
    return '#EA444D';
  } else if (index === 1) {
    return '#ED702D';
  } else if (index === 2) {
    return '#EFAD3F';
  } else {
    return '#C28C70';
  }
};

const loadTodoList = () => {
  const cache = localStorage.getItem(CACHE_KEY);
  if (cache) {
    todoList.value = JSON.parse(cache).data;
  }
};

const saveTodoList = () => {
  localStorage.setItem(CACHE_KEY, JSON.stringify({ data: todoList.value }));
};

const addTodo = () => {
  if (todoInput.value.trim()) {
    if (todoList.value.length >= 15) {
      message.warning(t('tools.todo-list.limit'));
      return;
    }
    todoList.value.push({ item: todoInput.value, completed: false });
    todoInput.value = '';
    saveTodoList();
  }
};

const toggleCompleted = (index: number) => {
  todoList.value[index].completed = !todoList.value[index].completed;
  saveTodoList();
};

const moveToTop = (index: number) => {
  if (index > -1) {
    const temp = todoList.value[index];
    todoList.value.splice(index, 1);  // 删除该元素
    todoList.value.unshift(temp);  // 将该元素添加到列表的最前面
    saveTodoList();
  }
};

const removeTodo = (index: number) => {
  todoList.value.splice(index, 1);
  saveTodoList();
};

onMounted(() => {
  loadTodoList();
});

</script>

<template>
  <div w-full max-w-800px>
    <div flex items-center gap-2 mb-3>
      <n-auto-complete v-model:value="todoInput" clearable :placeholder="$t('tools.todo-list.inputPlaceHolder')" @keyup.enter="addTodo"/>
      <n-button data-track-label="Button_TodoListAdd" @click="addTodo" type="primary">{{ t('tools.todo-list.add') }}</n-button>
    </div>

    <div class="todo-list-container">
      <n-list bordered>
        <transition-group name="todo-list" tag="div">
          <n-list-item v-for="(todo, index) in todoList" :key="todo.item" style="margin:0; padding: 5px 5px">
            <div class="flex justify-between items-center gap-1">
              <div class="flex items-center">
                <n-icon :ml="index < 3 ? 0 : -0.5" :mr="index < 3 ? 0.5 : -0.5" :component="() => h(icons[index])" :size="index < 3 ? 25 : 30" :color="rankColor(index)" />
                <div @click="toggleCompleted(index)" :class="{ 'line-through text-gray-500': todo.completed }" class="todo-item cursor-pointer font-size-3.5 text-[#C28C70]">
                  {{ todo.item }}
                </div>
              </div>

              <div class="flex gap-1.5">
                <n-button size="tiny" v-show="index !== 0" @click="moveToTop(index)" circle variant="text">
                  <n-icon size="15" :component="IconTransitionTop" :color='theme.primaryColor' />
                </n-button>
                <n-button size="tiny" @click="removeTodo(index)" circle variant="text">
                  <n-icon size="15" :component="IconX" :color='theme.primaryColor' />
                </n-button>
              </div>
            </div>
          </n-list-item>
        </transition-group>
      </n-list>
    </div>
  </div>
</template>

<style scoped>
.line-through {
  text-decoration: line-through;
}

.todo-item {
  word-break: break-word;
}

.todo-list-container {
  overflow: hidden;
}

.todo-list-enter-active {
  transition: all 0.3s ease;
}

.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}


.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
