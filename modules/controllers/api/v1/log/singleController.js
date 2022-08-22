const section = require('../../../../models/section');
const InitializeController = require('./initializeController')
const { ObjectId } = require('mongoose').Types

module.exports = new ( class singleController extends  InitializeController {
  async single(req, res) {
    req.checkParams("logcode", "The entered logCode is incorrect").notEmpty();
    if (this.validation(req, res)) return '';

    try {
      const aggregateData = [
        { $match : {logcode: req.params.logcode}},
        {
          $lookup: {
            from: 'logdescriptions',
            let : {'log_code': '$logcode'},
            pipeline: [
              { $match: {$expr: {$eq: ['$$log_code', '$logcode'] } } },
              { $project: {
                'description': 1,
                'status': 1,
                'createdAt': 1
              }}
            ],
            as: 'logDescription'
          }
        },
        {
          $lookup: {
            from: 'sections',
            localField: 'sectionId',
            foreignField: '_id',
            as: 'section'
          }
        },
        {
          $unwind: '$section'
        },
        {
          $lookup: {
            from: 'projects',
            localField: 'section.projectId',
            foreignField: '_id',
            as: 'section.project'
          }
        },
        {
          $unwind: '$section.project'
        },
        {
          $project: {
            'data': 1,
            'ip': 1,
            'logcode': 1,
            'logDescription': 1,
            'section': {
              '_id': 1,
              'name': 1,
              'createdAt': 1,
              'project': {
                '_id': 1,
                'name': 1,
                'createdAt': 1
              }
            }
          }
        }
      ]
      let log = await this.model.Log.aggregate(aggregateData).exec()
      if (!log || !log.length) return this.abort(res, 404)

      const Transform = await this.helper.transform(log[0], this.helper.itemTransform)
      return this.helper.response(res, null, 200, Transform)
    } catch (err) {
      console.log(err)
      this.abort(res, 500)
    }
  }
})()