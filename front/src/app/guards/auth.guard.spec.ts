import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard test suites', () => {
  let guard: AuthGuard;
  let mockSessionService: SessionService;
  let mockRouter: Router;

  beforeEach(() => {
    mockSessionService = { isLogged: false } as SessionService;
    mockRouter = { navigate: jest.fn() } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: mockRouter }
      ]
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should redirect to login if not logged in', () => {
    expect(guard.canActivate()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should not redirect if logged in', () => {
    mockSessionService.isLogged = true;
    expect(guard.canActivate()).toBe(true);
  });
});


