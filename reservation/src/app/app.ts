import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NgForm } from '@angular/forms'

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
  name: string = '';
  area: string = '';
  timeSlot: string = '';
  showComplete: boolean = false;

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  reservations: any[] = [];

  get username(): string {
    return 'Guest';
  }

  get reservationCount(): number {
    return this.reservations.length;
  }

  makeReservation() {
    if (this.name && this.area && this.timeSlot) {
      const duplicate = this.reservations.find(
        (r) => r.area === this.area && r.timeSlot === this.timeSlot
      );

      if (duplicate) {
        alert('Time slot already booked for this area.');
        return;
      }

      this.reservations.push({
        name: this.name,
        area: this.area,
        timeSlot: this.timeSlot,
        complete: false
      });

      this.name = '';
      this.area = '';
      this.timeSlot = '';
    } else {
      alert('Please fill all fields.');
    }
  }

  addreservation(description: string) {
    if (description) {
      this.reservations.push({ timeslot: description, complete: false });
    }
  } 
}
