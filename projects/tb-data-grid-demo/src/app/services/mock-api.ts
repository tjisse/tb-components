import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { DemoStateService } from './demo-state';

/**
 * Mocks the Spring Data PagedModel response for /api/users
 */
export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const demo = inject(DemoStateService);
  const isBypass =
    typeof window !== 'undefined' && window.location.search.includes('bypassMock=true');

  if (req.url.includes('/api/users') && !isBypass) {
    const page = parseInt(req.params.get('page') || '0', 10);
    const size = parseInt(req.params.get('size') || '5', 10);
    const sort = req.params.get('sort') || 'id,asc';
    const delayMs = demo.isDelayed() ? 1000 : 0;
    const simulateError = demo.isError();

    if (simulateError) {
      // Return an observable that emits an error after the specified delay.
      // We start with a tiny delay to ensure the resource status becomes 'loading' first.
      return timer(Math.max(1, delayMs)).pipe(
        switchMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 500,
                statusText: 'Internal Server Error',
                url: req.url,
              }),
          ),
        ),
      );
    }

    const roles = ['Admin', 'User', 'Editor', 'Guest'];
    const cities = ['Amsterdam', 'Rotterdam', 'Utrecht', 'The Hague', 'Eindhoven'];
    let allUsers = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      role: roles[i % roles.length],
      address: {
        city: cities[i % cities.length],
      },
    }));

    const getNestedValue = (obj: Record<string, unknown>, key: string): unknown => {
      return key.split('.').reduce((o: unknown, i) => (o as Record<string, unknown>)?.[i], obj);
    };

    // Simple filtering logic for mock
    req.params.keys().forEach((key) => {
      if (key.includes('.contains')) {
        const field = key.split('.').slice(0, -1).join('.');
        const val = req.params.get(key)?.toLowerCase() || '';
        allUsers = allUsers.filter((u: Record<string, unknown>) =>
          getNestedValue(u, field)?.toString().toLowerCase().includes(val),
        );
      } else if (key.includes('.in')) {
        const field = key.split('.').slice(0, -1).join('.');
        const vals = (req.params.get(key) || '').split(',');
        allUsers = allUsers.filter((u: Record<string, unknown>) =>
          vals.includes(getNestedValue(u, field)?.toString() ?? ''),
        );
      }
    });

    // Simple sorting
    const [sortField, sortDir] = sort.split(',');
    allUsers.sort((a: Record<string, unknown>, b: Record<string, unknown>) => {
      const fieldA = getNestedValue(a, sortField) as string | number;
      const fieldB = getNestedValue(b, sortField) as string | number;
      if (sortDir === 'desc') {
        return fieldA < fieldB ? 1 : -1;
      }
      return fieldA > fieldB ? 1 : -1;
    });

    const start = page * size;
    const content = allUsers.slice(start, start + size);

    const mockResponse = {
      content: content,
      page: {
        size: size,
        totalElements: allUsers.length,
        totalPages: Math.ceil(allUsers.length / size),
        number: page,
      },
    };

    return timer(delayMs).pipe(map(() => new HttpResponse({ status: 200, body: mockResponse })));
  }

  return next(req);
};
