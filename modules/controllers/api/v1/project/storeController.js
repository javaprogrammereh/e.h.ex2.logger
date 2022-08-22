const InitializeController = require("./initializeController");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("name", "فیلد نام نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";

    try {
      const project = await this.model.Project.create({ name: req.body.name });
      const Transform = await this.helper.transform(
        project,
        this.helper.itemTransform
      );
      return this.helper.response(res, null, 200, Transform);
    } catch (err) {
      console.log(err);
      this.abort(res, 500);
    }
  }
})();
