import { describe, expect, it } from 'vitest';
import { TbGridQuery } from '../models/grid-state';
import { TbSpringDataMapper } from './spring-data-mapper';

describe('TbSpringDataMapper (Pure Unit)', () => {
  it('should map basic state to plain params', () => {
    const state: TbGridQuery = {
      pagination: { pageIndex: 2, pageSize: 20 },
      sort: { key: 'name', direction: 'desc' },
      filters: {},
    };

    const params = TbSpringDataMapper.toParams(state);

    expect(params['page']).toBe('2');
    expect(params['size']).toBe('20');
    expect(params['sort']).toBe('name,desc');
  });

  it('should map filters with operators', () => {
    const state: TbGridQuery = {
      pagination: { pageIndex: 0, pageSize: 10 },
      sort: null,
      filters: {
        name: { value: 'John', operator: 'contains' },
      },
    };

    const params = TbSpringDataMapper.toParams(state);
    expect(params['name.contains']).toBe('John');
  });

  it('should map multiselect filters with .in operator', () => {
    const state: TbGridQuery = {
      pagination: { pageIndex: 0, pageSize: 10 },
      sort: null,
      filters: {
        role: { value: ['Admin', 'Editor'], operator: 'in' },
      },
    };

    const params = TbSpringDataMapper.toParams(state);
    expect(params['role.in']).toBe('Admin,Editor');
  });
});
