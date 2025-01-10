import { tool as aiPainting } from './ai-painting';
import { tool as chineseColorPicker } from './chinese-color-picker';
import { tool as drawfree } from './drawfree';
import { tool as exchangerates } from './exchangerates';
import { tool as globalWeather } from './global-weather';
import { tool as jsonEditor } from './json-editor';
import { tool as QRCodeGenerator } from './qrcode-generator';
import { tool as temperatureConverter } from './temperature-converter';
import { tool as textDiff } from './text-diff';
import { tool as tuiEditor } from './tui-editor';
import { tool as watermark } from './watermark';
import { tool as webvm } from './webvm';
import { tool as weightConverter } from './weight-converter';

import type { ToolCategory } from './tools.types';

export const toolsByCategory: ToolCategory[] = [
  {
    categoryId: 'all-tools',
    components: [aiPainting, chineseColorPicker, drawfree, exchangerates, globalWeather, jsonEditor, QRCodeGenerator, temperatureConverter, textDiff, tuiEditor, webvm, weightConverter],
  }
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, categoryId }) =>
  components.map(tool => ({ categoryId: categoryId, ...tool })),
);
