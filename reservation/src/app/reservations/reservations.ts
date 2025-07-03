import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations {
  title = 'Reservation';
  reservations: Reservation[] = [];
  reservation: Reservation = { firstName: '', lastName: '', emailAddress: '', phone: '', area: '', time: '', imageName: '', date: 0 }; 

  error = '';
  success = '';
  selectedFile: File | undefined;

  constructor(private reservationService: ReservationService, private http: HttpClient, private cdr: ChangeDetectorRef) 
  {
    //No statement
  }
  ngOnInit(): void {
    this.getReservations();
  }

  getReservations(): void {
    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges(); // <--- force UI update
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm) {

  }

  onFileSelected(event: Event): void
  {
    const input = event.target as HTMLInputElement;
    if(input.files && input.files.length > 0)
    {
      this.selectedFile = input.files[0];
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
