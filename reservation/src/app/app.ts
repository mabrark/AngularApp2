import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Reservation } from './reservation';
import { ReservationService } from './reservation.service';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'reservation';
  reservations: Reservation[] = [];

  constructor(private reservationService: ReservationService) {}

  ngOnInit(): void {
    this.fetchReservations();
  }

  fetchReservations(): void {
    this.reservationService.getReservations().subscribe((data: Reservation[]) => {
      this.reservations = data;
    });
  }
}
