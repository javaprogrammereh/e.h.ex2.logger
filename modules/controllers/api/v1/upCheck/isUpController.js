const InitializeController = require("./initializeController");

module.exports = new (class isUpController extends InitializeController {
  async isUp(req, res) {
    try {
      return this.helper.response(res, null, 200, {
        isUp: true,
      });
    } catch (err) {
      console.log(err);
      return this.abort(res, 500, logcode);
    }
  }
})();
