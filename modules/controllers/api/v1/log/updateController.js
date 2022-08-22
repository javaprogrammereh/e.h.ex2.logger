const InitializeController = require('./initializeController')

module.exports = new ( class updateController extends InitializeController{
  async update(req, res) {
    try {
      req.checkBody('logcode', 'کد لاگ را وارد کنید').notEmpty()
      if (this.validation(req, res)) return 
      let values = {}
      if (req.body.permanent) {
        req.checkBody("permanent",'فیلد دائمی را به صورت درست وارد کنید').isBoolean()
        if (this.validation(req, res)) return '';
        values = {...values, isPermanent: req.body.permanent === 'true' ? true : false}
      }
      const updateResult = await this.model.Log.updateOne({logcode: req.body.logcode}, values)
      if (!updateResult.n) return this.abort(res, 404)
      return this.helper.response(res, null, 200, {action: 'logUpdated'})
    } catch (err) {
      console.log(err)
      return this.abort(res, 500)
    }
  } 
})()