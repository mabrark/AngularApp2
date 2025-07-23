import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { Auth } from '../services/auth';

@Component({
  selector: 'app-updatereservations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './updatereservations.html',
  styleUrls: ['./updatereservations.css'],
  providers: [ReservationService]
})
export class Updatereservations implements OnInit {
  reservationID!: number;
  reservation: Reservation = {
    firstName: '', lastName: '', emailAddress: '',
    phone: '', status: '', area: '', time: '', date: 0, imageName: '', reservationID: 0
  };

  success = '';
  error = '';
  userName = '';
  maxDate: string = '';
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalImageName: string = '';

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    public authService: Auth,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    this.maxDate = `${yyyy}-${mm}-${dd}`;
    this.reservationID = +this.route.snapshot.paramMap.get('id')!;
    this.reservationService.get(this.reservationID).subscribe({
      next: (data: Reservation) => {
        this.reservation = data;
        this.originalImageName = data.imageName ?? '';
        this.previewUrl = `http://localhost/AngularApp2/reservationapi/uploads/${this.originalImageName}`;
        this.cdr.detectChanges();
      },
      error: () => this.error = 'Error loading reservation.'
    });
    this.userName = localStorage.getItem('username') || 'Guest';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.reservation.imageName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateReservation(form: NgForm) {
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

    if (form.invalid) return;

    const formData = new FormData();
    formData.append('reservationID', this.reservationID.toString());
    formData.append('firstName', this.reservation.firstName ?? '');
    formData.append('lastName', this.reservation.lastName ?? '');
    formData.append('emailAddress', this.reservation.emailAddress ?? '');
    formData.append('phone', this.reservation.phone ?? '');
    formData.append('status', this.reservation.status ?? '');
    formData.append('area', this.reservation.area ?? '');
    formData.append('time', this.reservation.time ?? '');
    formData.append('date', this.reservation.date.toString());
    formData.append('originalImageName', this.originalImageName);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    } else {
      formData.append('imageName', this.reservation.imageName ?? '');
    }

    this.http.post<any>('http://localhost/AngularApp2/reservationapi/edit.php', formData).subscribe({
      next: () => {
        this.success = 'Reservation updated successfully';
        this.router.navigate(['/reservations']);
      },
      error: (err: HttpErrorResponse) =>{
        if (err.status == 409) {
          const body = err.error;
          this.error = body?.error || 'Duplicate entry detected';
          this.cdr.detectChanges();
        } else {
          this.error = 'update failed';
          this.cdr.detectChanges();
        } 
      }
    });
  }
}
