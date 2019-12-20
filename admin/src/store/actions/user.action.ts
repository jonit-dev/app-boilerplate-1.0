import { APIHelper } from '../../helpers/APIHelper';
import { RequestTypes } from '../../typescript/Request.types';
import { persistor } from '../persistor.store';
import { USER_LOGIN, USER_LOGOUT, USER_REFRESH_INFO, USERS_GET } from '../reducers/user.reducer';
import { toggleModal } from './ui.actions';

export enum AuthType {
  EmailPassword = "EmailPassword",
  GoogleOAuth = "GoogleOAuth",
  FacebookOAuth = "FacebookOAuth"
}

export interface ICredentials {
  email: string;
  password: string;
}

export interface IGoogleAuthPayload {
  idToken?: string | null;
  appClientId?: string;
  cancelled?: boolean;
  error?: boolean;
}

export interface IFacebookAuthPayload {
  accessToken: string;
}

export interface IRegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const userLogin = (
  payload: ICredentials | IGoogleAuthPayload | IFacebookAuthPayload,
  type: AuthType = AuthType.EmailPassword
) => async (dispatch: any) => {
  try {
    let response;

    if (type === AuthType.EmailPassword) {
      response = await APIHelper.request(
        RequestTypes.POST,
        "/users/login",
        payload,
        false
      );
    }

    // TODO: add support to OAuth later

    // if (type === AuthType.FacebookOAuth) {
    //   response = await APIHelper.request(
    //     RequestTypes.POST,
    //     "/users/login/facebook-oauth",
    //     payload,
    //     false
    //   );
    // }

    // if (type === AuthType.GoogleOAuth) {
    //   response = await APIHelper.request(
    //     RequestTypes.POST,
    //     "/users/login/google-oauth",
    //     payload,
    //     false
    //   );
    // }

    if (response) {
      console.log(response);

      if (response.data.error) {
        // TODO: add modal message
        alert(response.data.error);

        return;
      }
      if (response.data.token) {
        // refresh push token

        await dispatch({ type: USER_LOGIN, payload: response.data });

        // TODO: navigate
        window.location.href = "/dashboard";
        console.log("navigating user...");
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const editUser = (userId: string, payload) => async (dispatch: any) => {
  const response = await APIHelper.request(
    RequestTypes.PATCH,
    `/users/${userId}`,
    payload
  );

  if (response) {
    console.log(response.data);

    if (response.data.status === "error") {
      alert(response.data.message);
    }

    await dispatch(getUsers()); // update our current list of users

    //close modal
    await dispatch(toggleModal("EditUser", false));

    alert("User edited successfully!");
  }
};

export const getUsers = () => async (dispatch: any) => {
  const response = await APIHelper.request(
    RequestTypes.GET,
    "/users",
    {},
    true
  );

  if (response) {
    dispatch({ type: USERS_GET, payload: response.data });

    return response.data;
  }
};

export const userRegister = (
  registerCredentials: IRegisterCredentials
) => async (dispatch: any) => {
  try {
    const response: any = await APIHelper.request(
      RequestTypes.POST,
      "/users",
      registerCredentials,
      false
    );

    if (response.status === 201) {
      // success
      const user = response.data.user;

      await dispatch(
        userLogin({
          email: user.email,
          password: registerCredentials.password
        })
      );
    } else {
      const error = response.data;

      alert(error.message);
    }
  } catch (error) {
    console.error(error);
  }
};

export const userLogout = () => async dispatch => {
  console.log("Logging out user");

  await persistor.purge();

  await localStorage.clear();

  await dispatch({ type: USER_LOGOUT });

  window.location.href = "/";
};

export const userGetProfileInfo = () => async dispatch => {
  console.log("getting profile info...");
  const response = await APIHelper.request(
    RequestTypes.GET,
    "/users/profile",
    {},
    true
  );

  if (response) {
    if (response.data.user) {
      console.log("User profile info refreshed!");
      dispatch({
        type: USER_REFRESH_INFO,
        payload: {
          user: response.data.user,
          token: response.data.token
        }
      });
    }
  }
};
