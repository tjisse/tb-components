import { InputSignal, Signal, TemplateRef } from '@angular/core';

export type TbFilterType = 'text' | 'number' | 'date' | 'select';

export interface TbFilterOption {
  label: string;
  value: unknown;
}

export interface TbGridColumnProvider {
  key: InputSignal<string>;
  header: InputSignal<string>;
  sortable: InputSignal<boolean>;
  filterable: InputSignal<boolean>;
  filterType: InputSignal<TbFilterType>;
  filterOptions: InputSignal<TbFilterOption[] | undefined>;
  width: InputSignal<string>;
  cellTemplate: Signal<TemplateRef<unknown> | undefined>;
}

export interface TbGridColumn {
  key: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  filterType?: TbFilterType;
  filterOptions?: TbFilterOption[]; // If provided, multiselect is used
  width?: string;
  cellTemplate?: unknown;
  headerTemplate?: unknown;
}

export type TbSortDirection = 'asc' | 'desc' | null;

export interface TbGridSort {
  key: string;
  direction: TbSortDirection;
}

export interface TbGridPagination {
  pageIndex: number;
  pageSize: number;
  totalItems?: number;
}
