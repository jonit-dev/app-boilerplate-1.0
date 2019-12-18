import { RequestTypes } from '../typescript/Request.types';
import { APIHelper } from './APIHelper';

export class UserHelper {
  public static getUsers = async () => {
    const response = await APIHelper.request(
      RequestTypes.GET,
      "/users",
      {},
      true
    );

    if (response) {
      return response.data;
    }
  };
}
