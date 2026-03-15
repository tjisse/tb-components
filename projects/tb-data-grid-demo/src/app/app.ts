import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DemoStateService } from './services/demo-state';

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected demo = inject(DemoStateService);

  selectedCount = computed(() => {
    const sel = this.demo.currentSelection();
    if (sel.allInDataset) return 'All';
    return sel.ids.size.toString();
  });

  isActionDisabled = computed(() => {
    const sel = this.demo.currentSelection();
    return sel.ids.size === 0 && !sel.allInDataset;
  });
}
