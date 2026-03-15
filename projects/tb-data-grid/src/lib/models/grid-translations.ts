import { InjectionToken } from '@angular/core';

export interface TbGridTranslations {
  pagination: {
    next: string;
    previous: string;
    first: string;
    last: string;
    pageOf: (current: number, total: number) => string;
    itemsPerPage: string;
  };
  selection: {
    pageSelected: (count: number) => string;
    selectAll: (total: number) => string;
    allSelected: (total: number) => string;
    clearSelection: string;
  };
  filtering: {
    header: (col: string) => string;
    searchPlaceholder: string;
    clear: string;
    apply: string;
  };
  sorting: {
    header: (col: string) => string;
  };
  error: {
    message: string;
    retry: string;
  };
}

export const TB_GRID_DEFAULT_TRANSLATIONS: TbGridTranslations = {
  pagination: {
    next: 'Next',
    previous: 'Previous',
    first: 'First',
    last: 'Last',
    pageOf: (current, total) => `Page ${current} of ${total}`,
    itemsPerPage: 'Items per page:',
  },
  selection: {
    pageSelected: (count) => `All ${count} items on this page are selected.`,
    selectAll: (total) => `Select all ${total} items`,
    allSelected: (total) => `All ${total} items selected.`,
    clearSelection: 'Clear selection',
  },
  filtering: {
    header: (col) => `Filter ${col}`,
    searchPlaceholder: 'Search...',
    clear: 'Clear',
    apply: 'Apply',
  },
  sorting: {
    header: (col) => `Sort ${col}`,
  },
  error: {
    message: 'An error occurred while loading data.',
    retry: 'Retry',
  },
};

export const TB_GRID_TRANSLATIONS = new InjectionToken<TbGridTranslations>('TB_GRID_TRANSLATIONS', {
  providedIn: 'root',
  factory: () => TB_GRID_DEFAULT_TRANSLATIONS,
});
