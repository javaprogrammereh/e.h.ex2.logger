const InitializeController = require("./initializeController");
const mongoose = require("mongoose");

module.exports = new (class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = { _id: -1 };
    //*/api/v1/projects?s=name
    if (req.query.s !== undefined) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }
    //*/api/v1/projects?projectId=630339097914d016202d767d
    if (req.query.projectId) {
      req.checkQuery("projectId", "projectId صحیح را وارد کنید").isMongoId();
      if (this.validation(req, res)) return;
      query = { ...query, _id: mongoose.Types.ObjectId(req.query.projectId) };
    }
    //else get all
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
      { $sort: sort },
    ];
    try {
      const result = await this.helper.index(
        req,
        "project",
        query,
        aggregateData
      );
      if (!result) return this.abort(res, 500);
      const Transform = await this.helper.transform(
        result,
        this.helper.itemTransform,
        true
      );
      return this.helper.response(res, null, 200, result);
    } catch (err) {
      console.log(err);
      this.abort(res, 500);
    }
  }
})();
