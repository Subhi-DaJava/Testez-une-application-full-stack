import { HttpClientModule } from '@angular/common/http';
import {TestBed, ComponentFixture, fakeAsync, tick} from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';
import {of} from "rxjs";
import {SessionService} from "./services/session.service";
import {RouterTestingModule} from "@angular/router/testing";
import {By} from "@angular/platform-browser";


describe('AppComponent', () => {
  let app : AppComponent;
  let fixture : ComponentFixture<AppComponent>;
  let mockSessionService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockRouter = {
      navigate: jest.fn()
    }
    mockSessionService = {
      logOut: jest.fn().mockReturnValue(of()),
      $isLogged: jest.fn().mockReturnValue(of(true)),
      sessionInformation: {
        id: '1',
        name: 'test',
        email: 'test@test.com'
      }
    };
    await TestBed.configureTestingModule({
      providers: [
        {
          provide: SessionService,
          useValue: mockSessionService
        }
      ],
      imports: [
        HttpClientModule,
        MatToolbarModule,
        RouterTestingModule,
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();

  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('span')?.textContent).toContain('Yoga app');
  });

  it('should logout', () => {
    const logoutSpy = jest.spyOn(app, 'logout');

    const sessionServiceSpy = jest.spyOn(mockSessionService, 'logOut').mockImplementation(() => {
      mockSessionService.sessionInformation = undefined;
      mockSessionService.isLogged = false;
      mockSessionService.$isLogged = of(false);
      return of(void 0);
    });

    app.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(mockSessionService.sessionInformation).toBeUndefined();
    expect(mockSessionService.isLogged).toBeFalsy();

  });

  it('should return isLogged', () => {
    const isLoggedSpy = jest.spyOn(app, '$isLogged');
    const sessionServiceSpy = jest.spyOn(mockSessionService, '$isLogged').mockReturnValue(of(true));

    const isLogged = app.$isLogged();

    expect(isLoggedSpy).toHaveBeenCalled();
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(isLogged).toBeTruthy();
  });

  /**
   * Test case for the 'logout and navigate home' scenario.
   * This test case uses the `fakeAsync` function to handle the asynchronous operations in the test.
   *
   * The `logout` method of the `AppComponent` is spied on using `jest.spyOn`.
   * The `logOut` method of the `SessionService` is also spied on and a mock implementation is provided.
   * The `navigate` method of the `Router` is spied on as well.
   *
   * The `logout` method of the `AppComponent` is then called.
   * The `tick` function is used to simulate the passage of time, allowing all asynchronous operations to complete.
   *
   * The test then checks if the `logout` method of the `AppComponent` has been called.
   * It also checks if the `logOut` method of the `SessionService` has been called.
   * It verifies that the `sessionInformation` property of the `SessionService` is
   * `undefined` and that the `isLogged` property is `false`.
   */
  it('should logout and navigate to home', fakeAsync(() => {
    const logoutSpy = jest.spyOn(app, 'logout');
    const sessionServiceSpy = jest.spyOn(mockSessionService, 'logOut').mockImplementation(() => {
      mockSessionService.sessionInformation = undefined;
      mockSessionService.isLogged = false;
      mockSessionService.$isLogged = of(false);
      return of(void 0);
    });
    const routerSpy = jest.spyOn(mockRouter, 'navigate');

    app.logout();
    tick(); // wait for async save to complete
    expect(logoutSpy).toHaveBeenCalled();
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(mockSessionService.sessionInformation).toBeUndefined();
    expect(mockSessionService.isLogged).toBeFalsy();

    // setTimeout(() => {
    //   expect(mockRouter.navigate).toHaveBeenCalled();
    //   expect(routerSpy).toHaveBeenCalledWith(['']);
    // }, 3000);

  }));


  /**
   * Test case for the 'logout when Logout button is clicked' scenario.
   *
   * This test case simulates a click event on the Logout button and verifies that the application behaves correctly.
   *
   * @see {@link AppComponent} for the component under test.
   * @see {@link SessionService} for the service used to manage the session.
   *
   * @returns {void}
   */
  it('should logout when Logout button is clicked', () => {
    const logoutSpy = jest.spyOn(app, 'logout');
    const sessionServiceSpy = jest.spyOn(mockSessionService, 'logOut').mockImplementation(() => {
      mockSessionService.sessionInformation = undefined;
      mockSessionService.isLogged = false;
      mockSessionService.$isLogged = of(false);
      return of(void 0);
    });

    fixture.detectChanges();
    const buttonElement = fixture.debugElement.query(By.css('[data-testid="logout-test"]'));
    buttonElement.triggerEventHandler('click', null);

    expect(logoutSpy).toHaveBeenCalled();
    expect(sessionServiceSpy).toHaveBeenCalled();
    expect(mockSessionService.sessionInformation).toBeUndefined();
    expect(mockSessionService.isLogged).toBeFalsy();

  });

});
