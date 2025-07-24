import { bootstrapApplication } from '@angular/platform-browser';
import { Reservations } from './app/reservations/reservations';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; // if you have routes

import 'zone.js';
bootstrapApplication(Reservations, {
  providers: [
    provideHttpClient(),
    provideRouter(routes)
  ]
});
