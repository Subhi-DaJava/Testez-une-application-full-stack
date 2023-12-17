import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';
import { SessionApiService } from '../../services/session-api.service';
import { FormComponent } from './form.component';
import {By} from "@angular/platform-browser";

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  const mockSessionService = {
    sessionInformation: {
      admin: true
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({

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
        BrowserAnimationsModule
      ],
      providers: [
        { provide: SessionService, useValue: mockSessionService }
        ],
      declarations: [FormComponent]
    })
      .compileComponents();

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

  it('should create a new session with the valid formGroup ', () => {

    component.sessionForm?.patchValue({
      name: 'test',
      description: 'test',
      date: '2023-12-16',
      teacher_id: 1,
    });
    component.submit();
    expect(component.sessionForm?.value).toEqual({
      name: 'test',
      description: 'test',
      teacher_id: 1,
      date: '2023-12-16'
    });
    expect(component.sessionForm?.valid).toBeTruthy();
  });

  it('should submit button be disabled if form (every field) is invalid', () => {
    component.sessionForm?.patchValue({
      name: '',
      description: '',
      date: '',
      teacher_id: '',
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));

    expect(component.sessionForm?.valid).toBeFalsy();
    expect(submitButton.nativeElement.disabled).toBeTruthy();
    expect(component.sessionForm?.get('name')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('description')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('date')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('teacher_id')?.hasError('required')).toBeTruthy();
  });

  it('should update a session with the valid formGroup and the submit button is enable', () => {
    component.onUpdate = true;
    component.sessionForm?.patchValue({
      name: 'test',
      description: 'test',
      date: '2023-12-16',
      teacher_id: 1,
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));

    component.submit();
    expect(component.sessionForm?.value).toEqual({
      name: 'test',
      description: 'test',
      teacher_id: 1,
      date: '2023-12-16'
    });
    expect(component.sessionForm?.valid).toBeTruthy();
    expect(submitButton.nativeElement.disabled).toBeFalsy();
  });

  it('should disable the submit button if the form is invalid before updating a session ', () => {
    component.onUpdate = true;
    component.sessionForm?.patchValue({
      name: '',
      description: '',
      date: '',
      teacher_id: '',
    });
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));

    expect(component.sessionForm?.valid).toBeFalsy();
    expect(submitButton.nativeElement.disabled).toBeTruthy();
    expect(component.sessionForm?.get('name')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('description')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('date')?.hasError('required')).toBeTruthy();
    expect(component.sessionForm?.get('teacher_id')?.hasError('required')).toBeTruthy();
  });


});
