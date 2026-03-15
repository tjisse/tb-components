import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  contentChild,
  inject,
  input,
} from '@angular/core';
import { TbFilterOption, TbFilterType } from '../../models/grid-column';
import { TbGridStateService } from '../../services/grid-state';

@Component({
  selector: 'tb-grid-column',
  template: '<ng-content />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TbGridColumnComponent implements OnInit, OnDestroy {
  private state = inject(TbGridStateService, { optional: true });

  key = input.required<string>();
  header = input.required<string>();
  sortable = input<boolean>(false);
  filterable = input<boolean>(false);
  filterType = input<TbFilterType>('text');
  filterOptions = input<TbFilterOption[] | undefined>(undefined);
  width = input<string>('');

  cellTemplate = contentChild(TemplateRef);

  ngOnInit() {
    this.state?.registerColumn(this);
  }

  ngOnDestroy() {
    this.state?.unregisterColumn(this);
  }
}
