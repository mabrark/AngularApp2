import { Routes } from '@angular/router';
import { About } from './about/about';
import { Reservation } from './reservation/reservation';

export const routes: Routes = [
  { path: "reservation", component: Reservation},
  { path: "about", component: About },
  { path: "**", redirectTo: "/reservation"} 
];