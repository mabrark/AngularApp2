import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css'
})
export class Reservations implements OnInit {
  title = 'Reservation';
  reservations: any[] = [];
  reservation: Reservation = {
    firstName: '',
    lastName: '',
    emailAddress: '',
    phone: '',
    area: '',
    time: '',
    imageName: '',
    date: 0,
    status: '',
    reservationID: 0
  };

  error = '';
  success = '';
  selectedFile: File | null = null;

  name: string = '';
  area: string = '';
  timeSlot: string = '';
  showComplete: boolean = false;

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  constructor(
    private reservationService: ReservationService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getReservations();
  }

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

  getReservations(): void {
    this.reservationService.getAll().subscribe(
      (data: Reservation[]) => {
        this.reservations = data;
        this.success = 'successful list retrieval';
        console.log('successful list retrieval');
        console.log(this.reservations);
        this.cdr.detectChanges();
      },
      (err) => {
        console.log(err);
        this.error = 'error retrieving reservations';
      }
    );
  }

  addReservation(f: NgForm) {
    this.resetAlerts();

    this.uploadFile();

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.reservations.push(res);
        this.success = 'Successfully created';

        f.resetForm();
      },
      (err) => (this.error = err.message)
    );
  }

  editReservation(firstName: any, lastName: any, emailAddress: any, phone: any, reservationID: any) {
    this.resetAlerts();

    console.log(firstName.value);
    console.log(lastName.value);
    console.log(emailAddress.value);
    console.log(phone.value);
    console.log(+reservationID);

    this.reservationService
      .edit({
        firstName: firstName.value,
        lastName: lastName.value,
        emailAddress: emailAddress.value,
        phone: phone.value,
        reservationID: +reservationID
      })
      .subscribe(
        (res) => {
          this.cdr.detectChanges();
          this.success = 'Successfully edited';
        },
        (err) => (this.error = err.message)
      );
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost/AngularApp2/reservationapi/upload', formData).subscribe(
      (response) => console.log('File uploaded successfully:', response),
      (error) => console.error('File upload failed:', error)
    );
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
