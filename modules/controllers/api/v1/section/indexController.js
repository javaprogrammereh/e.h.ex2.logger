const InitializeController = require('./initializeController')
const mongoose = require('mongoose')
module.exports = new ( class indexController extends InitializeController {
  async index(req, res) {
    let query = {};
    let sort = {'_id' : -1 };
    //* /api/v1/sections?s=..
    if (req.query.s !== undefined) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } }
      sort = { ...sort, score: { $meta: 'textScore' } }
    }
    //* /api/v1/sections?projectId=6303395cda8e4f0fbccb382e
    if (req.query.projectId) {
      req.checkQuery('projectId', 'projectId صحیح را وارد کنید').isMongoId()
      if (this.validation(req, res)) return 
      query = {...query, projectId: mongoose.Types.ObjectId(req.query.projectId)}
    }
    //* /api/v1/sections?sectionId=6303395cda8e4f0fbccb382e
    if (req.query.sectionId) {
      req.checkQuery('sectionId', 'sectionId صحیح را وارد کنید').isMongoId()
      if (this.validation(req, res)) return 
      query = {...query, _id: mongoose.Types.ObjectId(req.query.sectionId)}
    }
    //else select all
    const aggregateData = [
      { $match: query },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $project: {
          "name": 1,
          "project": {"$arrayElemAt": ["$project", 0]},
        }
      },
      {
        $project: {
          "project.updatedAt": 0,
          "project.__v": 0
        },
      },
      { $sort : sort}
    ]
    try {
      const result = await this.helper.index(req, 'section', query, aggregateData)
      if (!result) return this.abort(res, 500)
      const Transform = await this.helper.transform(result, this.helper.itemTransform, true)
      return this.helper.response(res, null, 200, result)
    } catch (err) {
      console.log(err)
      this.abort(res, 500)
    }
  }
  
})()