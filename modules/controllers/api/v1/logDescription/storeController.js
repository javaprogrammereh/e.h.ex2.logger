const InitializeController = require("./initializeController");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("description", "فیلد متن نمیتواند خالی باشد").notEmpty();
    req.checkBody("status", "فیلد استتوس نمیتواند خالی باشد").notEmpty();
    req.checkBody("logcode", "فیلد لاگ نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";
    try {
      const select = "-updatedAt -__v -data";
      let log = await this.model.Log.findOne(
        { logcode: req.body.logcode, sectionId: req.section._id },
        select
      ).exec();
      if (!log) return this.abort(res, 404);
      const logTime = log.createdAt;
      logTime.setHours(0, 0, 0, 0);
      const now = Date.now();
      if (now - logTime.getTime() > 24 * 60 * 60 * 1000)
        return this.abort(res, 404);

      const values = {
        description: req.body.description,
        status: req.body.status,
        logcode: req.body.logcode,
      };
      await this.model.LogDescription.create(values);
      this.ok(res);
    } catch (err) {
      console.log(err);
      this.abort(res, 500);
    }
  }
})();
