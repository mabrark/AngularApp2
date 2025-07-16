import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';

import { Reservation } from '../reservation';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule]
})
export class Addreservations {
  reservation: Reservation = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    phone: '',
    status: '',
    area: '',
    time: '',
    date: 0,
    imageName: '',
    reservationID: 0
  };

  selectedFile: File | null = null;
  error = '';
  success = '';

  name: string = '';
  area: string = '';
  timeSlot: string = '';
  showComplete: boolean = false;

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];


  constructor(private http: HttpClient, private router: Router) {}

  addReservation(form: NgForm) {
    this.resetAlerts();

    const formData = new FormData();
    formData.append('firstName', this.reservation.firstName);
    formData.append('lastName', this.reservation.lastName);
    formData.append('emailAddress', this.reservation.emailAddress || '');
    formData.append('phone', this.reservation.phone || '');
    formData.append('status', this.reservation.status || '');
    formData.append('area', this.reservation.area || '');
    formData.append('time', this.reservation.time || '');
    formData.append('date', this.reservation.date?.toString() || '');

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      formData.append('imageName', this.selectedFile.name);
    } else {
      formData.append('imageName', 'placeholder_100.jpg');
    }
    

    this.http.post('http://localhost/AngularApp2/reservationapi/add.php', formData).subscribe({
      next: (res) => {
        this.success = 'Successfully created';
        form.resetForm();
        this.router.navigate(['/reservations']);
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error while saving reservation';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
