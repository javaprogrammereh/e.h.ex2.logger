const InitializeController = require("./initializeController");
const { existsSync } = require("fs");
const { open } = require("fs/promises");
const config = require("../../../../config");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      console.log("here");
      req.checkParams("backupName", "نام فایل بکاپ را وارد کنید").notEmpty();
      if (this.validation(req, res)) return;

      const path = `${config.path.backupFiles}/${req.params.backupName}`;
      if (!existsSync(path)) return this.abort(res, 404);
      const fd = await open(path, "r");
      const stream = fd.createReadStream({ encoding: "utf-8" });
      res.setHeader("content-type", "application/json");
      stream.pipe(res);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
