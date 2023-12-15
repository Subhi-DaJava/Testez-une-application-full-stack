import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = { register: jest.fn() };
    router = { navigate: jest.fn() };
    component = new RegisterComponent(authService, new FormBuilder(), router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register a user', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'Test',
      password: '123456'
    }
    component.form.setValue(registerRequest);

    (authService.register as jest.Mock).mockReturnValue(of(void 0));
    component.submit();
    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message with empty fields', () => {
    const registerRequest: RegisterRequest = {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };

    component.form.setValue(registerRequest);
    (authService.register as jest.Mock).mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(authService.register).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBeTruthy();
  });

  it('should show error message when the invalid fields', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@@test.com',
      firstName: 'fr',
      lastName: 'Te',
      password: '12'
    };

    component.form.setValue(registerRequest);
    (authService.register as jest.Mock).mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(authService.register).toHaveBeenCalled();
    expect(authService.register).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate every field mandatory and min/max length', () => {
    const emailControl = component.form.get('email');
    const firstNameControl = component.form.get('firstName');
    const lastNameControl = component.form.get('lastName');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();

    firstNameControl?.setValue('ar');
    expect(firstNameControl?.hasError('minlength')).toBeTruthy();

    lastNameControl?.setValue('Th');
    expect(lastNameControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('12');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should validate every field min/max length', () => {
    const emailControl = component.form.get('email');
    const firstNameControl = component.form.get('firstName');
    const lastNameControl = component.form.get('lastName');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('invalidEmail');
    expect(emailControl?.hasError('required')).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();

    firstNameControl?.setValue('Arnaud Has Name TooLong Plus que 20 characters');
    expect(firstNameControl?.hasError('maxlength')).toBeTruthy();

    lastNameControl?.setValue('Th');
    expect(lastNameControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('12345678901234567890123456789012345678901234567890123456789012345678901234567890');
    expect(passwordControl?.hasError('maxlength')).toBeTruthy();

    passwordControl?.setValue('12');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });
});
