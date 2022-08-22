const config = require("../../../../config");
const controller = require(`${config.path.controller}/controller`);

const { response } = require(`${config.path.helper}/response`);

module.exports = class initializeController extends controller {
  constructor() {
    super();
    (this.model = {}), (this.helper = { response });
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
