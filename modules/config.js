const path = require("path");

module.exports = {
  path: {
    controllers: {
      api: path.resolve("./modules/controllers/api"),
    },
    helper: path.resolve("./modules/helpers"),
    model: path.resolve("./modules/models"),
    // transform: path.resolve('./modules/transforms'),
    controller: path.resolve("./modules/controllers"),
    // socket: path.resolve('./modules/socket.io'),
    backupFiles: path.resolve("./modules/backupFiles"),
    middleware: path.resolve("./modules/routes/middleware"),
  },
};
