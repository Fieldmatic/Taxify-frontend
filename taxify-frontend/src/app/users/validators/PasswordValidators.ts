import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export class PasswordValidators {
  public static passwordIsNew(control: AbstractControl) {
    if (control.value === localStorage.getItem('oldPassword')) {
      return { passwordIsNotNew: true };
    }
    return null;
  }

  public static confirmationPasswordIsSameAsPassword(): ValidatorFn {
    return (form: FormGroup): ValidationErrors | null => {
      if (form.value['password'] !== form.value['confirmationPassword']) {
        return { passwordsNotSame: true };
      }
      return null;
    };
  }
}
