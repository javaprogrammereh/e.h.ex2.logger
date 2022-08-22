const config = require("../config");
const Log = require(`${config.path.model}/log`);
const storeJson = require("./storeJson");
const cleanDb = require("./cleanDb");

const MAX_LOG_ALLOWED = Number(process.env.MAX_LOG_ALLOWED);

async function backup() {
  console.log("starting to backup");
  const todayMid = new Date();
  todayMid.setHours(0, 0, 0, 0);
  const logsCount = await Log.countDocuments({
    createdAt: { $lte: todayMid },
  }).exec();
  if (logsCount < MAX_LOG_ALLOWED) return 0;
  try {
    const result = await storeJson();
    if (!result) return false;
    await cleanDb(result.logs);
    return result.fileName;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = backup;
//