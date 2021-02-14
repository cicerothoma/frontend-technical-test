import { AbstractControl, ValidationErrors } from '@angular/forms';

export class DateValidator {
  static isGreaterThanCurrentDate(
    control: AbstractControl
  ): ValidationErrors | null {
    if ((control.value as number) <= Date.now()) {
      return { invalidDate: true };
    }

    return null;
  }
}
