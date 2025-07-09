import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Reservation } from './reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  baseUrl = 'http://localhost/AngulorApp2/reservationapi';

  constructor(private http: HttpClient) {}

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

  edit(reservation: Reservation): Observable<any> {
    return this.http.put(`${this.baseUrl}/edit`, { data: reservation });
  }

  delete(reservationID: any): Observable<any> {
    const params = new HttpParams().set('reservationID', reservationID.toString());
    return this.http.delete(`${this.baseUrl}/delete`, { params: params });
  }
}