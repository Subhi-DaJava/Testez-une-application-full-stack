import {AuthService} from "./auth.service";
import {of} from "rxjs";

describe('AuthService', () => {
  let service: AuthService;
  let httpClientSpy: any;
  const url = 'api/auth';
  beforeEach(() => {
    httpClientSpy = {
      post: jest.fn(),
    }
    service = new AuthService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call login with success', () => {
    const loginRequest: any = {
      email: 'username@test.com',
      password: 'password'
    };

    const response: any = {
      id: 145,
      token: 'token',
      type: 'participant',
      username: 'username',
      firstName: 'firstName',
      lastName: 'lastName',
      admin: false
    }

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(response));
    service.login(loginRequest).subscribe((data: any) => {
      expect(data).toEqual(response);
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(`${url}/login`, loginRequest);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/login`, loginRequest);

  });

  it('should call login with error', () => {
    const loginRequest: any = {
      email: 'fake@test.com',
      password: 'fake_password'
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(null));

    service.login(loginRequest).subscribe((data: any) => {
      throw new Error('Login failed!');
    });
  });

  it('should call register with success', () => {
    const registerRequest: any = {
      email: 'newEmail@test.com',
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName'
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(void 0));

    service.register(registerRequest).subscribe((data: any) => {
      expect(data).toBeUndefined();
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(`${url}/register`, registerRequest);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/register`, registerRequest);

  });

  it('should call register with error', () => {
    const registerRequest: any = {
      email: '',
      password: '',
      firstName: '',
      lastName: ''
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockReturnValue(of(null));

    service.register(registerRequest).subscribe((data: any) => {
      throw new Error('Register failed!');
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(`${url}/register`, registerRequest);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/register`, registerRequest);


  });



});
