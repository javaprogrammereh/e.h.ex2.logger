const config = require('../../../config')
const Section = require(`${config.path.model}/section`)
const { response } = require(`${config.path.helper}/response`)

function wrongTokenRespones(res) {
  return response(res, "unAuthorized", 401);
}

module.exports = async (req, res, next) => {
  try {
    const section = await Section.findOne({ token: req.headers['x-access-token'] }).exec()
    if (!section) return wrongTokenRespones(res)
    req.section = section
    next()
  } catch (err) {
    console.log(err)
    return response(res, "serverError", 500);
  }
}