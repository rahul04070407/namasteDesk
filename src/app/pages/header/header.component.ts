import { AfterViewInit, Component, ElementRef, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('offcanvasMenu') offcanvasMenu!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;

  isHomeActive = false;
  isAboutActive = false;
  isPriceActive = false;

  private clickListener!: () => void;
  private routerSub!: Subscription;

  constructor(private router: Router, private renderer: Renderer2) { }

  ngOnInit() {
    this.routerSub = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlTree = this.router.parseUrl(this.router.url);
        const path = urlTree.root.children['primary']?.segments.map(s => s.path).join('/');
        const fragment = urlTree.fragment;

        this.isHomeActive = path === 'home' && !fragment;
        this.isAboutActive = path === 'home' && fragment === 'about';
        this.isPriceActive = path === 'home' && fragment === 'price';

        // Close offcanvas on route change
        this.offcanvasMenu.nativeElement.classList.remove('open');
      });
  }

  ngAfterViewInit() {
    const menuBtn = this.menuToggle.nativeElement;
    const offcanvas = this.offcanvasMenu.nativeElement;
    const close = this.closeBtn.nativeElement;

    // Toggle button click
    this.renderer.listen(menuBtn, 'click', (e: MouseEvent) => {
      e.stopPropagation(); // Prevent window click
      offcanvas.classList.add('open');
    });

    // Close button click
    this.renderer.listen(close, 'click', (e: MouseEvent) => {
      e.stopPropagation(); // Prevent window click
      offcanvas.classList.remove('open');
    });

    // Outside click to close
    this.clickListener = this.renderer.listen('window', 'click', (event: MouseEvent) => {
      if (!offcanvas.contains(event.target as Node) && !menuBtn.contains(event.target as Node)) {
        offcanvas.classList.remove('open');
      }
    });
  }

  ngOnDestroy() {
    if (this.clickListener) this.clickListener();
    if (this.routerSub) this.routerSub.unsubscribe();
  }
}