import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreditCard } from '../models/credit-card';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private http: HttpClient) {}

  sendPostRequest(url: string, data: CreditCard): Observable<CreditCard> {
    return this.http.post<CreditCard>(url, data).pipe(
      // Uneccessary but just displaying RxJS operator
      map((value) => ({
        creditCardNumber: value.creditCardNumber + 1,
        cardHolder: value.cardHolder + ' new',
        expirationDate: value.expirationDate + 1,
        amount: +value.amount + 100,
        securityCode: value.securityCode ? value.securityCode : '',
      }))
    );
  }
}
