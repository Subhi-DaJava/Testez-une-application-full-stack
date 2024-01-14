import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { MeComponent } from './me.component';
import {UserService} from "../../services/user.service";
import {of} from "rxjs";
import {By} from "@angular/platform-browser";

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let mockUserService: any;

  const mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  beforeEach(async () => {
    mockUserService = {
      getById: jest.fn().mockReturnValue(of()),
      delete: jest.fn().mockReturnValue(of())
    }
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule
      ],
      providers: [{ provide: SessionService, useValue: mockSessionService },
        { provide: UserService, useValue: mockUserService }],
    })
      .compileComponents();

    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the Admin information', () => {
    const userAdmin  = {
      firstName: 'Admin',
      lastName: 'ADMIN',
      email: 'admin@test.com',
      admin: true
    }

    mockUserService.getById.mockImplementation(() => of(userAdmin));
    component.ngOnInit();
    expect(component.user).toEqual(userAdmin);
    expect(mockUserService.getById).toHaveBeenCalled();
  });

  it('should show the Admin information and delete-user button should be disabled', () => {
    const userAdmin  = {
      firstName: 'Admin',
      lastName: 'ADMIN',
      email: '',
    }

    mockUserService.getById.mockImplementation(() => of(userAdmin));
    component.ngOnInit();
    fixture.detectChanges();

    const deleteButtonElement = fixture.debugElement.query(By.css('[data-testid="delete-user"]'));

    expect(component.user).toEqual(userAdmin);
    expect(mockUserService.getById).toHaveBeenCalled();
    expect(deleteButtonElement.nativeElement).toBeFalsy;

  });

  it('should show the simple User information', () => {
    const user = {
      firstName: 'User',
      lastName: 'USER',
      email: 'user@test.com',
      admin: false
    }

    mockUserService.getById.mockImplementation(() => of(user));
    component.ngOnInit();
    expect(component.user).toEqual(user);
    expect(mockUserService.getById).toHaveBeenCalled();

  });

  it('should show the simple User information and delete button should be enabled', () => {
    const user = {
      firstName: 'User',
      lastName: 'USER',
      email: '',
      // admin: true
    }

    mockUserService.getById.mockImplementation(() => of(user));
    component.ngOnInit();

    fixture.detectChanges();

    const deleteButtonElement = fixture.debugElement.query(By.css('[data-testid="delete-user"]'));
    const deleteSpanElement = fixture.debugElement.query(By.css('[data-testid="delete-tag"]'));

    expect(component.user).toEqual(user);
    expect(mockUserService.getById).toHaveBeenCalled();
    expect(deleteButtonElement.nativeElement).toBeTruthy;
    expect(deleteSpanElement.nativeElement.textContent).toBe('Delete');
  });

  it('should call back function', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should a user will be deleted when delete function is called', () => {
    const userServiceSpy = jest.spyOn(mockUserService, 'delete').mockImplementation(() => of(void 0));
    component.delete();
    expect(userServiceSpy).toHaveBeenCalled();
  });

});
