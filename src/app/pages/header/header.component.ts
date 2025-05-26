import { AfterViewInit, Component, ElementRef, HostListener, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements AfterViewInit {
  @ViewChild('menuToggle') menuToggle!: ElementRef;
  @ViewChild('offcanvasMenu') offcanvasMenu!: ElementRef;
  @ViewChild('closeBtn') closeBtn!: ElementRef;
  isHomeActive = false;
  isAboutActive = false;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const urlTree = this.router.parseUrl(this.router.url);
        const path = urlTree.root.children['primary']?.segments.map(s => s.path).join('/');
        const fragment = urlTree.fragment;

        this.isHomeActive = path === 'home' && !fragment;
        this.isAboutActive = path === 'home' && fragment === 'about';
      });
  }
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
