import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { reservation } from './reservation';

@Injectable({
    providedIn: 'root',
})

export class ReservationService {
    baseUrl = 'http://localhost/reservationangular/reservationapi';

    constructor(private http: HttpClient)
    {
        // No statements required
    }

    getAll() {
        return this.http.get(`${this.baseUrl}/list`).pipe(
            map((res: any) => {
                return res['data'];
            })
        );
    }

    add(reservation: Reservation) {
        return this.http.post(`${this.baseUrl}/add`, {data: reservation}).pipe(
            map((res: any) => {
                return res['data'];
            })
        );
    }

    edit(reservation: Reservation)
    {
        return this.http.put(`${this.baseUrl}/edit`, {data: reservation});
    }

    delete(contactID: any)
    {
        const params = new HttpParams().set('contactID', contactID.toString());
        return this.http.delete(`${this.baseUrl}/delete`, {params: params});
    }
}