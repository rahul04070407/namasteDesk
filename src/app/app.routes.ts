import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { ContactUsComponent } from './pages/contact-us/contact-us.component';
import { ComingSoonComponent } from './pages/coming-soon/coming-soon.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
    {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: ComingSoonComponent,
  },
  {
    path: 'contact',
    component: ComingSoonComponent,
  },
    {
    path: 'services',
    component: ComingSoonComponent,
  },
  { path: 'coming-soon', component: ComingSoonComponent }

];

