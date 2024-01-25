import { expect } from '@jest/globals';
import { UserService } from './user.service';
import {first, of} from "rxjs";

describe('UserService', () => {
  let service: UserService;
  let httpClientSpy: any; // mock of HttpClient
  const url = 'api/user';
  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      delete: jest.fn()
    };
    service = new UserService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getById', () => {
    const response = {
      id: '1',
      firstName: 'fakeName',
      email: 'email@test.com',
    };
    const httpSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(response));
    service.getById('1').pipe(first()).subscribe((user: any) => {
      expect(user).toEqual(response);
    });
    expect(httpClientSpy.get).toHaveBeenCalledWith(`${url}/1`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`);
  });

  it('should call delete', () => {
    const response = {
      id: '1',
      firstName: 'fakeName',
      email: 'test@test.com'
    }

    const httpSpy = jest.spyOn(httpClientSpy, 'delete').mockReturnValue(of({}));
    service.delete('1').pipe(first()).subscribe((data: any) => {
      expect(data).toEqual(response);
    });

    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${url}/1`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`);
  });

});
