import { TbGridQuery } from '../models/grid-state';

/**
 * Pure logic for mapping grid query state to Spring Data parameters.
 * Returns a plain record to avoid dependencies on Angular modules during unit testing.
 */
export class TbSpringDataMapper {
  static toParams(state: TbGridQuery): Record<string, string> {
    const params: Record<string, string> = {
      page: state.pagination.pageIndex.toString(),
      size: state.pagination.pageSize.toString(),
    };

    if (state.sort) {
      params['sort'] = `${state.sort.key},${state.sort.direction || 'asc'}`;
    }

    // Add filters
    Object.keys(state.filters).forEach((key) => {
      const filter = state.filters[key];
      if (filter && filter.value !== null && filter.value !== undefined && filter.value !== '') {
        const paramKey =
          filter.operator && filter.operator !== 'eq' ? `${key}.${filter.operator}` : key;

        // Handle array values (multiselect)
        const paramValue = Array.isArray(filter.value)
          ? filter.value.join(',')
          : filter.value.toString();

        params[paramKey] = paramValue;
      }
    });

    return params;
  }
}
