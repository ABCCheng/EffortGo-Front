<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import QRCode from 'qrcode-svg';
import { saveAs } from 'file-saver';

const message = ref('https://www.effortgo.com');
const logoScale = ref(0.3);
const size = ref(300);
const color = ref('#000000FF');
const backgroundColor = ref('#FFFFFFFF');
const padding = ref(true);
const exportType = ref('PNG');
const exportSize = ref(256);
const saving = ref(false);
const svgContainer = ref<SVGSVGElement | null>(null);

const qrType = ref('Text'); // Default QR type is Text

const wifi = ref({
  ssid: '',
  hidessid: false,
  password: '',
  encryption: 'WPA/WPA2',
});

const wifiEncryptionOptions = [
  { label: 'WPA/WPA2', value: 'WPA' },
  { label: 'WEP', value: 'WEP' },
  { label: 'None', value: 'nopass' },
];

const fileInput = ref<HTMLInputElement | null>(null);
const logoPreview = ref<string | null>(null);

const loadFileInput = () => {
  fileInput.value?.click();
};

const loadLogoImage = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearLogo = () => {
  logoPreview.value = "";
};

const preview = computed(() => {
  const content = qrType.value === 'Text' ? String(message.value || '') 
    : `WIFI:T:${wifi.value.encryption || ''};S:${wifi.value.ssid || ''};H:${wifi.value.hidessid};P:${wifi.value.password || ''};;`;
  const svg = new QRCode({
    content: content,
    padding: padding.value ? 1 : 0,
    width: size.value,
    height: size.value,
    color: color.value,
    background: backgroundColor.value,
    ecl: 'H',
    xmlDeclaration: true,
    container: 'svg',
    join: true,
    pretty: false,
  });
  const qrSvg = svg.svg();
  const parser = new DOMParser();
  const serializer = new XMLSerializer();

  // 将 QR 码解析为 SVG DOM 对象
  const qrElement = parser.parseFromString(qrSvg, 'image/svg+xml').documentElement;

  if (logoPreview.value) {
    const logoSize = size.value * logoScale.value;
    const logoX = size.value / 2 - logoSize / 2;
    const logoY = size.value / 2 - logoSize / 2;

    // 添加白色圆形边框
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleElement.setAttribute('cx', `${size.value / 2}`);
    circleElement.setAttribute('cy', `${size.value / 2}`);
    circleElement.setAttribute('r', `${logoSize / 2 + 6}`);
    circleElement.setAttribute('fill', 'white');
    qrElement.appendChild(circleElement);

    // 创建圆形裁剪路径
    const clipPathId = `clip-${Date.now()}`;
    const clipPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPathElement.setAttribute('id', clipPathId);

    const clipCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    clipCircle.setAttribute('cx', `${size.value / 2}`);
    clipCircle.setAttribute('cy', `${size.value / 2}`);
    clipCircle.setAttribute('r', `${logoSize / 2}`);
    clipPathElement.appendChild(clipCircle);
    qrElement.appendChild(clipPathElement);

    // 添加 Logo 图片并应用圆形裁剪
    const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    imageElement.setAttribute('x', `${logoX}`);
    imageElement.setAttribute('y', `${logoY}`);
    imageElement.setAttribute('width', `${logoSize}`);
    imageElement.setAttribute('height', `${logoSize}`);
    imageElement.setAttribute('href', logoPreview.value || '');
    imageElement.setAttribute('clip-path', `url(#${clipPathId})`); // 应用裁剪路径
    qrElement.appendChild(imageElement);
  }

  // 将修改后的 SVG 转换为字符串
  return serializer.serializeToString(qrElement);
});

function saveToFile() {
  saving.value = true;
  [size.value, exportSize.value] = [exportSize.value, size.value];

  if (exportType.value === 'SVG') {
    const blob = new Blob([svgContainer.value?.innerHTML || ''], { type: 'image/svg+xml;charset=utf-8' });
    saveAs(blob, 'QR-code.svg');
  } else {
    exportImage();
  }

  [size.value, exportSize.value] = [exportSize.value, size.value];
  setTimeout(() => (saving.value = false), 1500);
}

function exportImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const imgSize = size.value;
  const tempImg = new Image();

  tempImg.onload = () => {
    tempImg.width = imgSize;
    tempImg.height = imgSize;
    canvas.width = imgSize;
    canvas.height = imgSize;
    ctx?.drawImage(tempImg, 0, 0, tempImg.width, tempImg.height);

    canvas.toBlob((blob) => {
      if (blob) saveAs(blob, `QR-code.${exportType.value.toLowerCase()}`);
    }, `image/${exportType.value.toLowerCase()}`, 1);
  };

  tempImg.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContainer.value?.innerHTML || '')}`;
}

onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}logo.png`);
    if (response.ok) {
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        logoPreview.value = reader.result as string;
      };
      reader.readAsDataURL(blob);
    } else {
      console.error('Failed to load the logo image');
    }
  } catch (error) {
    console.error('Error loading logo image:', error);
  }
});
</script>

<template>
  <c-card style="padding: 10px;" flex items-center justify-center>
    <n-form label-width="auto" label-placement="left" style="min-width: 320px;">
      <!-- QR Type Selection -->
      <n-form-item label="QR Type:">
        <n-radio-group v-model:value="qrType">
          <n-radio value="Text">Text</n-radio>
          <n-radio value="WiFi">WiFi</n-radio>
        </n-radio-group>
      </n-form-item>

      <!-- Text for QR -->
      <n-form-item v-show="qrType === 'Text'" label="Text:">
        <c-input-text v-model:value="message" placeholder="Enter text or link" multiline rows="5" />
      </n-form-item>

      <!-- Wifi settings -->
      <n-form-item v-show="qrType === 'WiFi'" label="Encryption:">
        <n-select size="small" v-model:value="wifi.encryption" :options="wifiEncryptionOptions" />
      </n-form-item>
      <n-form-item v-show="qrType === 'WiFi'" label="SSID:">
        <n-input size="small" v-model:value="wifi.ssid" placeholder=""/>
        <n-checkbox pl-1 v-model:checked="wifi.hidessid" size="large"></n-checkbox>
        <div>Hide</div>
      </n-form-item>
      <n-form-item v-show="qrType === 'WiFi'" label="Password:">
        <c-input-text size="small" v-model:value="wifi.password" type="password" placeholder=""/>
      </n-form-item>

      <n-divider style="padding: 0; margin: 10px;"/>

      <!-- Colors -->
      <n-form-item label="Colors:">
        <n-color-picker size="small" v-model:value="color" />
        <n-divider vertical />
        <n-color-picker size="small" v-model:value="backgroundColor" />
      </n-form-item>

      <!-- Center logo -->
      <n-form-item label="Center logo:">
        <n-button size="small" @click="loadFileInput">Upload ···</n-button>
        <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="loadLogoImage" />
        <n-divider vertical />
        <n-button size="small" @click="clearLogo">Clear</n-button>
      </n-form-item>

      <!-- Options -->
      <n-form-item label="Padding:">
        <n-checkbox v-model:checked="padding" size="large" />
      </n-form-item>

      <n-form-item label="Export size:">
        <n-input-number size="small" v-model:value="exportSize" :min="100" :max="10000" :step="16" />
      </n-form-item>
      <n-form-item label="Export as:">
        <n-select v-model:value="exportType" size="small"
          :options="[{ label: 'SVG', value: 'SVG' }, { label: 'PNG', value: 'PNG' }, { label: 'JPG', value: 'JPG' }, { label: 'WEBP', value: 'WEBP' }]" />
        <n-button ml-1 size="small" type="primary" data-track-label="Button_QRCodeGeneratorSave" :saving="saving"
          @click="saveToFile">Export</n-button>
      </n-form-item>
    </n-form>
  </c-card>

  <!-- Preview Section -->
  <c-card style="min-width: 350px; background: repeating-linear-gradient(-45deg, #eee, #eee 10px, #ccc 10px, #ccc 20px);">
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" v-html="preview" ref="svgContainer"></svg>
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(.n-form-item-feedback-wrapper) {
  display: none !important;
}

.n-form-item label {
  padding-bottom: 4px; /* 控制标签和输入框之间的间距 */
}
</style>