import {FormComponent} from "./form.component";
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {SessionApiService} from "../../services/session-api.service";
import {SessionService} from "../../../../services/session.service";
import {TeacherService} from "../../../../services/teacher.service";
import {MatCardModule} from "@angular/material/card";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {expect} from "@jest/globals";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  // Mock services
  const mockActivatedRoute = { snapshot: { paramMap: { get: jest.fn() } } };
  const mockFormBuilder = { group: jest.fn() };
  const mockMatSnackBar = { open: jest.fn() };
  const mockSessionApiService = { create: jest.fn(), update: jest.fn().mockReturnValue(of({})),
    detail: jest.fn().mockReturnValue(of({}))};
  const mockSessionService = { sessionInformation: { admin: true }
  };
  const mockTeacherService = { all: jest.fn() };

  const mockRouter = {
    'url': '/',
    navigate: jest.fn() };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: FormBuilder, useValue: mockFormBuilder },
        { provide: MatSnackBar, useValue: mockMatSnackBar },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: SessionService, useValue: mockSessionService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call lifecycle ngOnInit ', () => {
    const spy = jest.spyOn(component, 'ngOnInit');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('should create a new session with the valid formGroup ',() => {

    component.sessionForm?.patchValue({
      name: 'test',
      description: 'test',
      date: '2023-12-16',
      teacher_id: 1,
    });
    const mockSessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of({}));
    component.submit();

    setTimeout(() => {
      expect(mockSessionApiServiceSpy).toHaveBeenCalled();
      expect(component.sessionForm?.valid).toBeTruthy();
      expect(component.sessionForm?.value).toEqual({
        name: 'test',
        description: 'test',
        teacher_id: 1,
        date: '2023-12-16'
      });
    });
  });


  it('should navigate to sessions if user is not admin',() => {
    mockSessionService.sessionInformation.admin = false;
    const navigateSpy = jest.spyOn(mockRouter, 'navigate');

    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(navigateSpy).toHaveBeenCalled();

  });

  it('should create a new session with the valid formGroup ',() => {
    const mockSession =
      {
        name: 'test',
        description: 'test',
        date: '2023-12-16',
        teacher_id: 1,
      }
    component.sessionForm?.patchValue(mockSession);
    component.onUpdate = false;

    const mockSessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'create').mockReturnValue(of({}));
    component.submit();
    expect(mockSessionApiServiceSpy).toHaveBeenCalled();

  });

  it('should set onUpdate to true and call sessionApiService.detail if url includes update', () => {
    mockRouter.url = '/update';
    const id = '123';
    mockActivatedRoute.snapshot.paramMap.get = jest.fn().mockReturnValue(id);
    const detailSpy = jest.spyOn(mockSessionApiService, 'detail').mockReturnValue(of({}));

    component.ngOnInit();

    expect(component.onUpdate).toBe(true);
    expect(detailSpy).toHaveBeenCalledWith(id);
  });

  it('should call create method of sessionApiService on submit if not updating', () => {
    // Create a mock observable
    const mockObservable = of({});

    // Spy on the method that returns the observable and mock its return value
    jest.spyOn(mockSessionApiService, 'create').mockReturnValue(mockObservable);

    component.onUpdate = false;
    component.submit();

    expect(mockSessionApiService.create).toHaveBeenCalled();

  });

  it('should call update method of sessionApiService on submit if updating', () => {
    // Create a mock observable
    const mockObservable = of({});
    // Spy on the method that returns the observable and mock its return value
    const mockSessionApiServiceSpy = jest.spyOn(mockSessionApiService, 'update').mockImplementation(() => {
      return mockObservable});

    component.onUpdate = true;
    component.submit();

    expect(mockSessionApiServiceSpy).toHaveBeenCalled();

  });
});
