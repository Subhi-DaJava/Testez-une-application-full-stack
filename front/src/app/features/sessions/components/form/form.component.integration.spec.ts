import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Session } from '../../interfaces/session.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { TeacherService } from 'src/app/services/teacher.service';
import {ListComponent} from "../list/list.component";
import {DetailComponent} from "../detail/detail.component";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSession = {
    name: 'Yoga Session 1',
    description: 'Yoga Session 1',
    date: new Date(),
    teacher_id: 1,
  } as jest.Mocked<Session>;

  const mocksSessionInfo: SessionInformation = {
    admin: true,
    id: 1,
    token: 'FakeJWT',
    type: 'Bearer',
    username: 'Yoga',
    firstName: 'Admin',
    lastName: 'ADMIN YOGA'
  }

  let sessionService: SessionService;
  let sessionApiService: SessionApiService;
  let matSnackBar: MatSnackBar;
  let teacherService: TeacherService

  let mockRouter: Router;
  let activatedRouteMock: any;

  beforeEach(async () => {
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(of('1'))
        }
      }
    } as unknown as jest.Mocked<ActivatedRoute>;

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'sessions', component: ListComponent },
          { path: 'sessions/:id', component: DetailComponent }]),
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule
      ],
      providers: [
        SessionService,
        SessionApiService,
        MatSnackBar,
        TeacherService,
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      declarations: [FormComponent]
    })
      .compileComponents();

    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    matSnackBar = TestBed.inject(MatSnackBar);
    teacherService = TestBed.inject(TeacherService);
    mockRouter = TestBed.inject(Router);

    sessionService.logIn(mocksSessionInfo);

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create session properly', () => {
    expect(component.onUpdate).toBeFalsy()
    component.sessionForm?.setValue(mockSession);
    const routerSpy = jest.spyOn(mockRouter, 'navigate');

    const session = component.sessionForm?.value as Session;
    const sessionApiServiceSpy = jest.spyOn(sessionApiService, 'create').mockReturnValue(of(session));
    const matSnackBarSpy = jest.spyOn(matSnackBar, 'open');

    component.submit()

    expect(sessionApiServiceSpy).toHaveBeenCalledWith(session);
    expect(matSnackBarSpy).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);

  });

  it('should update session properly', () => {
    component.onUpdate = true;
    const routerSpy = jest.spyOn(mockRouter, 'navigate');
    const mockSessionUpdate = {
      id: 1,
      name: 'Yoga Session 1 updated',
      description: 'Yoga Session 1 updated',
      date: new Date(),
      teacher_id: 1,
    } as Session;

    component.sessionForm?.setValue(mockSession);

    component.ngOnInit();

    const session = component.sessionForm?.value as Session;

   const sessionApiServiceSpy = jest.spyOn(sessionApiService, 'update', ).mockReturnValue(of(mockSessionUpdate));

    const matSnackBarSpy = jest.spyOn(matSnackBar, 'open');

    component.submit()

    expect(matSnackBarSpy).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
    expect(routerSpy).toHaveBeenCalledWith(['sessions']);
    expect(sessionApiServiceSpy).toHaveBeenCalledWith(session.id, session);
  });

});
