const config = require("../../../../config");
const controller = require(`${config.path.controller}/controller`);
const LogDescription = require(`${config.path.model}/logDescription`);
const Log = require(`${config.path.model}/log`);
const Section = require(`${config.path.model}/section`);
const Project = require(`${config.path.model}/project`);

const { index } = require(`${config.path.helper}/indexAggregate`);

const { response } = require(`${config.path.helper}/response`);
const { transform } = require(`${config.path.helper}/transform`);

const itemTransform = [
  "._id",
  ".description",
  ".status",
  ".logcode",
  // ".log",
  // '.section',
  // ".createdAt",
];

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { LogDescription, Log, Section, Project }),
      (this.helper = { response, index, itemTransform, transform });
  }
  validation(req, res) {
    return this.showValidationErrors(req, res);
  }
  ok(res, message = "با موفقیت ثبپ شد", status = 200) {
    return this.Ok(res, message, status);
  }
  abort(res, status, message = "مشکلی پیش آمده", field = null) {
    return this.Abort(res, status, message, field);
  }
};
