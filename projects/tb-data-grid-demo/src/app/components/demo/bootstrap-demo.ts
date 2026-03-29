import { Component, computed, effect, inject, signal } from '@angular/core';
import {
  TbDataGridBootstrapComponent,
  TbGridColumnComponent,
  TbGridQuery,
  TbGridSelectionState,
  TbSpringDataService,
} from 'tb-data-grid';
import { environment } from '../../../environments/environment';
import { DemoStateService } from '../../services/demo-state';

interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-bootstrap-demo',
  imports: [TbDataGridBootstrapComponent, TbGridColumnComponent],
  templateUrl: './bootstrap-demo.html',
  styles: [
    `
      .container {
        max-width: 900px;
        margin: 0 auto;
        font-family: sans-serif;
      }
    `,
  ],
})
export class BootstrapDemoComponent {
  private springDataService = inject(TbSpringDataService);
  protected demo = inject(DemoStateService);

  gridQuery = signal<TbGridQuery>({
    sort: null,
    pagination: { pageIndex: 0, pageSize: 10 },
    filters: {},
  });

  userResource = this.springDataService.createResource<User>(
    environment.apiBaseUrl + '/api/users',
    this.gridQuery,
  );

  private _users = signal<User[]>([]);
  private _totalElements = signal<number>(0);
  errorState = signal<unknown>(null);

  users = computed(() => {
    if (this.userResource.status() === 'resolved') {
      return this.userResource.value()!.content;
    }
    return this._users();
  });

  totalElements = computed(() => {
    if (this.userResource.status() === 'resolved') {
      return this.userResource.value()!.page.totalElements;
    }
    return this._totalElements();
  });

  constructor() {
    effect(() => {
      const status = this.userResource.status();
      if (status === 'resolved') {
        const res = this.userResource.value()!;
        this._users.set(res.content);
        this._totalElements.set(res.page.totalElements);
        this.errorState.set(null);
      } else if (status === 'error') {
        this.errorState.set(this.userResource.error());
        this._users.set([]);
      } else if (status === 'loading') {
        this.errorState.set(null);
      }
    });
  }

  onQueryChange(newQuery: TbGridQuery) {
    this.gridQuery.set(newQuery);
  }

  onSelectionChange(newSelection: TbGridSelectionState) {
    this.demo.updateSelection(newSelection);
  }
}
