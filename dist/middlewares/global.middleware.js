"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LanguageHelper_1 = require("../utils/LanguageHelper");
class GlobalMiddleware {
}
exports.GlobalMiddleware = GlobalMiddleware;
GlobalMiddleware.checkMethods = (req, res, next) => {
    const { method, path } = req;
    if (method === "GET") {
        return res.status(401).send({
            status: "error",
            message: LanguageHelper_1.LanguageHelper.getLanguageString(null, "methodNotAllowed")
        });
    }
    else {
        console.log(`Express Middleware => ${method} / ${path}`);
        next();
    }
};
GlobalMiddleware.enableCors = function (req, res, next) {
    // TODO: fix - not working as desired
    res.header("Access-Control-Allow-Origin", "http://localhost"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
};
GlobalMiddleware.maintenanceMode = (req, res, next) => {
    return res.status(503).send({
        status: "error",
        message: LanguageHelper_1.LanguageHelper.getLanguageString(null, "appMaintenanceMode")
    });
};
