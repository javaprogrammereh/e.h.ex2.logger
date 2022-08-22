const InitializeController = require('./initializeController')

module.exports = new ( class singleLogCodeController extends  InitializeController {
  async singleLogCode(req, res) {

    let query = {};
    let sort = { _id: -1 };
    //* /api/v1/logcode?s=...
    if (req.query.s !== undefined) {
      query = { ...query, $text: { $search: `/${req.query.s}/i` } };
      sort = { ...sort, score: { $meta: "textScore" } };
    }
      const aggregateData = [
        { $match: query },
        {
          $project: {
            "logDescription.__v": 0,
            "logDescription.updatedAt": 0,
            "logDescription.createdAt": 0,
          },
        },
        { $sort : sort}
      ];
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
