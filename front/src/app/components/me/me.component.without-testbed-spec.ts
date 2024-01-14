import {of} from "rxjs";
import {MeComponent} from "./me.component";

describe('MeComponent', () => {
  let component: MeComponent;
  let mockUserService: any;
  let mockSessionService: any;
  let mockRouter: any;
  let mockMatSnackBar: any;

  beforeEach(() => {
    mockSessionService = {
      sessionInformation: {
        admin: true,
        id: 1
      },
      logOut: jest.fn()
    };

    mockUserService = {
      getById: jest.fn().mockReturnValue(of()),
      delete: jest.fn().mockReturnValue(of())
    };

    mockRouter = {
      navigate: jest.fn()
    };

    mockMatSnackBar = {
      open: jest.fn()
    };

    component = new MeComponent(mockRouter, mockSessionService, mockMatSnackBar, mockUserService);
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

    mockUserService.getById.mockReturnValue(of(userAdmin));
    component.ngOnInit();
    expect(component.user).toEqual(userAdmin);
    expect(mockUserService.getById).toHaveBeenCalled();
  });

  it('should show the simple User information', () => {
    const user = {
      firstName: 'User',
      lastName: 'USER',
      email: 'user@test.com',
      admin: false
    }

    mockUserService.getById.mockReturnValue(of(user));
    component.ngOnInit();
    expect(component.user).toEqual(user);
    expect(mockUserService.getById).toHaveBeenCalled();
  });

  it('should call back function', () => {
    const spy = jest.spyOn(window.history, 'back');
    component.back();
    expect(spy).toHaveBeenCalled();
  });

  it('should a user will be deleted when delete function is called', () => {
    const userServiceSpy = jest.spyOn(mockUserService, 'delete').mockReturnValue(of(void 0));
    component.delete();
    expect(userServiceSpy).toHaveBeenCalled();
  });
});
