const INITIAL_STATE = {
  user: null,
  token: null
};

export const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case USER_REGISTER:
      return { ...state, user: action.payload };

    case USER_REFRESH_INFO:
    case USER_LOGIN:
      // Store token on async storage as well (some classes cannot access redux, so we'll have to use async storage to store the token)

      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token
      };
    case USER_LOGOUT:
      localStorage.clear();

      return {
        ...state,
        user: null,
        token: null
      };

    default:
      return state;
  }
};

export const USER_LOGOUT = "USER_LOGOUT";
export const USER_REFRESH_INFO = "USER_REFRESH_INFO";
export const USER_REGISTER = "USER_REGISTER";
export const USER_LOGIN = "USER_LOGIN";
