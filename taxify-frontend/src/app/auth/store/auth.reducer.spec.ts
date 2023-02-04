import * as authReducer from './auth.reducer';
import * as AuthActions from './auth.actions';
import { LoggedInUser } from '../model/logged-in-user';

describe('Auth Reducer', () => {
  let initState: authReducer.State = {
    authenticationConfirmed: false,
    isLoginMode: false,
    loading: false,
    user: undefined,
    userExists: false,
  };

  describe(AuthActions.CHANGE_AUTH_MODE, () => {
    it('login mode should be set', () => {
      const action = new AuthActions.ChangeAuthMode(true);
      const expectedState: authReducer.State = {
        ...initState,
        isLoginMode: true,
      };
      const result = authReducer.authReducer(initState, action);

      expect(result).toEqual(expectedState);
    });

    it('signup mode should be set', () => {
      const action = new AuthActions.ChangeAuthMode(false);
      const expectedState: authReducer.State = {
        ...initState,
        isLoginMode: false,
      };
      const result = authReducer.authReducer(initState, action);

      expect(result).toEqual(expectedState);
    });

    it('signup mode should be set for null', () => {
      const action = new AuthActions.ChangeAuthMode(null);
      const expectedState: authReducer.State = {
        ...initState,
        isLoginMode: null,
      };
      const result = authReducer.authReducer(initState, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe(AuthActions.LOGIN_START, () => {
    it('should start loading', () => {
      const action = new AuthActions.LoginStart({ email: '', password: '' });
      const expectedState: authReducer.State = {
        ...initState,
        loading: true,
      };
      const result = authReducer.authReducer(initState, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe(AuthActions.LOGIN_SUCCESS, () => {
    it('should set user', () => {
      const user = new LoggedInUser('email', 'role', 'token', new Date());
      const action = new AuthActions.LoginSuccess(user);
      const expectedState: authReducer.State = {
        ...initState,
        user: user,
      };
      const result = authReducer.authReducer(initState, action);

      expect(result).toEqual(expectedState);
    });
  });

  describe(AuthActions.AUTHENTICATE_FAIL, () => {
    it('should nullify logged user', () => {
      const action = new AuthActions.AuthenticateFail('');
      const stateWithUser: authReducer.State = {
        authenticationConfirmed: false,
        isLoginMode: false,
        loading: false,
        user: new LoggedInUser('email', 'role', 'token', new Date()),
        userExists: false,
      };
      const expectedState: authReducer.State = {
        ...initState,
        loading: false,
        user: null,
      };
      const result = authReducer.authReducer(stateWithUser, action);

      expect(result).toEqual(expectedState);
    });
  });
});
