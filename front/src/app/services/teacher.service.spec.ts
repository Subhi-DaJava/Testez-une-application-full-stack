import { expect } from '@jest/globals';
import { TeacherService } from './teacher.service';
import {first, of} from "rxjs";

describe('TeacherService', () => {
  let service: TeacherService;
  let httpClientSpy: any;
  const url = 'api/teacher';

  beforeEach(() => {
    httpClientSpy = {
      get: jest.fn(),
    }

    service = new TeacherService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return all teachers', () => {
    const teachers = [
      {
        id: 1,
        name: 'Teacher 1',
        email: 'teacher1@test.com'
      },
      {
        id: 2,
        name: 'Teacher 2',
        email: 'teacher2@test.com'
      }
    ];

    const  httpSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(teachers));
    service.all().pipe(first()).subscribe((data: any) => {
      expect(data).toEqual(teachers);
      expect(data.length).toEqual(2);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(url);
    expect(httpSpy).toHaveBeenCalledWith(url);
  });

  it('should return teacher by id', () => {
    const teacher = {
      id: 1,
      name: 'Teacher 1',
      email: 'teacher1@test.com'
    };

    const httpSpy = jest.spyOn(httpClientSpy, 'get').mockReturnValue(of(teacher));
    service.detail('1').pipe(first()).subscribe((data: any) => {
      expect(data).toEqual(teacher);
      expect(data.id).toEqual(1);
    });

    expect(httpClientSpy.get).toHaveBeenCalledWith(`${url}/1`);
    expect(httpSpy).toHaveBeenCalledWith(`${url}/1`);
  });
});
