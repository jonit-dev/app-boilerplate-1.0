import { LanguageHelper } from '../utils/LanguageHelper';

export class GlobalMiddleware {
  public static checkMethods = (req, res, next) => {
    const { method, path } = req;

    if (method === "GET") {
      return res.status(401).send({
        status: "error",
        message: LanguageHelper.getLanguageString(null, "methodNotAllowed")
      });
    } else {
      console.log(`Express Middleware => ${method} / ${path}`);

      next();
    }
  };

  public static maintenanceMode = (req, res, next) => {
    return res.status(503).send({
      status: "error",
      message: LanguageHelper.getLanguageString(null, "appMaintenanceMode")
    });
  };
}
