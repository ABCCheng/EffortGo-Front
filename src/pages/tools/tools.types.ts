import type { Component } from 'vue';

export interface Tool {
  // path是唯一标识，name是显示名称（涉及本地化）
  path: string
  name: string
  description: string
  keywords: string[]
  component: () => Promise<Component>
  icon: Component
  redirectFrom?: string[]
  isNew: boolean
  isUpdate: boolean
  badge: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ToolCategory {
  //id是唯一标识
  categoryId: string
  components: Tool[]
}

export type ToolWithCategory = Tool & { categoryId: string };
