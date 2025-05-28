import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-home',
   standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('aboutSection') aboutSection!: ElementRef;
  @ViewChild('pricingSection') pricingSection!: ElementRef;

  private routerSub!: Subscription;
  private observer!: IntersectionObserver;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit() {
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          const fragment = this.route.snapshot.fragment;
          if (fragment === 'about' && this.aboutSection) {
            this.aboutSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
          } else if (fragment === 'price' && this.pricingSection) {
            this.pricingSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
          }
        });
      });

    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const fragment = this.route.snapshot.fragment;
        if (!entry.isIntersecting) {
          if (
            (fragment === 'about' && entry.target === this.aboutSection?.nativeElement) ||
            (fragment === 'price' && entry.target === this.pricingSection?.nativeElement)
          ) {
            this.router.navigate([], {
              relativeTo: this.route,
              fragment: undefined,
              replaceUrl: true
            });
          }
        }
      });
    }, { threshold: 0.1 });

    if (this.aboutSection) {
      this.observer.observe(this.aboutSection.nativeElement);
    }

    if (this.pricingSection) {
      this.observer.observe(this.pricingSection.nativeElement);
    }
  }

  ngOnDestroy() {
    this.routerSub?.unsubscribe();
    this.observer?.disconnect();
  }
}