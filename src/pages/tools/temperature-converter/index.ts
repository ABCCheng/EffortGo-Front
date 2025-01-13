import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';


import {IconTemperature} from '@tabler/icons-vue';


export const tool = defineTool({
  name: translate('tools.temperature-converter.title').value,
  path: '/temperature-converter',
  description: translate('tools.temperature-converter.description').value,
  keywords: [
    'temperature unit convert',
    'Kelvin',
    'Celsius',
    'Fahrenheit',
    'Rankine',
    '温度单位转换',
    '开尔文',
    '华氏度',
    '摄氏度',
    '兰氏度'
  ],
  component: () => import('./temperature-converter.vue'),
  icon: IconTemperature,
  createdAt: new Date('2024-11-21'),
  updatedAt: new Date('2024-11-23'),
  badge: 'default',
});