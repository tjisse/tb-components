import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TbGridQuery, TbGridSelectionState } from '../../models/grid-state';
import { TbGridStateService } from '../../services/grid-state';
import { TbGridUrlService } from '../../services/url-state';
import { TbDataGridComponent } from '../tb-data-grid/tb-data-grid';
import { TbGridColumnComponent } from '../tb-grid-column/tb-grid-column';

@Component({
  selector: 'tb-data-grid-bootstrap',
  imports: [TbDataGridComponent, TbGridColumnComponent],
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
  templateUrl: './tb-data-grid-bootstrap.html',
  styleUrl: './tb-data-grid-bootstrap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TbDataGridBootstrapComponent<T extends Record<string, unknown>> {
  data = input<T[]>([]);
  totalItems = input<number>(0);
  urlSync = input<boolean>(true);
  urlPrefix = input<string>('');
  initialQuery = input.required<TbGridQuery>();
  fixedHeight = input<boolean>(true);
  selectable = input<boolean>(false);
  loading = input<boolean>(false);
  loadingThreshold = input<number>(500);
  pageSizeOptions = input<number[]>([10, 20, 50, 100]);
  rowIdKey = input<keyof T | string>('id');
  error = input<unknown>(null);

  queryChange = output<TbGridQuery>();
  selectionChange = output<TbGridSelectionState>();
  retry = output<void>();
}
