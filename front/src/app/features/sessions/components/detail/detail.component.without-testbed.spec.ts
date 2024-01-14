import {DetailComponent} from "./detail.component";
import {of} from "rxjs";
import {TeacherService} from "../../../../services/teacher.service";
import {Teacher} from "../../../../interfaces/teacher.interface";
import {Session} from "../../interfaces/session.interface";

describe('DetailComponent', () => {

  let component: DetailComponent;
  let mockSessionApiService: any;
  let mockSessionService: any;
  let fb : any;
  let mockRouter : any;
  let macSnackBar : any;
  let mockActivatedRoute : any;
  let mockTeacherService : any;

  mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  }
  const teacherMock : Teacher = {
    id: 0,
    lastName: '',
    firstName: '',
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const sessionMock : Session = {
    name: '',
    description: '',
    date: new Date(),
    teacher_id: 0,
    users: [mockSessionService.sessionInformation.id]
  };

  mockSessionService = {
    sessionInformation: {
      admin: true,
      id: 1
    }
  };

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue(of('1'))
        }
      }
    };
    mockRouter = {
      navigate: jest.fn()

    };
    mockSessionApiService = {
      detail: jest.fn().mockReturnValue(of()),
      delete: jest.fn().mockReturnValue(of()),
      participate: jest.fn().mockReturnValue(of()),
      unParticipate: jest.fn().mockReturnValue(of(null))
    };
    mockTeacherService = {
      detail: jest.fn().mockReturnValue(of(teacherMock))
    } as unknown as jest.Mocked<TeacherService>;


    component = new DetailComponent(mockActivatedRoute, fb, mockSessionService, mockSessionApiService, mockTeacherService, macSnackBar, mockRouter);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call detail method on ngOnInit', () => {
    component.ngOnInit();
    expect(mockSessionApiService.detail).toHaveBeenCalled();
  });

  it('should call delete method when delete is invoked', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledWith(component.sessionId);
  });

  it('should call participate method when participate is invoked', () => {
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalled();
  });

  it('should call unParticipate method when unParticipate is invoked', () => {
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalled();
  });
});
