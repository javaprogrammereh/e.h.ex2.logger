const registerSuperAdmin = process.env.REGISTER_SUPER_ADMIN;
const config = require("../../../config");
const { response } = require(`${config.path.helper}/response`);

module.exports = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (token === registerSuperAdmin) next();
  else {
    return response(res, "توکن وارد شده صحیح نیست", 401, null, "token");
  }
};
