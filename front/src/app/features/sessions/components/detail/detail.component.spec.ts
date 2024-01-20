import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterTestingModule,} from '@angular/router/testing';
import {expect} from '@jest/globals';
import {SessionService} from '../../../../services/session.service';
import {DetailComponent} from './detail.component';
import {Session} from "../../interfaces/session.interface";
import {SessionApiService} from "../../services/session-api.service";
import {of, tap} from "rxjs";
import {By} from "@angular/platform-browser";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let mockSessionApiService: any;

  const mockRouter: any = {
    navigate: jest.fn()
  }

  const mockSessionService: any = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of()),
    delete: jest.fn().mockReturnValue(of()),
    participate: jest.fn().mockReturnValue(of()),
    unParticipate: jest.fn().mockReturnValue(of(null))
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        HttpClientModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        MatIconModule,
        MatCardModule

      ],
      declarations: [DetailComponent],
      providers: [{ provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService }],
    })
      .compileComponents();
    fixture = TestBed.createComponent(DetailComponent);

    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correctly a session information', () => {
    const session: Session = {
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(session));

    component.ngOnInit();
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('[data-testid="session-title"'));

    expect(component.session).toEqual(session);
    expect(component.isParticipate).toEqual(true);
    expect(titleElement.nativeElement.textContent).toEqual(session.name);

  });

  it('should render the delete button if the user is admin', () => {
    const session: Session = {
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(session));

    component.ngOnInit();
    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));

    expect(deleteButton).toBeTruthy();
  });

  it('should delete the session when the delete method is called', () => {
    component.session = {
      id: 1,
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    component.sessionId = '1';

    const spySessionApiService = jest.spyOn(mockSessionApiService, 'delete').mockImplementation(() => {
      return of(void 0).pipe(tap(() => {
        expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
      }));
    });

    component.delete();

    expect(spySessionApiService).toHaveBeenCalledWith('1');
  });


  it('should admin delete a session when the delete button in the template is clicked', () => {
    const session: Session = {
      id: 1,
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of(session));

    fixture.detectChanges();

    const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
    const spySessionApiService = jest.spyOn(mockSessionApiService, 'delete').mockReturnValue(of(void 0));

    deleteButton.triggerEventHandler('click', null);

    expect(mockSessionApiService.delete).toHaveBeenCalledWith('1');
    expect(spySessionApiService).toHaveBeenCalled();

  });


  it('should an user participate to a session', () => {
    component.session = {
      id: 1,
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    component.sessionId = '1';
    component.userId = '2';

    mockSessionService.sessionInformation = {
      admin: false,
      id: 2
    }

    const spySessionApiService = jest.spyOn(mockSessionApiService, 'participate').mockReturnValue(of(void 0));

    component.participate();

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '2');
    expect(spySessionApiService).toHaveBeenCalled();
  });

  it('should an user unParticipate from a session', () => {
    component.session = {
      id: 1,
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };

    component.sessionId = '1';
    component.userId = '1';

    mockSessionService.sessionInformation = {
      admin: false,
      id: 2
    }

    const spySessionApiService = jest.spyOn(mockSessionApiService, 'unParticipate').mockReturnValue(of(void 0));

    component.unParticipate();

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '1');
    expect(spySessionApiService).toHaveBeenCalled();
  });

  it('should not display the participate or the unParticipate button if the user is admin', () => {

    component.isAdmin = true;
    fixture.detectChanges();
    const participateButton = fixture.debugElement.query(By.css('[data-testid="user-participate"]'));
    const unParticipateButton = fixture.debugElement.query(By.css('[data-testid="user-unParticipate"]'));

    expect(participateButton).toBeFalsy();
    expect(unParticipateButton).toBeFalsy();
  });

  it('should display the participate button if the user is not admin and not participate', () => {

    component.isAdmin = false;
    component.isParticipate = false;
    fixture.detectChanges();

    const participateButton = fixture.debugElement.query(By.css('[data-testid="user-participate"]'));
    const unParticipateButton = fixture.debugElement.query(By.css('[data-testid="user-unParticipate"]'));

    expect(participateButton).toBeTruthy();
    expect(unParticipateButton).toBeFalsy();
  });

  it('should a user participate to a session when the participate button is clicked', () => {
    component.session = {
      id: 1,
      name: 'Yoga For the Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };
    component.sessionId = '1';
    component.userId = '2';

    mockSessionService.sessionInformation = {
      admin: false,
      id: 2
    }

    const spySessionApiService = jest.spyOn(mockSessionApiService, 'participate').mockReturnValue(of(void 0));

    const participateButton = fixture.debugElement.query(By.css('[data-testid="user-participate"]'));
    participateButton.triggerEventHandler('click', null);

    expect(mockSessionApiService.participate).toHaveBeenCalledWith('1', '2');
    expect(spySessionApiService).toHaveBeenCalled();
  });

  it('should a user unParticipate from a session when the unParticipate button is clicked', () => {
    // Mock session information
    mockSessionApiService.sessionInformation = {
      admin: false,
      id: 1
    }
    // Define a mock session object
    const session: Session = {
      id: 1,
      name: 'Yoga For The Beginners',
      description: 'If you are new to yoga, this class is perfect for you. We will go through the basics of yoga and you will learn the most common poses.',
      date: new Date(),
      teacher_id: 1,
      users: [1, 3, 4],
    };

    // Set component properties
    component.isAdmin = false;
    component.isParticipate = true;
    component.session = session;
    component.sessionId = '1';
    component.userId = '3';

    // Spy on the unParticipate method of the SessionApiService and provide a mock implementation
    const spySessionApiService = jest.spyOn(mockSessionApiService, 'unParticipate').mockImplementation(() => {
      // If the session exists, find the index of the current user in the users array
      if(component.session) {
        const index = component.session.users.indexOf(Number(component.userId));
        // If the user is found in the array, remove them
        if (index > -1) {
          component.session.users.splice(index, 1);
        }
      }
      // Return an Observable of undefined to simulate the API response
      return of(void 0);
    });
    // Trigger change detection to update the view
    fixture.detectChanges();
    // Trigger ngOnInit which indirectly calls fetchSession and updates the session object
    component.ngOnInit();

    // Query the unParticipate button
    const unParticipateButton = fixture.debugElement.query(By.css('[data-testid="user-unParticipate"]'));
    // Trigger the click event handler of the unParticipate button
    unParticipateButton.triggerEventHandler('click', null);

    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith('1', '3');
    expect(spySessionApiService).toHaveBeenCalled();
    expect(component.session.users).toEqual([ 1, 4 ]);
  });

});

