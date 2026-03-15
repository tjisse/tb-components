import { beforeEach, describe, expect, it } from 'vitest';
import { TbGridStateService } from './grid-state';

describe('TbGridStateService (Unit)', () => {
  let service: TbGridStateService;

  beforeEach(() => {
    service = new TbGridStateService();
    service.initialize({
      pagination: { pageIndex: 0, pageSize: 10 },
      sort: null,
      filters: {},
    });
  });

  it('should initialize with initial state', () => {
    const query = service.query();
    expect(query.pagination.pageIndex).toBe(0);
    expect(service.selection().allInDataset).toBe(false);
    expect(service.selection().ids.size).toBe(0);
  });

  it('should allow manual initialization with custom query', () => {
    service.initialize({
      pagination: { pageIndex: 2, pageSize: 50 },
      sort: { key: 'email', direction: 'desc' },
      filters: { role: { value: 'Admin' } },
    });

    const query = service.query();
    expect(query.pagination.pageIndex).toBe(2);
    expect(query.pagination.pageSize).toBe(50);
    expect(query.sort?.key).toBe('email');
    expect(query.filters['role'].value).toBe('Admin');
  });

  it('should update sorting and reset page', () => {
    service.setPage(5);
    service.setSort({ key: 'name', direction: 'asc' });

    expect(service.sort()?.key).toBe('name');
    expect(service.pagination().pageIndex).toBe(0);
  });

  it('should toggle row selection', () => {
    const ids = [1, 2, 3];
    service.toggleRow(1, ids);
    expect(service.selection().ids.has(1)).toBe(true);

    service.toggleRow(1, ids);
    expect(service.selection().ids.has(1)).toBe(false);
  });

  it('should handle Select All in Dataset and drop it on single toggle', () => {
    service.selectAllInDataset(true);
    expect(service.selection().allInDataset).toBe(true);

    // Toggling a row should drop "All in Dataset" and select other IDs on page
    service.toggleRow(1, [1, 2, 3]);
    expect(service.selection().allInDataset).toBe(false);
    expect(service.selection().ids.has(2)).toBe(true);
    expect(service.selection().ids.has(3)).toBe(true);
    expect(service.selection().ids.has(1)).toBe(false);
  });

  it('should clear selection on page change', () => {
    service.toggleRow(1, [1, 2]);
    expect(service.selection().ids.size).toBe(1);

    service.setPage(1);
    expect(service.selection().ids.size).toBe(0);
  });
});
