import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/session.service';
import {LoginComponent} from "../features/auth/components/login/login.component";

@Component({
  template: '<div>Mock Protected Component</div>'
})
class MockProtectedComponent {}

describe('AuthGuard integration test suites', () => {
  let router: Router;
  let sessionService: SessionService;
  let authGuard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'protected', component: MockProtectedComponent, canActivate: [AuthGuard] },
        { path: 'login', component: LoginComponent }]
      )],
      declarations: [MockProtectedComponent]
    });

    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    authGuard = TestBed.inject(AuthGuard);
  });

  it('should navigate to login when user is not logged in',() => {
    sessionService.isLogged = false;
    router.navigate(['/protected']).then(() => {
      expect(router.url).toBe('/login');
    });
    expect(authGuard.canActivate()).toBe(false);
  });

  it('should navigate to protected when user is logged in', () => {
    sessionService.isLogged = true;
    router.navigate(['/protected']).then(() => {
      expect(router.url).toBe('/protected');
    });
    expect(authGuard.canActivate()).toBe(true);
  });
});
