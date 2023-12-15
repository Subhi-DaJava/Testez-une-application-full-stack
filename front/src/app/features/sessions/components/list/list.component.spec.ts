import {HttpClientModule} from '@angular/common/http';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {expect} from '@jest/globals';
import {SessionService} from 'src/app/services/session.service';
import {ListComponent} from './list.component';
import {Session} from "../../interfaces/session.interface";
import {SessionApiService} from "../../services/session-api.service";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";
import {RouterTestingModule} from "@angular/router/testing";


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let mockSessionApiService: any;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {

    mockSessionApiService = {
      all: jest.fn().mockReturnValue(of([]))
    };
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientModule, MatCardModule, MatIconModule, RouterTestingModule],
      providers: [{ provide: SessionService, useValue: mockSessionService },
        {provide: SessionApiService, useValue: mockSessionApiService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve a list of sessions', () => {
    const session1: Session = {
      name: 'Mathematics 101',
      description: 'Introduction to Mathematics',
      date: new Date(),
      teacher_id: 1,
      users: [2, 3, 4],
    };
    const session2: Session = {
      name: 'Physics 101',
      description: 'Introduction to Physics',
      date: new Date(),
      teacher_id: 2,
      users: [5, 6, 7],
    };
    const sessions = [ session1, session2 ];

    jest.spyOn(mockSessionApiService, 'all').mockReturnValue(of(sessions));

    component.sessions$.subscribe((data) => {
      expect(data).toEqual(sessions);
    });

    expect(mockSessionApiService.all).toHaveBeenCalled();
    expect(mockSessionApiService.all).toHaveBeenCalledTimes(1);

  });

  it('should render a list of sessions in the template', () => {
    const session1: Session = {
      name: 'Mathematics 101',
      description: 'Introduction to Mathematics',
      date: new Date(),
      teacher_id: 1,
      users: [2, 3, 4],
    };
    const session2: Session = {
      name: 'Physics 101',
      description: 'Introduction to Physics',
      date: new Date(),
      teacher_id: 2,
      users: [5, 6, 7],
    };
    const sessions = [ session1, session2 ];

    component.sessions$ = of(sessions);

    fixture.detectChanges();

    const listElement = fixture.debugElement.query(By.css('[data-testid="session-list"]'));

    expect(listElement.children.length).toEqual(2);
  });

  it('should display the Create Session button, Detail button and Edit Button if the user is an admin', () => {

    // mockSessionService.sessionInformation = {
    //   admin: false
    // };

    const session1: Session = {
      name: 'Mathematics 101',
      description: 'Introduction to Mathematics',
      date: new Date(),
      teacher_id: 1,
      users: [2, 3, 4],
    };
    const session2: Session = {
      name: 'Physics 101',
      description: 'Introduction to Physics',
      date: new Date(),
      teacher_id: 2,
      users: [5, 6, 7],
    };
    const sessions = [ session1, session2 ];

    component.sessions$ = of(sessions);

    fixture.detectChanges();

    const createButton = fixture.debugElement.query(By.css('[data-testid="create-session-button"]'));
    const editButton = fixture.debugElement.query(By.css('[data-testid="edit-button"]'));

    expect(createButton).toBeTruthy();
    expect(editButton).toBeTruthy();
  });

});
