import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';

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
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  originalImageName: string = '';

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
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
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  updateReservation(form: NgForm) {
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
      error: () => this.error = 'Update failed'
    });
  }
}
