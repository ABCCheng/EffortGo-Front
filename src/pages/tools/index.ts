import { tool as temperatureConverter } from './temperature-converter';
import { tool as textDiff } from './text-diff';

import type { ToolCategory } from './tools.types';

export const toolsByCategory: ToolCategory[] = [
  {
    categoryId: 'all-tools',
    components: [temperatureConverter, textDiff],
  }
];

export const tools = toolsByCategory.flatMap(({ components }) => components);
export const toolsWithCategory = toolsByCategory.flatMap(({ components, categoryId }) =>
  components.map(tool => ({ categoryId: categoryId, ...tool })),
);
