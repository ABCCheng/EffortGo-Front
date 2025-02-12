<script lang="ts" setup>
import { useThemeVars } from 'naive-ui';
import { ref, nextTick, onMounted, computed, toRefs, watch } from 'vue';
import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';
import { useIndexedDB } from '@/composable/useIndexedDB';
import { useStyleStore } from '@/stores/style.store';
import { IconCircleX } from '@tabler/icons-vue';
import { a } from 'vitest/dist/chunks/suite.B2jumIFP.js';

const theme = useThemeVars();

const styleStore = useStyleStore();
const { isSmallScreen } = toRefs(styleStore);

const loading = ref(false);
const result = ref(false);
const iterativeMode = ref(false);
const promptText = ref('');
const imageResult = ref('');
const previewImages = ref<string[]>([]);
const activeImageIndex = ref(0);
const imageStyle = ref('custom');
const message = useMessage();
const { t, locale } = useI18n();

const scrollbarRef = ref<InstanceType<typeof import("naive-ui")["NScrollbar"]> | null>(null);
const previewContainerRef = ref<HTMLDivElement | null>(null);

const imageStyles = [
  {
    label_en: "Custom",
    label_zh: "自定义风格",
    value: "custom",
    prompt: "",
  },
  {
    label_en: "Pop Art",
    label_zh: "波普艺术",
    value: "pop-art",
    prompt: "Create an image in the bold, graphic style of pop art, using primary colors, thick black outlines, and elements of mass media or comic book imagery.",
  },
  { 
    label_en: "Minimalism",
    label_zh: "极简主义",
    value: "minimalism",
    prompt: "Generate a clean, understated composition with geometric shapes, neutral colors, and a focus on negative space and simplicity.",
  },
  {
    label_en: "Retro",
    label_zh: "复古主义",
    value: "retro",
    prompt: "Design a vintage-inspired scene with faded colors, worn textures, and typography reminiscent of mid-20th century advertisements and posters.",
  },
  {
    label_en: "Watercolor",
    label_zh: "水彩艺术",
    value: "watercolor",
    prompt: "Create a soft, delicate image with flowing watercolor strokes, blending pastel shades, and organic textures for a light, airy effect.",
  },
  {
    label_en: "Fantasy",
    label_zh: "奇幻主义",
    value: "fantasy",
    prompt: "Illustrate an imaginative world filled with mythical creatures, enchanted forests, and magical elements in rich, vibrant colors.",
  },
  {
    label_en: "Moody",
    label_zh: "忧郁风格",
    value: "moody",
    prompt: "Craft an atmospheric scene with dramatic contrasts of light and dark, heavy shadows, and textured surfaces to evoke deep emotion and introspection.",
  },
  {
    label_en: "Vibrant",
    label_zh: "艳丽风格",
    value: "vibrant",
    prompt: "Generate a high-energy design with saturated colors, dynamic contrasts, and bold shapes to create an eye-catching and lively composition.",
  },
  {
    label_en: "Cinematic",
    label_zh: "电影艺术",
    value: "cinematic",
    prompt: "Compose a dramatic, movie-like scene with expressive lighting, cinematic angles, and detailed elements that tell a visual story.",
  },
  {
    label_en: "Cyberpunk",
    label_zh: "赛博朋克",
    value: "cyberpunk",
    prompt: "Envision a futuristic, neon-drenched city with advanced technology, towering skyscrapers, and dystopian elements blending with vibrant, artificial lighting.",
  },
  {
    label_en: "Surrealism",
    label_zh: "超现实主义",
    value: "surrealism",
    prompt: "Create a dreamlike, bizarre world blending impossible elements, distorted reality, and fantastical visuals that defy logic and provoke imagination.",
  },
  {
    label_en: "Deco Art",
    label_zh: "装饰艺术",
    value: "art-deco",
    prompt: "Design a lavish scene with geometric patterns, luxurious metallic accents, and symmetrical compositions, capturing the opulence and style of the 1920s and 1930s.",
  },
  {
    label_en: "Graffiti",
    label_zh: "涂鸦风格",
    value: "graffiti",
    prompt: "Produce an urban-inspired design with spray paint textures, bold street art typography, and bright, vibrant colors reflecting the raw energy of graffiti art.",
  },
];

const localizedImageStyles = computed(() => {
  return imageStyles.map(style => ({
    label: locale.value === 'zh' ? style.label_zh : style.label_en,
    value: style.value
  }))
})


const { openDatabase, closeDatabase, getAllData, addData, clearAllData, error } = useIndexedDB({
  dbName: 'ai-painting',
  storeName: 'previewImages',
  keyPath: 'id',
});

watch(previewImages, async () => {
  await nextTick();
  if (scrollbarRef.value && previewContainerRef.value) {
    scrollbarRef.value.scrollTo({ left: previewContainerRef.value.scrollWidth, behavior: "smooth" });
  }
}, { deep: true });

const loadPersistedImages = async () => {
  try {
    await openDatabase();
    const allPreviewImages = await getAllData();
    previewImages.value = allPreviewImages.map((entry: any) => entry.image);
    if (previewImages.value.length > 0) {
      imageResult.value = previewImages.value[previewImages.value.length - 1];
      activeImageIndex.value = previewImages.value.length - 1;
      result.value = true;
    }
  } catch (err) {
  } finally {
    closeDatabase();
  }
};

const updatePersistedImages = async () => {
  try {
    await openDatabase();
    await clearAllData();
    
    // only save the latest 10 images
    const lastTenImages = previewImages.value.slice(-10);
    for (const [index, image] of lastTenImages.entries()) {
      await addData({ id: index, image });
    }
  } catch (err) {
  } finally {
    closeDatabase();
  }
};

const clearPersistedImages = async () => {
  try {
    await openDatabase();
    await clearAllData();
  } catch (err) {
  } finally {
    closeDatabase(); 
  }
};

onMounted(() => {
    loadPersistedImages();
});

async function translateText(text, fromLang, toLang) {
    try {
        const response = await fetch('/translate-api/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, fromLang, toLang }),
        });
        const data = await response.json();
        if (data) {
          return data;
        }
    } catch (error) {
    }
    return text;
}

function containsNonEnglishChars(text) {
    // 匹配除英文字符、数字、常见标点符号、空格、emoji外的所有非 ASCII 字符
    const regex = /[^\x00-\x7F\u0000-\u007F\u0020\u0009\u000A\u000D\u0021\u0022\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002A\u002B\u002C\u002D\u002E\u002F\u003A\u003B\u003C\u003D\u003E\u003F\u0040\u005B\u005D\u005E\u005F\u0060\u007B\u007C\u007D\u007E\u2000-\u206F\uD83C\uD83D\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F700-\u1F77F\u1F780-\u1F7FF\u1F800-\u1F8FF\u1F900-\u1F9FF\u1FA00-\u1FA6F\u1FA70-\u1FAFF]/;
    return regex.test(text); // 如果存在其他语言字符返回 true
}

const fetchAIImage = async () => {
    if (!promptText.value.trim()) {
        message.warning(t('tools.ai-painting.inputEmpty'));
        return;
    }

    loading.value = true;

    try {
        const imageStylePrompt = imageStyles.find(style => style.value === imageStyle.value)?.prompt;
        const transPrompt = containsNonEnglishChars(promptText.value) ? await translateText(promptText.value, 'auto', 'en') : promptText.value;
        const finalPrompt = imageStylePrompt ? `${transPrompt}. Style: ${imageStylePrompt}` : transPrompt;
        
        // await delay(500);
        const response = await fetch('/togetherai-api/generateImages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: finalPrompt,
                iterativeMode: iterativeMode.value,
            }),
        });

        const data = await response.json();

        if (data && data.b64_json) {
            const newImage = `data:image/png;base64,${data.b64_json}`;
            imageResult.value = newImage;
            previewImages.value.push(newImage);
            await updatePersistedImages();
            activeImageIndex.value = previewImages.value.length - 1;
            result.value = true;
        } else {
            message.error(t('tools.ai-painting.generateError'));
        }
    } catch (error) {
        message.error(t('tools.ai-painting.generateError'));
    } finally {
        loading.value = false;
    }
};

const selectImage = (index: number) => {
    activeImageIndex.value = index;
    imageResult.value = '';
    nextTick(() => {
        imageResult.value = previewImages.value[index];
    });
};

const clearImage = async () => {
    loading.value = true;

    imageResult.value = '';
    previewImages.value = [];
    activeImageIndex.value = -1;
    result.value = false;

    await clearPersistedImages();

    loading.value = false;
};

const deleteImage = async () => {
    loading.value = true;

    previewImages.value.splice(activeImageIndex.value, 1);
    activeImageIndex.value = previewImages.value.length - 1;
    if (activeImageIndex.value < 0) {
        imageResult.value = '';
        previewImages.value = [];
        activeImageIndex.value = -1;
        result.value = false;
    } else {
        imageResult.value = previewImages.value[activeImageIndex.value];
    }
    await updatePersistedImages();
    loading.value = false;
};
</script>

<template>
    <n-spin size="large" v-if="loading" class="fixed inset-0 flex items-center justify-center bg-white/80 z-50" />
    <div class="config" flex flex-col gap-1 w-full max-w-800px justify-center items-center>
        <n-input v-model:value="promptText" :placeholder="$t('tools.ai-painting.inputPlaceHolder')" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" clearable />
        <div flex flex-row items-center gap-1 w-full>
          <n-input-group-label size="small" style="display: flex; justify-content: center; align-items: center;">{{ $t('tools.ai-painting.selectStyle') }}</n-input-group-label>
          <n-select  size="small" v-model:value="imageStyle" :options="localizedImageStyles" :placeholder="$t('tools.ai-painting.selectStyle')" />
          
          <div v-if="!isSmallScreen" flex flex-row items-center justify-end gap-2 ml-2>
            <div flex flex-row items-center gap-1>
              <n-switch data-track-label="Button_AIPaintingSwitch" size="small" v-model:value="iterativeMode" />
              <div style="white-space: nowrap;">{{$t('tools.ai-painting.consistency')}}</div>
            </div>
            
            <div flex flex-row items-center gap-1>
                <n-button size="small" type="primary" data-track-label="Button_AIPaintingGenerate" :disabled="loading" @click="fetchAIImage">{{$t('tools.ai-painting.generate')}}</n-button>
                <n-popconfirm @positive-click="clearImage" negative-text="No" positive-text="Yes">
                    <template #trigger>
                        <n-button size="small" type="primary" data-track-label="Button_AIPaintingClear" :disabled="loading || !result">{{$t('tools.ai-painting.clear')}}</n-button>
                    </template>
                    {{$t('tools.ai-painting.clearConfirm')}}
                </n-popconfirm>
            </div>
          </div>
        </div>
        <div v-if="isSmallScreen" flex flex-row items-center justify-end gap-4 w-full>
            <div flex flex-row items-center gap-1>
              <n-switch data-track-label="Button_AIPaintingSwitch" size="small" v-model:value="iterativeMode" />
              <div>{{$t('tools.ai-painting.consistency')}}</div>
            </div>
            
            <div flex flex-row items-center gap-1>
                <n-button size="small" type="primary" data-track-label="Button_AIPaintingGenerate" :disabled="loading" @click="fetchAIImage">{{$t('tools.ai-painting.generate')}}</n-button>
                <n-popconfirm @positive-click="clearImage" negative-text="No" positive-text="Yes">
                    <template #trigger>
                        <n-button size="small" type="primary" data-track-label="Button_AIPaintingClear" :disabled="loading || !result">{{$t('tools.ai-painting.clear')}}</n-button>
                    </template>
                    {{$t('tools.ai-painting.clearConfirm')}}
                </n-popconfirm>
            </div>
        </div>
    </div>

    <div v-if="result" relative w-full max-w-800px justify-center items-center flex flex-col>
        <n-scrollbar ref="scrollbarRef" x-scrollable class="image-preview" v-if="previewImages.length > 0" h-75px direction="ltr">
            <div ref="previewContainerRef" class="preview-items" flex flex-row gap-0.5>
                <div v-for="(image, index) in previewImages" :key="index" class="preview-item"
                    :class="{ active: activeImageIndex === index }" @click="selectImage(index)">
                    <n-image :src="image" width="80" height="60" style="pointer-events: none; border-radius: 8px;" />
                </div>
            </div>
        </n-scrollbar>
        <n-popconfirm  @positive-click="deleteImage" negative-text="No" positive-text="Yes">
            <template #trigger>
                <n-button class="button-hover" v-show="imageResult" size="small" data-track-label="Button_AIPaintingDelete" text variant="text">
                    <n-icon size="30" :component="IconCircleX" :color='theme.primaryColor' />
                </n-button>
            </template>
            {{$t('tools.ai-painting.deleteConfirm')}}
        </n-popconfirm>
        <n-image v-show="imageResult" :src="imageResult" style="border-radius: 8px;" :width="'100%'"/>
    </div>
</template>

<style lang="less" scoped>
.image-preview {
  display: flex;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.preview-item {
    display: flex;
    flex-wrap: nowrap;
    width: 84px;
    height: 64px;
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

.button-hover {
    position: absolute;
    top: 75px;
    right: 0;
    opacity: 0.5;
    transition: opacity 0.3s;
}
.button-hover:hover {
    opacity: 1;
}
</style>
