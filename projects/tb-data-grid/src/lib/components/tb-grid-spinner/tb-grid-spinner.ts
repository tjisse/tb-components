import { animate, style, transition, trigger } from '@angular/animations';
import { Component, effect, input, signal, untracked } from '@angular/core';

@Component({
  selector: 'tb-grid-spinner',
  imports: [],
  animations: [
    trigger('fade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
  template: `
    @if (show()) {
      <div class="tb-loading-overlay" @fade>
        <div class="spinner"></div>
      </div>
    }
  `,
  styleUrl: './tb-grid-spinner.scss',
})
export class TbGridSpinnerComponent {
  visible = input.required<boolean>();
  threshold = input<number>(500);

  protected show = signal(false);
  private timeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const isVisible = this.visible();
      const delay = untracked(() => this.threshold());

      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      if (isVisible) {
        this.timeout = setTimeout(() => {
          this.show.set(true);
        }, delay);
      } else {
        this.show.set(false);
      }
    });
  }
}
