import { Component, OnInit, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Reservation } from '../reservation';
import { ReservationService } from '../reservation.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../services/auth';

@Component({
  standalone: true,
  selector: 'app-reservations',
  imports: [HttpClientModule, CommonModule, FormsModule, RouterModule],
  providers: [ReservationService],
  templateUrl: './reservations.html',
  styleUrls: ['./reservations.css']
})
export class Reservations implements OnInit {
  title = 'Reservation';
  public reservations: Reservation[] = [];
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

  error = '';
  success = '';
  userName = '';

  selectedFile: File | null = null;

  name: string = '';
  area: string = '';
  timeSlot: string = '';
  showComplete: boolean = false;

  areas = ['Bruce Mill', 'Rockwood', 'Rattray', 'Rattlesnake point'];
  timeSlots = ['9:00am - 12:00pm', '12:00pm - 3:00pm', '3:00pm - 6:00pm'];

  constructor(
    private reservationService: ReservationService,
    public authService: Auth,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getReservations();
    this.userName = localStorage.getItem('username') || 'Guest';
    this.cdr.detectChanges();
  }

  get username(): string {
    return 'Guest';
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


    const duplicate = this.reservations.find(
      (r) => r.area === this.reservation.area && r.date === this.reservation.date && r.timeSlot === this.reservation.timeSlot
    );

    if (duplicate) {
      this.error = 'A reservation already exists for this area, date, and time slot.';
      return;
    }

    if (this.selectedFile) {
      this.reservation.imageName = this.selectedFile.name;
      this.uploadFile();
    } else {
      this.reservation.imageName = '';
    }

    this.reservationService.add(this.reservation).subscribe(
      (res: Reservation) => {
        this.reservations.push(res);
        this.success = 'Successfully created';
        f.reset();
        this.selectedFile = null;
      },
      (err) => (this.error = err.message)
    );
    this.cdr.detectChanges();
  }

  editReservation(firstName: any, lastName: any, emailAddress: any, phone: any, reservationID: any) {
    this.resetAlerts();

    const formData = new FormData();
    formData.append('firstName', firstName.value);
    formData.append('lastName', lastName.value);
    formData.append('emailAddress', emailAddress.value);
    formData.append('phone', phone.value);
    formData.append('reservationID', reservationID.toString());

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
      formData.append('imageName', this.selectedFile.name);
    } else {
      formData.append('imageName', 'placeholder_100.jpg');
    }

    this.reservationService.edit(formData).subscribe(
      (res) => {
        this.cdr.detectChanges();
        this.success = 'Successfully edited';
      },
      (err) => (this.error = err.message)
    );
  }

  deleteReservation(reservationID: number) {
    this.resetAlerts();

    this.reservationService.delete(reservationID).subscribe(
      (res) => {
        this.reservations = this.reservations.filter((item) => item['reservationID'] && +item['reservationID'] !== +reservationID);
        this.cdr.detectChanges();
        this.success = 'Deleted successfully';
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
