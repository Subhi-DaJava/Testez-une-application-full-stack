import { expect } from '@jest/globals';
import { SessionApiService } from './session-api.service';
import {of} from "rxjs";

describe('SessionsApiService', () => {
  let service: SessionApiService;
  let httpClientSpy: any;
  const url = 'api/session';

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
      delete: jest.fn(),
      post: jest.fn(),
      put: jest.fn()
    }
    service = new SessionApiService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call all method', () => {
    const response = [
      {
        id: '1',
        name: 'fakeName',
        date: '2021-01-01',
        teacher: {
          id: '1',
          name: 'fakeName',
          email: 'fakeEmail'
        },
        students: [
          {
            id: '1',
            firstName: 'fakeName',
            email: 'fakeEmail'
          }
        ]
      }
    ];

    const httpSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(response));
    service.all().subscribe((data: any) => {
      expect(data).toEqual(response);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
    expect(httpSpy).toHaveBeenCalledWith(url);
  });

  it('should call detail method', () => {
    const response = {
      id: '1',
      name: 'fakeName',
      date: '2021-01-01',
      teacher: {
        id: '1',
        name: 'fakeName',
        email: 'fakeEmail'
      },
      students: [
        {
          id: '1',
          firstName: 'fakeName',
          email: 'fakeEmail'
        }
      ]
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(response));
    service.detail('1').subscribe((data: any) => {
      expect(data).toEqual(response);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${url}/1`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`);
  });

  it('should call delete a session by its id', () => {
    const httpSpy = jest.spyOn(httpClientSpy, 'delete').mockReturnValue(of({}));
    service.delete('1').subscribe((data: any) => {
      expect(data).toEqual({});
    });

    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${url}/1`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`);
  });

  it('should call create method', () => {
    const response: any = {
      id: '1',
      name: 'fakeSessionName',
      date: '2021-01-01',
      teacher_id: 1,
      users: [],
      description: 'fakeDescription'
    };
    const newSession: any = {
      name: 'fakeSessionName',
      date: '2021-01-01',
      teacher_id: 1,
      users: [],
      description: 'fakeDescription'
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockImplementation(() => of(response));
    service.create(newSession).subscribe((data: any) => {
      expect(data.name).toEqual('fakeSessionName');
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(url, newSession);
    expect(httpSpy).toHaveBeenCalledWith(url, newSession);
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should call update method', () => {
    const response: any = {
      id: '1',
      name: 'fakeSessionName_updated',
      date: '2021-01-01',
      teacher_id: 1,
      users: [],
      description: 'fakeDescription'
    };
    const updatedSession: any = {
      name: 'fakeSessionName_updated',
      date: '2021-01-01',
      teacher_id: 1,
      users: [],
      description: 'fakeDescription'
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'put').mockImplementation(() => of(response));
    service.update('1', updatedSession).subscribe((data: any) => {
      expect(data.name).toEqual('fakeSessionName_updated');
      expect(data).toEqual(response);
    });

    expect(httpClientSpy.put).toHaveBeenCalledWith(`${url}/1`, updatedSession);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`, updatedSession);
    expect(httpSpy).toHaveBeenCalledTimes(1);
  });

  it('should call participate method', () => {
    const response: any = {};
    const userId = '1';

    const httpSpy = jest.spyOn(httpClientSpy, 'post').mockImplementation(() => of(response));
    service.participate('1', userId).subscribe((data: any) => {
      expect(data).toEqual({});
    });

    expect(httpClientSpy.post).toHaveBeenCalledWith(`${url}/1/participate/${userId}`, null);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1/participate/${userId}`, null);
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(service.participate('1', userId)).toBeTruthy();
  });

  it('should call unParticipate method', () => {
    const response: any = {};
    const userId = '1';

    const httpSpy = jest.spyOn(httpClientSpy, 'delete').mockImplementation(() => of(response));
    service.unParticipate('1', userId).subscribe((data: any) => {
      expect(data).toEqual({});
    });

    expect(httpClientSpy.delete).toHaveBeenCalledWith(`${url}/1/participate/${userId}`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1/participate/${userId}`);
    expect(httpSpy).toHaveBeenCalledTimes(1);
    expect(service.unParticipate('1', userId)).toBeTruthy();
  });

});
