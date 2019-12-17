import { LanguageHelper } from '../utils/LanguageHelper';
import { MiddlewareHelper } from '../utils/MiddlewareHelper';



export class UserMiddleware {

  public static restrictUserType = async (type, req, res, next) => {

    const { user } = await MiddlewareHelper.getUserFromRequest(req);

    if (user) {
      if (user.type !== type) {

        return res.status(401).send({
          status: 'error',
          message: LanguageHelper.getLanguageString('user', 'userTypeUnauthorized')
        });
      }
    }


    next()


  }
}