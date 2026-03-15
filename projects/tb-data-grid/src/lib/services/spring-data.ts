import { HttpClient, HttpParams } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Signal } from '@angular/core';
import { TbGridQuery } from '../models/grid-state';
import { SpringDataPagedModel } from '../models/spring-data';
import { TbSpringDataMapper } from './spring-data-mapper';

@Injectable({
  providedIn: 'root',
})
export class TbSpringDataService {
  private http = inject(HttpClient);

  /**
   * Converts TbGridQuery to HttpParams for Spring Data.
   */
  toHttpParams(query: TbGridQuery): HttpParams {
    return new HttpParams({ fromObject: TbSpringDataMapper.toParams(query) });
  }

  /**
   * Creates an httpResource for a Spring Data PagedModel endpoint.
   */
  createResource<T extends Record<string, unknown>>(
    url: string | Signal<string>,
    query: Signal<TbGridQuery>,
  ) {
    return httpResource<SpringDataPagedModel<T>>(() => {
      const baseUrl = typeof url === 'function' ? url() : url;
      const params = this.toHttpParams(query());

      return {
        url: baseUrl,
        params,
      };
    });
  }
}
