const config = require("../../../../config");
const controller = require(`${config.path.controller}/controller`);
const Project = require(`${config.path.model}/project`);

const { response } = require(`${config.path.helper}/response`);

const { transform } = require(`${config.path.helper}/transform`);
const itemTransform = ["._id", ".name", ".sections", ".createdAt"];

const { index } = require(`${config.path.helper}/indexAggregate`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Project }),
      (this.helper = { response, transform, index, itemTransform });
  }
  validation(req, res) {
    return this.showValidationErrors(req, res);
  }
  ok(res, message = "با موفقیت ثبت شد", status = 200) {
    return this.Ok(res, message, status);
  }

  abort(res, status, message = "مشکلی پیش آمده", field = null) {
    return this.Abort(res, status, message, field);
  }
};
