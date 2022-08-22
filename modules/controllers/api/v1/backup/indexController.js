const InitializeController = require("./initializeController");
const { opendir } = require("fs/promises");
const config = require("../../../../config");
module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    try {
      const dir = await opendir(config.path.backupFiles);
      let backups = [];
      for await (const dirent of dir) {
        backups.push(dirent.name);
      }

      return this.helper.response(res, null, 200, {
        backupFiles: backups,
      });
    } catch (err) {
      console.log(err);
      this.abort(res, 500);
    }
  }
})();
