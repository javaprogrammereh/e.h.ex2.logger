const InitializeController = require("./initializeController");
module.exports = new (class logoutController extends InitializeController {
  async logout(req, res) {
    try {
      let id = null;
      if (req.query.id) {
        req.checkQuery("id", "ای دی وارد شده صحیح نیست").isMongoId();
        if (this.validation(req, res)) return "";
        id = req.query.id
      } else {
        id = req.user.tokenId
      }

      const token = await this.model.Token.findById(id).exec();
      if (!token) return this.abort(res, 404, null, "id");
      await this.model.Token.findByIdAndRemove(id).exec();
      return this.ok(res, "با موفقیت حذف شد");
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
