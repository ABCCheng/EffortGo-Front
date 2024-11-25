import { isAfter, subWeeks } from 'date-fns'; // 导入日期函数
import type { Tool } from './tools.types'; // 导入 Tool 类型

// 定义一个泛型类型，用于将某个字段变为可选
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// defineTool 函数：根据工具的创建和更新时间判断其是否为新工具或最近更新工具
export function defineTool(tool: WithOptional<Tool, 'isNew' | 'isUpdate'>) {
  // 计算工具是否是最近更新的
  const isUpdate = tool.updatedAt ? isAfter(tool.updatedAt, subWeeks(new Date(), 1)) : false;

  // 计算工具是否为新创建的
  const isNew = !isUpdate ? (tool.createdAt ? isAfter(tool.createdAt, subWeeks(new Date(), 1)) : false) : false;

  // 返回一个包含 isNew, isUpdate 和工具本身的对象
  return {
    isNew,
    isUpdate,
    ...tool,
  };
}
