import { TbGridPagination, TbGridSort } from './grid-column';

export interface TbFilterValue {
  value: unknown;
  operator?: string;
}

export interface TbGridSelectionState {
  allInDataset: boolean;
  ids: Set<unknown>;
}

/**
 * Represents the query parameters for the grid (sorting, pagination, filters).
 * This state is usually what determines the data to be fetched from the server.
 */
export interface TbGridQuery {
  sort: TbGridSort | null;
  pagination: TbGridPagination;
  filters: Record<string, TbFilterValue>;
}

export const emptySelection = (): TbGridSelectionState => ({
  allInDataset: false,
  ids: new Set(),
});
