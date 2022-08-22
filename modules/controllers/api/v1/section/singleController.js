const InitializeController = require("./initializeController");

module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    req.checkParams("id", "The entered ID is incorrect").isMongoId();
    if (this.validation(req, res)) return "";
    // the section founded in the middleware
    try {
      const select = "-updatedAt -__v";
      let section = await this.model.Section.findOne({ _id: req.params.id });
      if (!section) return this.abort(res, 404);
      const project = await this.model.Project.findOne(
        { _id: section.projectId },
        select
      );
      if (!project) return this.abort(res, 404);
      section = { ...section._doc, project };
      const Transform = await this.helper.transform(
        section,
        this.helper.itemTransform
      );
      return this.helper.response(res, null, 200, Transform);
    } catch (err) {
      console.log(err);
      this.abort(res, 500);
    }
  }
})();
