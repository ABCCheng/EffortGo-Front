import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';


import {IconTemperature} from '@tabler/icons-vue';

export const tool = defineTool({
  name: translate('tools.temperature-converter.title'),
  path: '/temperature-converter',
  description: translate('tools.temperature-converter.description'),
  keywords: [
    'temperature',
    'converter',
    'degree',
    'Kelvin',
    'Celsius',
    'Fahrenheit',
    'Rankine',
  ],
  component: () => import('./temperature-converter.vue'),
  icon: IconTemperature,
  createdAt: new Date('2024-11-21'),
  updatedAt: new Date('2024-11-23'),
  badge: 'default',
});