import {UnauthGuard} from "./unauth.guard";
import {SessionService} from "../services/session.service";
import {Router} from "@angular/router";
import {TestBed} from "@angular/core/testing";

describe('UnAuthGuard test suites', () => {
  let unAuthGuard: UnauthGuard;
  let mockSessionService: SessionService;
  let mockRouter: Router;


  beforeEach(() => {
    mockSessionService = { isLogged: true } as SessionService;
    mockRouter = { navigate: jest.fn() } as unknown as Router;

    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: SessionService, useValue: mockSessionService},
        { provide: Router, useValue: mockRouter }
      ]
    });

    unAuthGuard = TestBed.inject(UnauthGuard);
    mockRouter = TestBed.inject(Router);
  });

  it('should redirect to sessions if logged in', () => {
    expect(unAuthGuard.canActivate()).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  });

  it('should not redirect if not logged in', () => {
    mockSessionService.isLogged = false;
    expect(unAuthGuard.canActivate()).toBe(true);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

});

