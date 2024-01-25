import { FormBuilder } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { RegisterRequest } from '../../interfaces/registerRequest.interface';
import { of, throwError } from 'rxjs';
describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let mockAuthService: any;
  let mockRouter: any;
  let mockFormBuilder: any;

  beforeEach(() => {
    mockAuthService = {
      register: jest.fn()
    };
    mockRouter = {
      navigate: jest.fn()
    };
    mockFormBuilder = new FormBuilder();
    component = new RegisterComponent(mockAuthService, mockFormBuilder, mockRouter);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should register an user', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@test.com',
      firstName: 'test',
      lastName: 'Test',
      password: '123456'
    };
    component.form.setValue(registerRequest);

    mockAuthService.register.mockReturnValue(of(void 0));
    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should display an error message with empty fields', () => {
    const registerRequest: RegisterRequest = {
      email: '',
      firstName: '',
      lastName: '',
      password: ''
    };

    component.form.setValue(registerRequest);
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBeTruthy();
  });

  it('should show an error message when the invalid fields', () => {
    const registerRequest: RegisterRequest = {
      email: 'test@@test.com',
      firstName: 'fr',
      lastName: 'Te',
      password: '12'
    };

    component.form.setValue(registerRequest);
    mockAuthService.register.mockReturnValue(throwError(() => new Error('Error')));

    component.submit();
    expect(mockAuthService.register).toHaveBeenCalledWith(registerRequest);
    expect(component.onError).toBeTruthy();
    expect(component.form.valid).toBeFalsy();
  });

  it('should validate every field mandatory and min/max length', () => {
    const emailControl = component.form.get('email');
    const firstNameControl = component.form.get('firstName');
    const lastNameControl = component.form.get('lastName');
    const passwordControl = component.form.get('password');

    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBeTruthy();

    firstNameControl?.setValue('ar');
    expect(firstNameControl?.hasError('minlength')).toBeTruthy();

    lastNameControl?.setValue('Th');
    expect(lastNameControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('12');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });
});
