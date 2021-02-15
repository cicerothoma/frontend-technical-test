import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentService } from './../../services/payment.service';
import { DateValidator } from './../../validators/date.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css'],
})
export class CardFormComponent implements OnInit, OnDestroy {
  creditCardPaymentForm: FormGroup;
  creditCardPaymentSubscription: Subscription;
  allowedKeys: string[] = [
    'creditCardNumber',
    'cardHolder',
    'expirationDate',
    'amount',
  ];

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private matSnackBar: MatSnackBar
  ) {
    this.creditCardPaymentForm = this.fb.group({
      creditCardNumber: ['', Validators.required],
      cardHolder: ['', Validators.required],
      expirationDate: [
        '',
        Validators.compose([
          Validators.required,
          DateValidator.isGreaterThanCurrentDate,
        ]),
      ],
      securityCode: [
        '',
        Validators.compose([Validators.maxLength(3), Validators.minLength(3)]),
      ],
      amount: [
        '',
        Validators.compose([Validators.required, Validators.min(1)]),
      ],
    });
  }

  getErrorMessage(controlName: string): string {
    if (this.creditCardPaymentForm.get(controlName).hasError('required')) {
      return 'This field is required.';
    } else if (this.creditCardPaymentForm.get(controlName).hasError('min')) {
      return 'The value is below the minimum value';
    } else if (
      this.creditCardPaymentForm.get(controlName).hasError('minlength')
    ) {
      return 'The length of characters is below the allowed length';
    } else if (
      this.creditCardPaymentForm.get(controlName).hasError('maxlength')
    ) {
      return 'The length of characters is above the allowed length';
    } else if (
      this.creditCardPaymentForm.get(controlName).hasError('invalidDate')
    ) {
      return 'Date must be above current date';
    }
  }

  ngOnInit(): void {}

  paymentCall(): void {
    if (this.creditCardPaymentForm.valid) {
      this.creditCardPaymentSubscription = this.paymentService
        .sendPostRequest(
          'https://stark-tor-49299.herokuapp.com/',
          this.creditCardPaymentForm.value
        )
        .subscribe((value) => {
          console.log(value);
          if (Object.keys(value).length > 1) {
            this.matSnackBar.open('Card Details Sent Successfully', 'Close', {
              duration: 6000,
            });
          } else {
            this.matSnackBar.open('Card Details Send Fail', 'close', {
              duration: 6000,
            });
          }
        });
    } else {
      this.matSnackBar.open('Form Not Valid', 'Close', {
        duration: 6000,
      });
    }
  }

  ngOnDestroy(): void {
    if (this.creditCardPaymentSubscription) {
      this.creditCardPaymentSubscription.unsubscribe();
    }
  }
}
