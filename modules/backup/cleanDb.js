const config = require("../config");
const Log = require(`${config.path.model}/log`);
const LogDescription = require(`${config.path.model}/logDescription`);
async function cleanDb(logs) {
  if (!logs.length) return;
  try {
    const logsId = logs.map((log) => log._id);
    const logsCode = logs.map((log) => log.logcode);
    // actually we can just delet all the logDescriptions because every
    // logDescription created after the log, so there is no need to pass the ids
    await LogDescription.deleteMany({ logcode: { $in: logsCode } });
    await Log.deleteMany({ _id: { $in: logsId } });
  } catch (err) {
    console.log(err);
  }
}

module.exports = cleanDb;
//