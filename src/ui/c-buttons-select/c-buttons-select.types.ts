import type { CSelectOption } from '../n-select/n-select.types';

export type CButtonSelectOption<T> = CSelectOption<T> & {
  tooltip?: string
};
