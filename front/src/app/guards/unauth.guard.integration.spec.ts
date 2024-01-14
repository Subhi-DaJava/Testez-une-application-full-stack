import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { UnauthGuard } from './unauth.guard';
import { SessionService } from '../services/session.service';
import { ListComponent } from "../features/sessions/components/list/list.component";


@Component({
  template: '<div>Mock Unprotected Component</div>'
})
class MockProtectedComponent {}

describe('UnauthGuard integration test suites', () => {
  let router: Router;
  let sessionService: SessionService;
  let unauthGuard: UnauthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([
        { path: 'protected', component: MockProtectedComponent, canActivate: [UnauthGuard] },
        { path: 'sessions', component: ListComponent }]
      )],
      declarations: [MockProtectedComponent]
    });

    router = TestBed.inject(Router);
    sessionService = TestBed.inject(SessionService);
    unauthGuard = TestBed.inject(UnauthGuard);
  });

  it('should navigate to sessions when user is logged in', () => {
    sessionService.isLogged = true;
    router.navigate(['/sessions']).then(() => {
      expect(router.url).toBe('/sessions');
    });

    expect(unauthGuard.canActivate()).toBe(false);
  });

  it('should not navigate to protected when user is not logged in', () => {
    sessionService.isLogged = false;
    router.navigate(['/protected']).then(() => {
      expect(router.url).toBe('/protected');
    });

    expect(unauthGuard.canActivate()).toBe(true);
  });
});
