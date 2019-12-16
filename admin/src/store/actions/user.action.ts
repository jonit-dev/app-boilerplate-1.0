import { APIHelper } from '../../helpers/APIHelper';
import { RequestTypes } from '../../typescript/Request.types';
import { USER_LOGIN } from '../reducers/user.reducer';

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

        const user = response.data.user;

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
