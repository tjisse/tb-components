import { Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[tbGridTruncated]',
})
export class TbGridTruncatedDirective {
  private el = inject(ElementRef<HTMLElement>).nativeElement;
  private expandTimeout: ReturnType<typeof setTimeout> | null = null;

  @HostListener('mouseenter')
  onMouseEnter() {
    const target = this.el.querySelector('.tb-cell-content') as HTMLElement;
    if (!target) return;

    const isTruncated = target.scrollWidth > target.clientWidth;
    if (isTruncated) {
      this.expandTimeout = setTimeout(() => {
        this.el.classList.add('tb-is-expanded');
      }, 1000);
    }
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    if (this.expandTimeout) {
      clearTimeout(this.expandTimeout);
      this.expandTimeout = null;
    }
    this.el.classList.remove('tb-is-expanded');
  }
}
