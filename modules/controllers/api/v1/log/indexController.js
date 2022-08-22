const InitializeController = require('./initializeController')
const mongoose = require("mongoose");

module.exports = new ( class indexController extends  InitializeController {
  async index(req, res) {
    let query = {};
    let queryLookUp = {};
    let sort = {};
    if(req.query.sectionId){
      req.checkQuery("sectionId", "The entered sectionId is incorrect").isMongoId()
      if (this.validation(req, res)) return '';
      query={...query,sectionId:mongoose.Types.ObjectId(req.query.sectionId)}
    }
    if(req.query.projectId){
      req.checkQuery("projectId", "The entered projectId is incorrect").isMongoId()
      if (this.validation(req, res)) return '';
      queryLookUp={...queryLookUp,"projectId":mongoose.Types.ObjectId(req.query.projectId)}
    }
    if (req.query.permanent) {
      req.checkQuery('permanent', 'فیلد دائمی را به صورت درست وارد کنید').isBoolean()
      if (this.validation(req, res)) return 
      query={...query, isPermanent: req.query.permanent === 'true' ? true : false}
    }

    if (req.query.s) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }
    sort={...sort,_id:-1}
    try {
        let aggregateData = [
            { $match: query },
            {
              $lookup: {
                from: "sections",
                let: { section_id: "$sectionId" },
                pipeline: [
                  {
                    $match: {
                      ...queryLookUp,
                      $expr: { $eq: ["$_id", "$$section_id"] },
                    },
                  },
                ],
                as: "section",
              },
            },
            {
              $lookup: {
                from: "projects",
                localField: "section.projectId",
                foreignField: "_id",
                as: "project",
              },
            },
            {
              $unwind: '$project',
            },
            {
              $unwind: '$section',
            },
            {
              $project: {
                "data": {$substr: ["$data", 0, 50]},
                "ip": 1,
                "logcode": 1,
                "createdAt": 1,
                "isPermanent": 1,
                "section": {
                  '_id': 1,
                  'name': 1,
                  'project': '$project'
                }
              }
            },
            {
              $project: {
                "section.updatedAt": 0,
                "section.__v": 0,
                "section.project.updatedAt": 0,
                "section.project.__v": 0,
                "section.project.sectionsId": 0
              },
            },
            { $sort : sort}
          ]
          const result = await this.helper.index(req, 'log', query, aggregateData)
          if (!result) return this.abort(res, 500)
          return this.helper.response(res, null, 200, result)
        } catch (err) {
          console.log(err)
          this.abort(res, 500);
      }
  }
})()