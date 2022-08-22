const InitializeController = require('./initializeController')
const mongoose = require('mongoose')

module.exports = new ( class indexController extends  InitializeController {
  async index(req, res) {
    let query = {};
    let sectionQueryLookup = {};
    let projectQueryLookup = {}
    let sort = {_id: -1};

    if(req.query.sectionId){
      req.checkQuery("sectionId", "The entered sectionId is incorrect").isMongoId()
      if (this.validation(req, res)) return '';
      sectionQueryLookup={...sectionQueryLookup,"log.sectionId" :mongoose.Types.ObjectId(req.query.sectionId)}
    }
    if(req.query.projectId){
      req.checkQuery("projectId", "The entered projectId is incorrect").isMongoId()
      if (this.validation(req, res)) return '';
      projectQueryLookup={...projectQueryLookup,"log.section.projectId":mongoose.Types.ObjectId(req.query.projectId)}
    }
    if (req.query.s !== undefined) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }


    const aggregateData = [
        { $match: query },
        {
          $lookup: {
            from: 'logs',
            localField: 'logcode',
            foreignField: 'logcode',
            as: 'log'
          }
        },
        {
          $match: sectionQueryLookup
        },
        {
          $unwind: "$log"
        },
        {
          $lookup: {
            from: "sections",
            localField: "log.sectionId",
            foreignField: "_id",
            as: "log.section",
          },
        },
        {
          $unwind: "$log.section"
        },
        {
          $match: projectQueryLookup
        },
        {
          $lookup: {
            from: "projects",
            localField: "log.section.projectId",
            foreignField: "_id",
            as: "log.section.project",
          },
        },
        {
          $unwind: "$log.section.project"
        },
        {
          $project: {
            "description": 1,
            "status": 1,
            "log": {
              "data": {$substr: ["$log.data", 0, 50]},
              "ip": 1,
              "createdAt": 1,
              "section": {
                "_id": 1,
                "name": 1,
                "createdAt": 1,
                "project": {
                  "_id": 1,
                  "name": 1,
                  "createdAt": 1,
                }
              }
            }
          }
        },
        { $sort: sort }
    ]
    try {
      const result = await this.helper.index(req, 'logDescription', query, aggregateData)    
      if (!result) return this.abort(res, 500)
      return this.helper.response(res, null, 200, result)
    } catch (err) {
      console.log(err)
      this.abort(res, 500)
    }
  }
})()