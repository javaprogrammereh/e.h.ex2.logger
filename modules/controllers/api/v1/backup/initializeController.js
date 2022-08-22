const config = require("../../../../config");
const controller = require(`${config.path.controller}/controller`);
const Log = require(`${config.path.model}/log`);
const Project = require(`${config.path.model}/project`);

const { response } = require(`${config.path.helper}/response`);
const { transform } = require(`${config.path.helper}/transform`);
const makeLogcode = require(`${config.path.helper}/makeLogcode`);
const itemTransform = [
  "._id",
  ".ip",
  ".logcode",
  ".data",
  ".sectionId",
  ".isPermanent",
  ".name"
  // '.project',
  // ".logDescription",
  // ".createdAt",
];

const { index } = require(`${config.path.helper}/indexAggregate`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = { Log, Project }),
      (this.helper = {
        transform,
        itemTransform,
        index,
        response,
        makeLogcode,
      });
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
