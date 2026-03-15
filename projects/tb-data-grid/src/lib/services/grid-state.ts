import { Injectable, computed, signal } from '@angular/core';
import { TbGridColumnProvider, TbGridSort } from '../models/grid-column';
import {
  TbFilterValue,
  TbGridQuery,
  TbGridSelectionState,
  emptySelection,
} from '../models/grid-state';

@Injectable()
export class TbGridStateService {
  private _query = signal<TbGridQuery>(undefined as unknown as TbGridQuery);
  private _selection = signal<TbGridSelectionState>(emptySelection());
  private _columns = signal<TbGridColumnProvider[]>([]);

  // Read-only signals for the UI
  query = this._query.asReadonly();
  selection = this._selection.asReadonly();
  columns = this._columns.asReadonly();

  // Convenience computed signals
  sort = computed(() => this._query()?.sort);
  pagination = computed(() => this._query()?.pagination);
  filters = computed(() => this._query()?.filters);

  setSort(sort: TbGridSort | null) {
    this._query.update((q) => ({
      ...q,
      sort,
      pagination: { ...q.pagination, pageIndex: 0 },
    }));
    this.clearSelection();
  }

  setPage(pageIndex: number) {
    this._query.update((q) => ({
      ...q,
      pagination: { ...q.pagination, pageIndex },
    }));
    this.clearSelection();
  }

  setPageSize(pageSize: number) {
    this._query.update((q) => ({
      ...q,
      pagination: { ...q.pagination, pageSize, pageIndex: 0 },
    }));
    this.clearSelection();
  }

  setFilter(key: string, filter: TbFilterValue | null) {
    this._query.update((q) => {
      const nextFilters = { ...q.filters };
      if (filter) {
        nextFilters[key] = filter;
      } else {
        delete nextFilters[key];
      }
      return {
        ...q,
        filters: nextFilters,
        pagination: { ...q.pagination, pageIndex: 0 },
      };
    });
    this.clearSelection();
  }

  setStateFromUrl(patch: {
    pageIndex?: number;
    pageSize?: number;
    sort?: TbGridSort | null;
    filters?: Record<string, TbFilterValue>;
  }) {
    this._query.update((q) => ({
      ...q,
      pagination: {
        ...q.pagination,
        pageIndex: patch.pageIndex ?? q.pagination.pageIndex,
        pageSize: patch.pageSize ?? q.pagination.pageSize,
      },
      sort: patch.sort !== undefined ? patch.sort : q.sort,
      filters: patch.filters ?? q.filters,
    }));
    this.clearSelection();
  }

  toggleRow(id: unknown, currentPageIds: unknown[]) {
    this._selection.update((s) => {
      if (s.allInDataset) {
        const nextIds = new Set<unknown>(currentPageIds);
        nextIds.delete(id);
        return { allInDataset: false, ids: nextIds };
      } else {
        const nextIds = new Set<unknown>(s.ids);
        if (nextIds.has(id)) {
          nextIds.delete(id);
        } else {
          nextIds.add(id);
        }
        return { ...s, ids: nextIds };
      }
    });
  }

  selectPage(ids: unknown[], selected: boolean) {
    const nextIds = new Set<unknown>(selected ? ids : []);
    this._selection.set({ allInDataset: false, ids: nextIds });
  }

  selectAllInDataset(active: boolean) {
    this._selection.set({
      allInDataset: active,
      ids: new Set<unknown>(),
    });
  }

  clearSelection() {
    this._selection.set(emptySelection());
  }

  updateTotalItems(totalItems: number) {
    this._query.update((q) => ({
      ...q,
      pagination: { ...q.pagination, totalItems },
    }));
  }

  initialize(initialQuery: TbGridQuery) {
    this._query.set(initialQuery);
  }

  registerColumn(column: TbGridColumnProvider) {
    this._columns.update((cols) => [...cols, column]);
  }

  unregisterColumn(column: TbGridColumnProvider) {
    this._columns.update((cols) => cols.filter((c) => c !== column));
  }
}
