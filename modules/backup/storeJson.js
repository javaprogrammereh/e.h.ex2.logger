const config = require("../config");
const Log = require(`${config.path.model}/log`);
const fs = require("fs");
async function storeJson() {
  const todayMid = new Date();
  todayMid.setHours(0, 0, 0, 0);

  const aggregateData = [
    {
      $match: {
        isPermanent: false,
        createdAt: { $lte: todayMid },
      },
    },
    { $sort: { _id: -1 } },
    {
      $lookup: {
        from: "logdescriptions",
        let: { log_code: "$logcode" },
        pipeline: [{ $match: { $expr: { $eq: ["$$log_code", "$logcode"] } } }],
        as: "logDescription",
      },
    },
  ];

  try {
    const result = await Log.aggregate(aggregateData);
    if (!result.length) return [];
    const lastLogId = result[0]._id;
    const now = new Date();
    const fileName = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}$${lastLogId}`;
    const fd = await fs.promises.open(
      `${config.path.backupFiles}/${fileName}.json`,
      "w"
    );
    await fd.write(JSON.stringify(result, null, 2));
    await fd.close();
    return { fileName, logs: result };
  } catch (err) {
    console.log(err);
  }
}

module.exports = storeJson;
//