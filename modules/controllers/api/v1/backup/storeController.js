const InitializeController = require("./initializeController");
const backup = require("../../../../backup/backup");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    try {
      const result = await backup();
      if (!result || result === 0)
        return this.abort(res, 400, "تعداد لاگ ها کم است");
      if (result === false) return this.abort(res, 500);
      return this.helper.response(res, null, 200, {
        action: "backup",
        backupName: result,
      });
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
////