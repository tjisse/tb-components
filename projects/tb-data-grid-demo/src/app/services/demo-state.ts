import { Injectable, signal } from '@angular/core';
import { TbGridSelectionState } from 'tb-data-grid';

@Injectable({
  providedIn: 'root',
})
export class DemoStateService {
  // Shared simulation state
  isDelayed = signal(false);
  isError = signal(false);

  // Shared selection state (for bulk actions)
  currentSelection = signal<TbGridSelectionState>({ allInDataset: false, ids: new Set() });

  updateSelection(selection: TbGridSelectionState) {
    this.currentSelection.set(selection);
  }

  performBulkAction() {
    const sel = this.currentSelection();
    if (sel.allInDataset) {
      alert(`Action performed on all items!`);
    } else {
      alert(
        `Action performed on ${sel.ids.size} selected items: ${Array.from(sel.ids).join(', ')}`,
      );
    }
  }
}
