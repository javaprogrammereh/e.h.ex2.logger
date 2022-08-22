const InitializeController = require('./initializeController')
const mongoose = require('mongoose')

module.exports = new ( class singleController extends  InitializeController {
  async single(req, res) {
    req.checkParams("id", "The entered ID is incorrect").notEmpty();
    req.checkParams("id", "The entered ID is incorrect").isMongoId();
    if (this.validation(req, res)) return '';
    
    try {
      const select = "-updatedAt -__v";
      let logDescription = await this.model.LogDescription.findOne({ _id: mongoose.Types.ObjectId(req.params.id)}).exec()
      if (!logDescription) return this.abort(res, 404)
      logDescription = logDescription._doc

      const Transform = await this.helper.transform(logDescription, this.helper.itemTransform)
      return this.helper.response(res, null, 200, Transform)
    } catch (err) {
      console.log(err)
      this.abort(res, 500)
    }
  }
})()