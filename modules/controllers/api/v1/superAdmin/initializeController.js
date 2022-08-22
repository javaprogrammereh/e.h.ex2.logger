const config = require('../../../../config')
const controller = require(`${config.path.controller}/controller`)
const User = require(`${config.path.model}/user`)

const { transform } = require(`${config.path.helper}/transform`)
const { response } = require(`${config.path.helper}/response`)

const itemTransform = [
  '._id',
  '.password',
  '.email',
  '.type',
  // '.firstName',
  // '.lastName',
]
module.exports = class initializeController extends controller {
  constructor() {
    super()
    this.model = { User },
      this.helper = { response, transform, itemTransform }
  }
  validation(req, res) {
   return this.showValidationErrors(req, res)
  }
  ok(res, message = 'با موفقیت ثبپ شد', status = 200) {
    return this.Ok(res, message, status)
  }
  abort(res, status, message = 'مشکلی پیش آمده', field = null) {
    return this.Abort(res, status, message, field)
  }

}
