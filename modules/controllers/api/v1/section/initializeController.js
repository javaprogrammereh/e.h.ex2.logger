const config = require('../../../../config')
const controller = require(`${config.path.controller}/controller`)
const Project = require(`${config.path.model}/project`)
const Section = require(`${config.path.model}/section`)

const { response } = require(`${config.path.helper}/response`)
const { transform } = require(`${config.path.helper}/transform`)

const { index } = require(`${config.path.helper}/indexAggregate`)

const itemTransform = [
  '._id',
  '.name',
  '.projectId',
  '.token'
]

module.exports = class initializeController extends controller {
  constructor() {
    super()
    this.model = { Project, Section },
    this.helper = { response, transform, itemTransform, index }
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
