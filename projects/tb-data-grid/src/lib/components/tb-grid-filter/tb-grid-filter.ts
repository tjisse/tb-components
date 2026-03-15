import { OverlayModule } from '@angular/cdk/overlay';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TbGridColumn } from '../../models/grid-column';
import { TbFilterValue } from '../../models/grid-state';
import { TB_GRID_TRANSLATIONS } from '../../models/grid-translations';

@Component({
  selector: 'tb-grid-filter',
  imports: [FormsModule, OverlayModule],
  templateUrl: './tb-grid-filter.html',
  styleUrl: './tb-grid-filter.scss',
})
export class TbGridFilterComponent {
  column = input.required<TbGridColumn>();
  currentFilter = input<TbFilterValue | null>(null);

  filterChange = output<TbFilterValue | null>();

  protected t = inject(TB_GRID_TRANSLATIONS);
  isOpen = signal(false);
  tempValue = signal<unknown>('');
  tempSelectedOptions = signal<Set<unknown>>(new Set());

  isActive = computed(() => !!this.currentFilter()?.value);

  toggleDropdown() {
    if (!this.isOpen()) {
      const current = this.currentFilter();
      if (this.column().filterOptions) {
        let values: unknown[] = [];
        if (current?.value) {
          // Normalise: could be string or array
          values = Array.isArray(current.value) ? current.value : [current.value];
        }
        this.tempSelectedOptions.set(new Set(values));
      } else {
        this.tempValue.set(current?.value || '');
      }
    }
    this.isOpen.set(!this.isOpen());
  }

  isOptionSelected(value: unknown): boolean {
    return this.tempSelectedOptions().has(value);
  }

  toggleOption(value: unknown) {
    this.tempSelectedOptions.update((s) => {
      const next = new Set(s);
      if (next.has(value)) {
        next.delete(value);
      } else {
        next.add(value);
      }
      return next;
    });
  }

  apply() {
    if (this.column().filterOptions) {
      const selected = this.tempSelectedOptions();
      if (selected.size > 0) {
        this.filterChange.emit({
          value: Array.from(selected),
          operator: 'in',
        });
      } else {
        this.filterChange.emit(null);
      }
    } else {
      const val = this.tempValue();
      if (val) {
        this.filterChange.emit({ value: val, operator: 'contains' });
      } else {
        this.filterChange.emit(null);
      }
    }
    this.isOpen.set(false);
  }

  clear() {
    this.tempValue.set('');
    this.tempSelectedOptions.set(new Set());
    this.filterChange.emit(null);
    this.isOpen.set(false);
  }
}
