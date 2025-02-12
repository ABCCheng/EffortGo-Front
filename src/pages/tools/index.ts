import { tool as aiPainting } from './ai-painting';
import { tool as chineseColorPicker } from './chinese-color-picker';
import { tool as dailyTop } from './daily-top'
import { tool as drawdb } from './drawdb'
import { tool as drawfree } from './drawfree';
import { tool as excalidraw } from './excalidraw';
import { tool as exchangerates } from './exchangerates';
import { tool as globalWeather } from './global-weather';
import { tool as integerBaseConverter } from './integer-base-converter';
import { tool as IPLocation } from './ip-location';
import { tool as jsonEditor } from './json-editor';
import { tool as lengthConverter } from './length-converter';
import { tool as mdHtmlConverter } from './md-html-converter';
import { tool as noteEase } from './note-ease';
import { tool as QRCodeGenerator } from './qrcode-generator';
import { tool as speedConverter } from './speed-converter';
import { tool as temperatureConverter } from './temperature-converter';
import { tool as textDiff } from './text-diff';
import { tool as todoList } from './todo-list'
import { tool as tuiEditor } from './tui-editor';
import { tool as watermark } from './watermark';
import { tool as webvm } from './webvm';
import { tool as weightConverter } from './weight-converter';

import type { ToolCategory } from './tools.types';

export const toolsByCategory: ToolCategory[] = [
  {
    categoryId: 'daily-utilities-tools',
    components: [dailyTop, exchangerates, globalWeather, IPLocation, noteEase, todoList],
  },
  {
    categoryId: 'image-color-tools',
    components: [aiPainting, chineseColorPicker, drawfree, excalidraw, QRCodeGenerator, tuiEditor],
  },
  {
    categoryId: 'data-conversion-tools',
    components: [integerBaseConverter, lengthConverter, speedConverter, temperatureConverter, weightConverter],
  },
  {
    categoryId: 'tech-development-tools',
    components: [drawdb, jsonEditor, mdHtmlConverter, textDiff, webvm],
  }
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, categoryId }) =>
  components.map(tool => ({ categoryId: categoryId, ...tool })),
);
