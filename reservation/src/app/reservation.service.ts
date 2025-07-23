import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  // ✅ Fixed typo in base URL
  baseUrl = 'http://localhost/AngularApp2/reservationapi';

  constructor(private http: HttpClient) {}


  // ✅ Implemented properly
  get(reservationID: number): Observable<Reservation> {
    const params = new HttpParams().set('reservationID', reservationID.toString());
    return this.http.get(`${this.baseUrl}/get.php`, { params }).pipe(
      map((res: any) => res['data'])
    );
  }

  getAll(): Observable<Reservation[]> {
    return this.http.get(`${this.baseUrl}/list`).pipe(
      map((res: any) => res['data'])
    );
  }

  add(reservation: Reservation): Observable<Reservation> {
    return this.http.post(`${this.baseUrl}/add`, { data: reservation }).pipe(
      map((res: any) => res['data'])
    );
  }

  // ✅ Send FormData if updating with image
  edit(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/edit.php`, formData);
  }

  delete(reservationID: number): Observable<any> {
    const params = new HttpParams().set('reservationID', reservationID.toString());
    return this.http.delete(`${this.baseUrl}/delete`, { params });
  }
}
