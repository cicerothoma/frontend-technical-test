import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ValidationErrors,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { PaymentService } from './../../services/payment.service';
import { DateValidator } from './../../validators/date.validator';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as _ from 'lodash';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css'],
})
export class CardFormComponent implements OnInit, OnDestroy {
  creditCardPaymentForm: FormGroup;
  creditCardPaymentSubscription: Subscription;

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

  getFormValidationErrors() {
    Object.keys(this.creditCardPaymentForm.controls).forEach((key) => {
      const controlErrors: ValidationErrors = this.creditCardPaymentForm.get(
        key
      ).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          console.log(
            'Key control: ' + key + ', keyError: ' + keyError + ', err value: ',
            controlErrors[keyError]
          );
        });
      }
    });
  }

  ngOnInit(): void {}

  paymentCall(): void {
    this.getFormValidationErrors();
    // Get The Moment Date object and change it to a timestamp
    const dateTimestamp = this.creditCardPaymentForm
      .get('expirationDate')
      .value.valueOf();
    // Replace The Moment Date object with the timestamp
    this.creditCardPaymentForm.get('expirationDate').patchValue(dateTimestamp);
    if (this.creditCardPaymentForm.valid) {
      this.creditCardPaymentSubscription = this.paymentService
        .sendPostRequest('', this.creditCardPaymentForm.value)
        .subscribe((value) => {
          if (
            _.has(value, [
              'creditCardNumber',
              'cardHolder',
              'expirationDate',
              'amount',
            ])
          ) {
            this.matSnackBar.open('Valid Card Details', 'close', {
              duration: 6000,
            });
          } else {
            this.matSnackBar.open('Invalid Card Details', 'close', {
              duration: 6000,
            });
          }
        });
    }
  }

  ngOnDestroy(): void {
    if (this.creditCardPaymentSubscription) {
      this.creditCardPaymentSubscription.unsubscribe();
    }
  }
}
