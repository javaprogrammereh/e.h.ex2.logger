const InitializeController = require("./initializeController");

module.exports = new (class registerController extends InitializeController {
  async register(req, res) {
    req.checkBody("email", "وارد کردن فیلد ایمیل الزامیست").notEmpty();
    req.checkBody("password", "وارد کردن فیلد پسورد الزامیست").notEmpty();
    req.checkBody("email", "فرمت اییمل وارد شده صحیح نیست").isEmail();
    if (this.validation(req, res)) return "";
    try {
      const superAdmin = await this.model.User.findOne({
        email: req.body.email,
      }).exec();
      if (superAdmin)
        return this.abort(res, 400, "ایمل وارد شده وجود دارد", null, "email");
      const values = {
        email: req.body.email,
        password: req.body.password,
        type: "superAdmin",
      };
      await this.model.User.create(values);
      return this.ok(res);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
