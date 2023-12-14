import { HttpClientModule } from '@angular/common/http';
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { LoginComponent } from './login.component';
import {AuthService} from "../../services/auth.service";
import {LoginRequest} from "../../interfaces/loginRequest.interface";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";
import {SessionInformation} from "../../../../interfaces/sessionInformation.interface";
import {By} from "@angular/platform-browser";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let sessionService: SessionService;
  let authService: AuthService;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [SessionService, AuthService],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', redirectTo: '' }
        ]),
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call sessionService.logIn given email and password', () => {
    const loginRequest : LoginRequest = {
      email: 'test@test.com',
      password: '123456'
    }
    const sessionInformation = {
      token: "TOKEN",
      type: "USER",
      id: 1,
      username: "test",
      firstName: "test",
      lastName: "Test",
      admin: true
    }
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);

    jest.spyOn(authService, 'login').mockImplementation((request: LoginRequest) => {
      expect(request).toEqual(loginRequest);
      return of(sessionInformation);
    });

    jest.spyOn(sessionService, 'logIn').mockImplementation((sessionInfo: SessionInformation) => {
      expect(sessionInfo).toEqual(sessionInformation);
    });

    const routerSpy = jest.spyOn(router, 'navigate');

    component.submit();

    expect(routerSpy).toHaveBeenCalled();
    expect(authService.login).toHaveBeenCalled();
    expect(sessionService.logIn).toHaveBeenCalled();expect(routerSpy).toHaveBeenCalledWith(['/sessions']);

  });

  it('should set onError to true when login fails', () => {

    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => 'error'))
    const routerSpy = jest.spyOn(router, 'navigate');

    component.submit();
    expect(component.onError).toBe(true);
    expect(authService.login).toHaveBeenCalled();
    expect(routerSpy).not.toHaveBeenCalled();

  });

  it('should occur an error message when email and pwd is not correct', () => {

    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => 'error'));
    component.submit();
    fixture.detectChanges();
    const errorMessageElt = fixture.debugElement.query(By.css('[data-testid="onError"]'));

    expect(component.onError).toBe(true);
    expect(authService.login).toHaveBeenCalled();
    expect(errorMessageElt).toBeTruthy();
    expect(errorMessageElt.nativeElement.textContent).toContain('An error occurred');
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

  it('should not display submit button when email is not valid', () => {
    const loginRequest: LoginRequest = {
      email: 'invalidEmail',
      password: 'fakePassword'
    }
    component.form.controls['email'].setValue(loginRequest.email);
    component.form.controls['password'].setValue(loginRequest.password);
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('[data-testid="button-hide"]'));


    expect(submitButton.styles['display']).toBeFalsy();
    expect(component.hide).toBeTruthy();
  });

  it('should show an error message when enter key is pressed with empty password', () => {
    // Arrange
    const loginRequest = { email: 'email@test.com', password: '' };
    component.form.setValue(loginRequest);

    const loginSpy = jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('login error')));

    component.submit();
    fixture.detectChanges();

    const errorMessageElt = fixture.debugElement.query(By.css('[data-testid="onError"]'));
    expect(errorMessageElt).toBeTruthy();
    expect(errorMessageElt.nativeElement.textContent).toContain('An error occurred');

    expect(loginSpy).toHaveBeenCalledWith(loginRequest);
    expect(component.onError).toBe(true);

  });

});
