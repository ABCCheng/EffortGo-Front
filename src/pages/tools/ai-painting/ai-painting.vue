<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import { useMessage } from 'naive-ui';

const loading = ref(false);
const result = ref(false);
const iterativeMode = ref(false);
const promptText = ref('');
const imageResult = ref('');
const previewImages = ref<string[]>([]);
const activeImageIndex = ref(0);
const message = useMessage();

const { t } = useI18n();

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const scrollToEnd = async (selector: string) => {
    await nextTick();
    const container = document.querySelector(selector);
    if (container) {
        container.scrollTop = container.scrollHeight;
        container.scrollLeft = container.scrollWidth;
    }
};

const fetchAIImage = async () => {
    if (!promptText.value.trim()) {
        message.warning(t('tools.ai-painting.inputEmpty'));
        return;
    }

    loading.value = true;

    try {
        // await delay(500);
        const response = await fetch('/togetherai-api/generateImages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: promptText.value,
                iterativeMode: iterativeMode.value,
                userAPIKey: '',
            }),
        });

        const data = await response.json();

        if (data && data.b64_json) {
            const newImage = `data:image/png;base64,${data.b64_json}`;
            imageResult.value = newImage;
            previewImages.value.push(newImage);
            activeImageIndex.value = previewImages.value.length - 1;
            result.value = true;

            await scrollToEnd('.image-preview');
        } else {
            message.error(t('tools.ai-painting.generateError'));
        }
    } catch (error) {
        console.error(error);
        message.error(t('tools.ai-painting.generateError') + error);
    } finally {
        loading.value = false;
    }
};

const selectImage = (index: number) => {
    activeImageIndex.value = index;
    imageResult.value = previewImages.value[index];
};
</script>

<template>
    <n-spin size="large" v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
    <div flex flex-row mx-auto w-full gap-2 justify-center>
        <c-input-text v-model:value="promptText" multiline raw-text
            :placeholder="$t('tools.ai-painting.inputPlaceHolder')" rows="3" autofocus />
        <div flex flex-col items-start gap-2>
            <div flex flex-row items-center gap-2>
                <n-switch size="small" v-model:value="iterativeMode" />
                <div>{{$t('tools.ai-painting.consistency')}}</div>
            </div>
            <n-button :disabled="loading" @click="fetchAIImage">{{$t('tools.ai-painting.generate')}}</n-button>
        </div>
    </div>

    <div v-if="result" class="result">
        <n-image v-show="imageResult" :src="imageResult" class="main-picture" style="border-radius: 8px;" width="100%"/>
        <div class="image-preview" v-if="previewImages.length > 0">
            <div v-for="(image, index) in previewImages" :key="index" class="preview-item"
                :class="{ active: activeImageIndex === index }" @click="selectImage(index)">
                <n-image :src="image" width="80" height="80" style="pointer-events: none; border-radius: 8px;" />
            </div>
        </div>
    </div>
</template>

<style lang="less" scoped>
.result {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
.image-preview {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100px !important;
    height: calc(var(--vh, 1vh) * 100 - 320px) !important;
    direction: rtl;
}

.image-preview::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.image-preview::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
}

.image-preview::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.image-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.image-preview::-webkit-scrollbar-track:hover {
  background: #e1e1e1;
}

.preview-item {
    width: 84px;
    height: 84px;
    cursor: pointer;
    flex-shrink: 0;
    border: 2px solid transparent;
    border-radius: 8px;
    transition: filter 0.3s, border-color 0.3s;
    filter: brightness(50%);

    &:hover {
        filter: brightness(100%);
    }
}

.preview-item.active {
    border-color: #FF7F50;
    filter: brightness(100%);
}

.main-picture {
    border: 2px solid #ccc;
    border-radius: 8px;
    height: calc(var(--vh, 1vh) * 100 - 320px);
}

@media screen and (max-width: 800px) {
    .result {
        flex-direction: column;
    }

    .main-picture {
        width: 100%;
        max-height: calc((100vw - 60px) * 0.75); /* same with width */;
    }

    .image-preview {
        flex-direction: row; 
        overflow-x: auto;
        overflow-y: hidden;
        width: 100% !important;
        max-width: calc(100vw - 60px);
        height: 100px !important;
        direction: ltr;
    }

    .preview-item {
        margin-right: 8px;
    }
}
</style>
