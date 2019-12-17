import jwt from 'jsonwebtoken';

import { serverConfig } from '../constants/env';
import { User } from '../resources/User/user.model';


export class MiddlewareHelper {

  public static getUserFromRequest = async (req) => {

    const token = req.header('Authorization').replace('Bearer ', ''); // remove Bearer string

    const decoded: any = jwt.verify(token, serverConfig.jwtSecret);

    // find an user with the correct id (passed through the token), that has the particular token stored.

    const user = await User.findOne({
      _id: decoded._id,
      'tokens.token': token
    });

    return { user, token };

  }



}