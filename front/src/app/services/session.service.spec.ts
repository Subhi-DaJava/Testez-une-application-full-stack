import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from './session.service';
import {SessionInformation} from "../interfaces/sessionInformation.interface";

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be logged in', () => {
   const user : SessionInformation = {
      id: 1,
      token: 'token',
      type: 'user',
      username: 'User',
      firstName: 'User',
      lastName: 'USER',
      admin: false,
    }
    service.logIn(user);
    expect(service.isLogged).toBeTruthy();
    expect(service.sessionInformation).toBeTruthy();
    expect(service.sessionInformation?.id).toEqual(1);
    expect(service.sessionInformation).toEqual(user);
  });

  it('should be logged out', () => {
    service.logOut();
    expect(service.isLogged).toBeFalsy();
    expect(service.sessionInformation).toBeFalsy();
  });

  it('should $isLogged return false when user is not logged', () => {
    service.$isLogged().subscribe((data: any) => {
      expect(data).toBeFalsy();
    });
  });

  it('should $isLogged return true when user is logged', () => {
    service.$isLogged().subscribe((data: any) => {
      expect(data).toBeTruthy();
    });
  });

});
