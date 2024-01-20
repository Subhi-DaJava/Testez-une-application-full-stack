import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { FormBuilder } from '@angular/forms';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { LoginRequest } from '../../interfaces/loginRequest.interface';

describe('LoginComponent without TestBed', () => {
  let component: LoginComponent;
  let authService: any;
  let sessionService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      login: jest.fn()
    };
    sessionService = {
      logIn: jest.fn()
    };
    router = {
      navigate: jest.fn()
    };
    component = new LoginComponent(authService, new FormBuilder(), router, sessionService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionService.logIn with valid email and password', () => {
    const loginRequest: LoginRequest = {
      email: 'test@test.com',
      password: '123456'
    };
    const sessionInformation: SessionInformation = {
      token: "TOKEN",
      type: "USER",
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "Test",
      admin: true
    };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    authService.login.mockReturnValue(of(sessionInformation));

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(sessionService.logIn).toHaveBeenCalledWith(sessionInformation);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);
  });

  it('should set onError to true when login fails', () => {
    const loginRequest: LoginRequest = {
      email: 'test@test.com',
      password: '123456'
    };
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    authService.login.mockReturnValue(throwError(() => new Error('Login failed')));

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(component.onError).toBe(true);
  });

  it('should validate email field with empty field or non valid email', () => {
    const emailControl = component.form.get('email');

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);

    emailControl?.setValue('test');
    expect(emailControl?.hasError('required')).toBe(false);

    emailControl?.setValue('invalidemail');
    expect(emailControl?.hasError('email')).toBe(true);
  });

  it('should validate password field for empty, correct and min value', () => {
    const passwordControl = component.form.get('password');

    passwordControl?.setValue('');
    expect(passwordControl?.hasError('required')).toBe(true);

    passwordControl?.setValue('test');
    expect(passwordControl?.hasError('required')).toBe(false);

    passwordControl?.setValue('te');
    expect(passwordControl?.hasError('min')).toBeFalsy();
  });

  it('should show an error message when enter key is pressed with empty password', () => {
    const loginRequest = { email: 'email@test.com', password: '' };
    component.form.setValue(loginRequest);

    authService.login.mockReturnValue(throwError(() => new Error('login error')));

    component.submit();

    expect(authService.login).toHaveBeenCalledWith(loginRequest);
    expect(component.onError).toBe(true);
  });
});
