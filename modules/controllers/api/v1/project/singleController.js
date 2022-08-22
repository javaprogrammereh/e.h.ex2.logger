const InitializeController = require("./initializeController");
const mongoose = require("mongoose");
module.exports = new (class singleController extends InitializeController {
  async single(req, res) {
    try {
      req.checkParams("id", "ای دی وارد شده صحیح نیست").isMongoId();
      if (this.validation(req, res)) return "";
      let query = { _id: mongoose.Types.ObjectId(req.params.id) };
      const aggregateData = [
        { $match: query },
        {
          $lookup: {
            from: "sections",
            let: { project_id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$projectId", "$$project_id"] },
                },
              },
            ],
            as: "sections",
          },
        },
        {
          $project: {
            "sections.projectId": 0,
            "sections.updatedAt": 0,
            "sections.__v": 0,
          },
        },
      ];
      const aggregate = await this.model.Project.aggregate(aggregateData);
      let result = aggregate[0];
      if (!result) return this.abort(res, 404, "ایدی وارد شده اشتباه است");
      const Transform = await this.helper.transform(
        result,
        this.helper.itemTransform
      );
      return this.helper.response(res, null, 200, Transform);
    } catch (err) {
      console.log(err);
      return this.abort(res, 500);
    }
  }
})();
