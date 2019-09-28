const checkMethods = (req, res, next) => {
  const { method, path } = req;

  if (method === "GET") {
    return res.status(401).send({
      error: "method not allowed"
    });
  } else {
    console.log(`Express Middleware => ${method} / ${path}`);

    next();
  }
};

const maintenanceMode = (req, res, next) => {
  return res.status(503).send({
    error: "App is in maintenance mode"
  });
};

module.exports = {
  checkMethods,
  maintenanceMode
};
