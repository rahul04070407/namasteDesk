import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('offcanvasMenu') offcanvasMenu!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  ngAfterViewInit() {
    const menuBtn = this.menuToggle.nativeElement;
    const offcanvas = this.offcanvasMenu.nativeElement;
    const close = this.closeBtn.nativeElement;

    menuBtn.addEventListener('click', () => {
      offcanvas.classList.add('open');
    });

    close.addEventListener('click', () => {
      offcanvas.classList.remove('open');
    });

    window.addEventListener('click', (e: MouseEvent) => {
      if (!offcanvas.contains(e.target as Node) && !menuBtn.contains(e.target as Node)) {
        offcanvas.classList.remove('open');
      }
    });
  }
}