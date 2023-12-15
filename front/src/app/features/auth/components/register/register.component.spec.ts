import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { RegisterComponent } from './register.component';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {RouterTestingModule} from "@angular/router/testing";
import {RegisterRequest} from "../../interfaces/registerRequest.interface";
import {of, throwError} from "rxjs";
import {By} from "@angular/platform-browser";

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    };
    mockAuthService = {
      register: jest.fn()
    }

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{provide: AuthService, useValue: mockAuthService},
        {provide: Router,  useValue: mockRouter}],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

    const authServieSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(of(void 0));
    component.submit();
    expect(authServieSpy).toHaveBeenCalledWith(registerRequest);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display error message with empty fields', () => {
    const registerRequest: RegisterRequest = {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };

    component.form.setValue(registerRequest);
    const authServieSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(authServieSpy).toHaveBeenCalled();
    expect(authServieSpy).toHaveBeenCalledWith(registerRequest);
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
    const authServieSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(authServieSpy).toHaveBeenCalled();
    expect(authServieSpy).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBeTruthy();
    expect(component.form.valid).toBeFalsy();

  });

  it('should not display submit button when the form is invalid', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@@test.com',
      firstName: 'fr',
      lastName: 'Te',
      password: '12'
    };
    const emailControl = component.form.get('email');
    emailControl?.setValue('required@email.com');
    expect(emailControl?.hasError('required')).toBeFalsy()

    component.form.setValue(registerRequest);
    const authServieSpy = jest.spyOn(mockAuthService, 'register').mockReturnValue(throwError(() => new Error('Error')));

    const button = fixture.debugElement.query(By.css('[data-testid="submit-button"]')).nativeElement;

    component.submit();
    fixture.detectChanges();
    const errorMessageElt = fixture.debugElement.query(By.css('[data-testid="onError"]'));

    expect(errorMessageElt.nativeElement.textContent).toBe('An error occurred');
    expect(authServieSpy).toHaveBeenCalled();
    expect(button.disabled).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  })

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
