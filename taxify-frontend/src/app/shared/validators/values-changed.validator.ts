import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function valuesChangedValidator(value: any): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    if (JSON.stringify(value) === JSON.stringify(form.value)) {
      return { valueNotChanged: true };
    }
    return null;
  };
}
