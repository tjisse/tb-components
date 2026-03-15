import { EffectRef, Injectable, OnDestroy, effect, inject, untracked } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TbGridSort } from '../models/grid-column';
import { TbFilterValue, TbGridQuery } from '../models/grid-state';
import { TbGridStateService } from './grid-state';

@Injectable()
export class TbGridUrlService implements OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private stateService = inject(TbGridStateService);

  private prefix = '';
  private sub?: Subscription;
  private effectRef?: EffectRef;
  private defaultQuery?: TbGridQuery;

  /**
   * Initializes the grid state from the current URL query parameters
   * and sets up an effect to push state changes back to the URL.
   */
  sync(prefix = '', initialQuery?: TbGridQuery) {
    this.prefix = prefix ? `${prefix}_` : '';
    this.defaultQuery = initialQuery;

    // Cleanup previous subscription and effect if any
    this.sub?.unsubscribe();
    this.effectRef?.destroy();

    // 1. Initial Load & Browser Navigation: URL -> State
    this.sub = this.route.queryParamMap.subscribe((params) => {
      this.applyUrlToState(params);
    });

    // 2. Continuous Sync: State -> URL
    this.effectRef = effect(() => {
      const query = this.stateService.query();
      // We use untracked to prevent circular triggers if the router also emits
      untracked(() => this.applyStateToUrl(query));
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.effectRef?.destroy();
  }

  private applyUrlToState(params: ParamMap) {
    const currentQuery = this.stateService.query();
    const d = this.defaultQuery;

    // Extract state from URL, defaulting to the initialQuery values
    const page = params.get(`${this.prefix}page`);
    const size = params.get(`${this.prefix}size`);
    const pageIndex = page ? parseInt(page, 10) : (d?.pagination.pageIndex ?? 0);
    const pageSize = size ? parseInt(size, 10) : (d?.pagination.pageSize ?? 10);

    const sortParam = params.get(`${this.prefix}sort`);
    let sort: TbGridSort | null = d?.sort ?? null;
    if (sortParam) {
      const [key, direction] = sortParam.split(',');
      sort = { key, direction: direction as TbGridSort['direction'] };
    }

    const filters: Record<string, TbFilterValue> = { ...(d?.filters ?? {}) };
    params.keys
      .filter((k) => k.startsWith(`${this.prefix}f_`))
      .forEach((k) => {
        const key = k.replace(`${this.prefix}f_`, '');
        const values = params.getAll(k);
        if (values.length > 0) {
          const allValues = values.flatMap((v) => v.split(','));
          const isMultiselect = allValues.length > 1;

          filters[key] = {
            value: isMultiselect ? allValues : allValues[0],
            operator: isMultiselect ? 'in' : 'contains',
          };
        }
      });

    const nextQuery: TbGridQuery = {
      pagination: { ...currentQuery.pagination, pageIndex, pageSize },
      sort,
      filters,
    };

    // Only update if the meaningful state has actually changed
    if (JSON.stringify(currentQuery) !== JSON.stringify(nextQuery)) {
      this.stateService.setStateFromUrl({ pageIndex, pageSize, sort, filters });
    }
  }

  private applyStateToUrl(query: TbGridQuery) {
    const queryParams: Record<string, string | null> = {};
    const d = this.defaultQuery;

    // Pagination: only add to URL if different from default
    if (d) {
      queryParams[`${this.prefix}page`] =
        query.pagination.pageIndex !== d.pagination.pageIndex
          ? query.pagination.pageIndex.toString()
          : null;
      queryParams[`${this.prefix}size`] =
        query.pagination.pageSize !== d.pagination.pageSize
          ? query.pagination.pageSize.toString()
          : null;
    }

    // Sort: only add to URL if different from default
    const isDefaultSort = JSON.stringify(query.sort) === JSON.stringify(d?.sort ?? null);
    queryParams[`${this.prefix}sort`] =
      query.sort && !isDefaultSort ? `${query.sort.key},${query.sort.direction}` : null;

    // Filters: clear old and add current (if different from default)
    this.route.snapshot.queryParamMap.keys
      .filter((k) => k.startsWith(`${this.prefix}f_`))
      .forEach((k) => (queryParams[k] = null));

    Object.keys(query.filters).forEach((key) => {
      const filter = query.filters[key];
      const defaultValue = d?.filters[key];

      if (filter?.value && JSON.stringify(filter) !== JSON.stringify(defaultValue)) {
        queryParams[`${this.prefix}f_${key}`] = Array.isArray(filter.value)
          ? filter.value.join(',')
          : filter.value.toString();
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
