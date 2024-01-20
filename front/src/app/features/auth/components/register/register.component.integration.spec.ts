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
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import {LoginComponent} from "../login/login.component";

describe('RegisterComponent integration test suits', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  let authService : AuthService;
  let router : Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [
        AuthService
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginComponent }]
        ),
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

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router)

    fixture.detectChanges();
  });

  it('should register an user with valid fields', () => {
    component.form.setValue({
      email: 'user@test.com',
      firstName: 'test',
      lastName: 'USER',
      password: 'PassWord'
    });

    expect(component.form.invalid).toBeFalsy();

    const authServiceSpy = jest.spyOn(authService, 'register').mockReturnValue(of(void 0));
    const routerSpy = jest.spyOn(router, 'navigate');

    component.submit();

    expect(authServiceSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('should return an Error if registration fails', () => {
    component.form.setValue({
      email: 'user@test.com',
      firstName: 'test',
      lastName: 'USER',
      password: 'PassWord'
    });

    expect(component.form.invalid).toBeFalsy();

    const authServiceSpy = jest.spyOn(authService, 'register').mockReturnValue(throwError(() => new Error()));

    component.submit();

    expect(component.onError).toBeTruthy()
    expect(authServiceSpy).toHaveBeenCalled();
  });

});
