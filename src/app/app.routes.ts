import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Signin } from './signin/signin';
import { GroupsComponent } from './groups/groups.component';

export const routes: Routes = [
  { path: '', component: GroupsComponent },
  { path: 'signin', component: Signin },
  { path: 'group/:groupId', component: HomeComponent },
];
