const config = require("../../../../config");
const controller = require(`${config.path.controller}/controller`);

const Token = require(`${config.path.model}/token`);

const { response } = require(`${config.path.helper}/response`);
const { index } = require(`${config.path.helper}/indexAggregate`);
const { transform } = require(`${config.path.helper}/transform`);

const itemTransform = ["._id", ".userId", ".token", ".liveTime", ".deviceName", ".lastIp"];
module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Token }), (this.helper = { index, response, transform, itemTransform });
  }
  validation(req, res) {
    return this.showValidationErrors(req, res);
  }
  ok(res, message, status = 200) {
    return this.Ok(res, message, status);
  }
  abort(res, status, message = null, field = null) {
    return this.Abort(res, status, message, field);
  }
};

