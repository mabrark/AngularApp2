import { Routes } from '@angular/router';

import { About } from './about/about';
import { Reservations } from './reservations/reservations';
import { Addreservations } from './addreservations/addreservations';
import { Updatereservations } from './updatereservations/updatereservations';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: "reservations", component: Reservations},
  { path: "add", component: Addreservations},
  { path: "edit/:id", component: Updatereservations},
  { path: "about", component: About },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: "**", redirectTo: "/reservations", pathMatch: "full" } 
];