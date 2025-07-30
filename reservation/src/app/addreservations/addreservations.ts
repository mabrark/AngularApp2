import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { RouterModule, Router } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-addreservations',
  templateUrl: './addreservations.html',
  styleUrls: ['./addreservations.css'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [ReservationService]
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
    reservationID: 0,
    timeSlot: '',
    complete: false
  };

  selectedFile: File | null = null;
  error = '';
  success = '';
  userName: string = '';
  maxDate: string = '';
  area: string = '';
  timeSlot: string = '';
  showComplete: boolean = false;

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];
  types: { typeID: number; reservationType: string; }[] | undefined;


  constructor(
    private reservationService: ReservationService,
    public authService: Auth, 
    private http: HttpClient, 
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTypes();
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
    this.userName = localStorage.getItem('username') || 'Guest';
  }
  loadTypes(): void {
    this.http.get<{ typeID: number, reservationType: string }[]>('http://localhost/AngularApp2/reservationapi/types.php')
      .subscribe({
        next: (data) => this.types = data,
        error: () => this.error = 'Failed to load reservation types'
      });
  }

  addReservation(form: NgForm) {
    this.resetAlerts();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.reservation.emailAddress??'')) {
      this.error = 'Please enter a valid email address.';
      this.cdr.detectChanges();
      return;
    }

    const phoneRegex = /^(\(\d{3}\)\s|\d{3}-)\d{3}-\d{4}$/;
    if (!phoneRegex.test(this.reservation.phone??'')) {
      this.error = 'Please enter a valid phone number.';
      this.cdr.detectChanges();
      return;
    }

    const formData = new FormData();
    formData.append('firstName', this.reservation.firstName);
    formData.append('lastName', this.reservation.lastName);
    formData.append('emailAddress', this.reservation.emailAddress || '');
    formData.append('phone', this.reservation.phone || '');
    formData.append('status', this.reservation.status || '');
    formData.append('area', this.reservation.area || '');
    formData.append('time', this.reservation.time || '');
    formData.append('date', this.reservation.date?.toString() || '');

    if (!this.reservation.imageName) {
      this.reservation.imageName = 'placeholder_100.jpg';
    }

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.success = 'Successfully created';

        // Only upload file AFTER successful reservation creation
        if (this.selectedFile && this.reservation.imageName != 'placeholder_100.jpg') {
          this.uploadFile();
          this.cdr.detectChanges();
        }
        form.reset();
        this.router.navigate(['/reservations']);
      },
      (err) => {
        this.error = err.error?.message || err.message || 'Error occurred';
        this.cdr.detectChanges();
      }
    );
  }

  uploadFile(): void {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);
    

    this.http.post('http://localhost/AngularApp2/reservationapi/add.php', formData).subscribe(
      response => console.log('File uploaded successfully:', response),
      error => console.error('File upload failed:', error)
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;
    }
  }

  resetAlerts(): void {
    this.error = '';
    this.success = '';
  }
}
