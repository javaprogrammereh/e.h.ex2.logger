const InitializeController = require("./initializeController");
const tokenKey = process.env.TOKEN_KEY;
const tokenIv = process.env.TOKEN_IV;
const aesjs = require("aes-js");
const { v4: uuidv4 } = require("uuid");
module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    req.checkBody("name", "فیلد نام نمیتواند خالی بماند").notEmpty();
    req.checkBody("projectId", "فیلد ایدی پروژه نمیتواند خالی باشد").notEmpty();
    if (this.validation(req, res)) return "";
    try {
      const select = "-updatedAt -__v";
      const project = await this.model.Project.findById(
        req.body.projectId,
        select
      );
      if (!project) return this.abort(res, 404, "پروژه وارد شده صحیح نیست");
      //
      const key = JSON.parse(tokenKey);
      const iv = JSON.parse(tokenIv);
      const textBytes = aesjs.utils.utf8.toBytes(uuidv4());
      const aesOfb = new aesjs.ModeOfOperation.ofb(key, iv);
      const encryptedBytes = aesOfb.encrypt(textBytes);
      const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
      //
      const values = {
        name: req.body.name,
        projectId: req.body.projectId,
        token: encryptedHex,
      };
      await this.model.Section.create(values);
      return this.helper.response(res, null, 200, { token: encryptedHex });
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
