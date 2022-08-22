const InitializeController = require("./initializeController");
// const short = require('short-uuid')
const { v4: uuidv4 } = require("uuid");

module.exports = new (class storeController extends InitializeController {
  async store(req, res) {
    if (req.body.sync == true) {
      req.checkBody("data", "فیلد دیتا نمیتواند خالی بماند").notEmpty();
      req.checkBody("ip", "ای پی ضروری است").notEmpty();
      if (this.validation(req, res)) return "";

      try {
        req.checkBody("data", "فیلد دیتا نمیتواند خالی بماند").notEmpty();
        req.checkBody("ip", "ای پی ضروری است").notEmpty();
        if (this.validation(req, res)) return "";
        let values = {};
        if (req.body.permanent) {
          req.checkBody("permanent", "فیلد دائمی را به صورت درست وارد کنید")
            .isBoolean();
          if (this.validation(req, res)) return;
          values = {
            ...values,
            isPermanent: req.body.permanent === "true" ? true : false,
          };
        }
        const data = req.body.data;
        const section = req.section;
        let logcode = this.helper.makeLogcode(6);
        while (await this.model.Log.findOne({ logcode: logcode }).exec())
          logcode = this.helper.makeLogcode(6);
        let ip = req.body.ip;
        if (req.body.ip == "0.0.0.0" || req.body.ip == "0.0.0.0") {
          ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        }

        values = { ...values, data, logcode, ip, sectionId: section._id };
        await this.model.Log.create(values);
        const Transform = await this.helper.transform(
          { logcode },
          this.helper.itemTransform
        );
        return this.helper.response(res, null, 200, Transform);
      } catch (err) {
        console.log(err);
        this.abort(res, 500);
      }
    } else {
      try {
        req.checkBody("data", "فیلد دیتا نمیتواند خالی بماند").notEmpty();
        req.checkBody("ip", "ای پی ضروری است").notEmpty();
        if (this.validation(req, res)) return "";
        let values = {};
        if (req.body.permanent) {
          req
            .checkBody("permanent", "فیلد دائمی را به صورت درست وارد کنید")
            .isBoolean();
          if (this.validation(req, res)) return;
          values = {
            ...values,
            isPermanent: req.body.permanent === "true" ? true : false,
          };
        }

        const data = req.body.data;
        const section = req.section;
        let logcode = this.helper.makeLogcode(6);
        while (await this.model.Log.findOne({ logcode: logcode }).exec())
          logcode = this.helper.makeLogcode(6);
        let ip = req.body.ip;
        if (req.body.ip == "0.0.0.0" || req.body.ip == "0.0.0.0") {
          ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        }
        values = { ...values, data, logcode, ip, sectionId: section._id };
        await this.model.Log.create(values);
        const Transform = await this.helper.transform(
          { logcode },
          this.helper.itemTransform
        );
        return this.helper.response(res, null, 200, Transform);
      } catch (err) {
        console.log(err);
        this.abort(res, 500);
      }
    }
  }
})();
