import { animate, style, transition, trigger } from '@angular/animations';
import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  TemplateRef,
  computed,
  effect,
  inject,
  input,
  output,
  runInInjectionContext,
  untracked,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TbGridTruncatedDirective } from '../../directives/tb-grid-truncated/tb-grid-truncated';
import { TbGridColumn, TbGridColumnProvider, TbGridSort } from '../../models/grid-column';
import { TbFilterValue, TbGridQuery, TbGridSelectionState } from '../../models/grid-state';
import { TB_GRID_TRANSLATIONS } from '../../models/grid-translations';
import { TbGridStateService } from '../../services/grid-state';
import { TbGridUrlService } from '../../services/url-state';
import { TbGridColumnComponent } from '../tb-grid-column/tb-grid-column';
import { TbGridFilterComponent } from '../tb-grid-filter/tb-grid-filter';
import { TbGridSpinnerComponent } from '../tb-grid-spinner/tb-grid-spinner';

@Component({
  selector: 'tb-data-grid',
  imports: [
    NgTemplateOutlet,
    FormsModule,
    TbGridFilterComponent,
    TbGridSpinnerComponent,
    TbGridTruncatedDirective,
    TbGridColumnComponent,
  ],
  providers: [
    {
      provide: TbGridStateService,
      useFactory: () =>
        inject(TbGridStateService, { optional: true, skipSelf: true }) || new TbGridStateService(),
    },
    {
      provide: TbGridUrlService,
      useFactory: () =>
        inject(TbGridUrlService, { optional: true, skipSelf: true }) || new TbGridUrlService(),
    },
  ],
  animations: [
    trigger('bannerAnimation', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('250ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('200ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
    trigger('crossFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ pointerEvents: 'none' }),
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  templateUrl: './tb-data-grid.html',
  styleUrl: './tb-data-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TbDataGridComponent<T extends Record<string, unknown>> {
  data = input<T[]>([]);

  columns = computed(() => {
    return this.stateService.columns().map((col: TbGridColumnProvider) => ({
      key: col.key(),
      header: col.header(),
      sortable: col.sortable(),
      filterable: col.filterable(),
      filterType: col.filterType(),
      filterOptions: col.filterOptions(),
      width: col.width(),
      cellTemplate: col.cellTemplate(),
    }));
  });

  totalItems = input<number>(0);
  urlSync = input<boolean>(true);
  urlPrefix = input<string>('');
  fixedHeight = input<boolean>(true);
  selectable = input<boolean>(false);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  loading = input<boolean>(false);
  loadingThreshold = input<number>(500);
  error = input<unknown>(null);
  rowIdKey = input<keyof T | string>('id');
  paginationButtonClass = input<string>('');
  initialQuery = input.required<TbGridQuery>();

  // Grid changes emitted to parent
  queryChange = output<TbGridQuery>();
  selectionChange = output<TbGridSelectionState>();
  retry = output<void>();

  protected t = inject(TB_GRID_TRANSLATIONS);
  private stateService = inject(TbGridStateService);
  private urlService = inject(TbGridUrlService);
  private injector = inject(Injector);

  // Selection signals
  selection = this.stateService.selection;

  isPageSelected = computed(() => {
    if (this.error()) return false;
    if (this.selection().allInDataset) return true;
    const data = this.data();
    if (data.length === 0) return false;
    const key = this.rowIdKey();
    return data.every((row) => this.selection().ids.has(this.getRowValue(row, key)));
  });

  isPagePartiallySelected = computed(() => {
    if (this.error()) return false;
    if (this.selection().allInDataset) return false;
    const data = this.data();
    const key = this.rowIdKey();
    const selectedCount = data.filter((row) =>
      this.selection().ids.has(this.getRowValue(row, key)),
    ).length;
    return selectedCount > 0 && selectedCount < data.length;
  });

  placeholderRows = computed(() => {
    if (!this.fixedHeight()) return [];
    const currentCount = this.error() ? 0 : this.data().length;
    const targetCount = this.pageSize();
    if (currentCount >= targetCount) return [];
    return Array(targetCount - currentCount).fill(0);
  });

  showSelectAllBanner = computed(() => {
    if (this.error()) return false;
    return (
      this.isPageSelected() &&
      !this.selection().allInDataset &&
      this.totalItems() > this.data().length
    );
  });

  // Derived signals from state service
  currentPage = computed(() => this.stateService.pagination().pageIndex);
  pageSize = computed(() => this.stateService.pagination().pageSize);
  totalPages = computed(() => {
    const total = this.totalItems() || 0;
    const size = this.pageSize() || 10;
    return Math.ceil(total / size) || 1;
  });

  isFirstPage = computed(() => this.currentPage() === 0);
  isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);

  constructor() {
    // Initialize initial query state if provided
    effect(
      () => {
        const initial = untracked(() => this.initialQuery());
        untracked(() => {
          this.stateService.initialize(initial);
        });
      },
      { allowSignalWrites: true },
    );

    // Notify parent when query changes
    effect(() => {
      const query = this.stateService.query();
      this.queryChange.emit(query);
    });

    // Notify parent when selection changes
    effect(() => {
      const selection = this.selection();
      this.selectionChange.emit(selection);
    });

    // Initialize URL sync if enabled
    effect(() => {
      const syncEnabled = this.urlSync();
      const prefix = this.urlPrefix();

      if (syncEnabled) {
        const initial = untracked(() => this.initialQuery());
        untracked(() => {
          runInInjectionContext(this.injector, () => {
            this.urlService.sync(prefix, initial);
          });
        });
      }
    });
  }

  getCustomTemplate(key: string): TemplateRef<unknown> | null {
    const col = this.columns().find((c) => c.key === key);
    return (col?.cellTemplate as TemplateRef<unknown>) || null;
  }

  togglePageSelection(event: Event) {
    const ids = this.data().map((row) => this.getRowValue(row, this.rowIdKey()));

    if (this.isPagePartiallySelected()) {
      event.preventDefault();
      this.stateService.selectPage(ids, false);
    } else {
      const nextChecked = !this.isPageSelected();
      this.stateService.selectPage(ids, nextChecked);
    }
  }

  toggleRowSelection(id: unknown) {
    const key = this.rowIdKey();
    const currentPageIds = this.data().map((row) => this.getRowValue(row, key));
    this.stateService.toggleRow(id, currentPageIds);
  }

  isRowSelected(id: unknown): boolean {
    const sel = this.selection();
    if (sel.allInDataset) return true;
    return sel.ids.has(id);
  }

  selectAllInDataset() {
    this.stateService.selectAllInDataset(true);
  }

  clearSelection() {
    this.stateService.clearSelection();
  }

  toggleSort(col: TbGridColumn) {
    if (!col.sortable) return;

    const currentSort = this.stateService.sort();
    let nextSort: TbGridSort | null;

    if (currentSort?.key === col.key) {
      if (currentSort?.direction === 'asc') {
        nextSort = { key: col.key, direction: 'desc' };
      } else if (currentSort?.direction === 'desc') {
        nextSort = null; // Unsorted state
      } else {
        nextSort = { key: col.key, direction: 'asc' };
      }
    } else {
      nextSort = { key: col.key, direction: 'asc' };
    }

    this.stateService.setSort(nextSort);
  }

  nextPage() {
    if (!this.isLastPage()) {
      this.stateService.setPage(this.currentPage() + 1);
    }
  }

  prevPage() {
    if (!this.isFirstPage()) {
      this.stateService.setPage(this.currentPage() - 1);
    }
  }

  firstPage() {
    if (!this.isFirstPage()) {
      this.stateService.setPage(0);
    }
  }

  lastPage() {
    if (!this.isLastPage()) {
      this.stateService.setPage(this.totalPages() - 1);
    }
  }

  onPageSizeChange(newSize: string | number) {
    this.stateService.setPageSize(typeof newSize === 'string' ? parseInt(newSize, 10) : newSize);
  }

  onFilterChange(key: string, filter: TbFilterValue | null) {
    this.stateService.setFilter(key, filter);
  }

  getFilter(key: string): TbFilterValue | null {
    return this.stateService.filters()[key] || null;
  }

  isSortActive(key: string): boolean {
    const sort = this.stateService.sort();
    return sort?.key === key && !!sort.direction;
  }

  getSortIconClass(key: string): string {
    const sort = this.stateService.sort();
    if (sort?.key !== key) return 'fas fa-sort';
    return sort.direction === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
  }

  getAriaSort(key: string): 'none' | 'ascending' | 'descending' {
    const sort = this.stateService.sort();
    if (sort?.key !== key) return 'none';
    return sort.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected getRowValue(row: T, key: string | number | symbol): unknown {
    if (!key) return null;
    if (typeof key !== 'string') return row[key as keyof T];
    if (!key.includes('.')) return row[key as keyof T];

    return key
      .split('.')
      .reduce((acc: unknown, part) => (acc as Record<string, unknown>)?.[part], row);
  }
}
