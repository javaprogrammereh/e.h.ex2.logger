const { createServer } = require('http')
const socketIO = require('socket.io')
const express = require('express')
const app = express()
const server = createServer(app)
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const helmet = require('helmet')
const hpp = require('hpp')
const mongoSanitize = require('express-mongo-sanitize')
require('dotenv').config()
const rateLimit = require('express-rate-limit')
const cors = require('cors')

// //Locallogger
var datetime = new Date();
var fs = require('fs');
var util = require('util');
if (!fs.existsSync('./debug')){
    fs.mkdirSync('./debug');
}
var log_file = fs.createWriteStream(__dirname + `/debug/${datetime.toISOString().slice(0,10)}.log`, {flags : 'w'});
console.log = function(d) { //
  log_file.write(`\n----------${datetime}\n`+util.format(d) + '\n----------');
};
// //Locallogger


// scheduling backup
const BACKUP_TIME = process.env.BACKUP_TIME
const cron = require('node-cron')
const backup = require('./modules/backup/backup')
cron.schedule(BACKUP_TIME, backup)
//


// Connect to DB
const MONGODB_URL = process.env.MONGODB_URL
mongoose.connect(MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
mongoose.Promise = global.Promise

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}


app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false ,limit: '100mb', parameterLimit:5000000}))
app.use(bodyParser.json({ type: 'application/json',limit: '100mb', parameterLimit:5000000 }))
app.use(expressValidator())
app.use(helmet({
  // just for test 
  // remove after test
  contentSecurityPolicy: false
}))

app.use(hpp())
app.use(mongoSanitize())
app.use('/public', express.static('public'))




const apiRouter = require('./modules/routes/api/api-v1')


app.use('/api', apiRouter)

app.get("/cron2", function(req, res) {
 backup();
  res.status(200).send('Cron!')
});

const PORT = process.env.PORT
server.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`)
})
app.use(function (err, req, res, next) {
  console.log(err)
  res.status(500).send('Server error!')
  next()
})
