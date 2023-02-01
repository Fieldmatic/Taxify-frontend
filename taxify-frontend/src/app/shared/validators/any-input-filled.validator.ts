import { FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function anyInputValidator(): ValidatorFn {
  return (form: FormGroup): ValidationErrors | null => {
    const formValue = form.value;
    for (let prop in formValue) {
      if (formValue[prop]) {
        return null;
      }
    }
    return { noInput: true };
  };
}
