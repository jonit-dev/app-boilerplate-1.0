import { IUser } from '../../typescript/User.types';

const INITIAL_STATE = {
  user: null,
  token: null,
  users: [] //this is for admin panel editing. user is the logged in user!
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

    case USERS_GET:
      return {
        ...state,
        users: action.payload
      };

    case USERS_EDIT:
      const { editUserId, editUser } = action.payload;

      return {
        ...state,
        users: state.users.map((user: IUser) => {
          if (user._id === editUserId) {
            return editUser; //return edit user.
          }
          return user;
        })
      };

    case USERS_DELETE:
      return {
        ...state,
        users: state.users.filter((user: IUser) => user._id !== action.payload)
      };

    case USER_LOGOUT:
      localStorage.clear();
      break;

    default:
      return state;
  }
};

export const USER_LOGOUT = "USER_LOGOUT";
export const USER_REFRESH_INFO = "USER_REFRESH_INFO";
export const USER_REGISTER = "USER_REGISTER";
export const USER_LOGIN = "USER_LOGIN";

export const USERS_GET = "USERS_GET";
export const USERS_EDIT = "USERS_EDIT";
export const USERS_DELETE = "USERS_DELETE";

/*

 =========  Safe state update in reducers =========

// From arrays
Removing: state.filter(element => element !== 'hi');
adding: [...state, 'hi'];
replacing: state.map(el => el === 'hi' ? 'bye': el);

//From objects
updating: {...state, name: 'Sam'};
adding: {...state, age: 30};
removing: {state, age: undefined }

*/
