import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Signin } from './signin/signin';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'signin', component: Signin },
];
