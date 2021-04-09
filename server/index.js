const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require('helmet');
const hpp = require('hpp');
const mongoose = require("mongoose");
const morgan = require('morgan');
const redis = require('redis')
const session = require("express-session")
const RedisStore = require('connect-redis')(session)
dotenv.config();
 
const config = require("./config/key");
const { logger } = require("./config/logger");
const sessionOption =require("./config/session")

const {sanitize} = require("./lib/sanitize")
const app = express();
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => logger.info("mongoose connected...!"))
  .catch(err => console.log(err));


let redisClient;
if(process.env.NODE_ENV === 'production'){
  redisClient  = redis.createClient({
    url : `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password :process.env.REDIS_PASSWORD,
  })
}
  

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet({contentSecurityPolicy: false}));
  app.use(hpp());
} else {
  app.use(morgan('dev'));
}


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

if(process.env.NODE_ENV === "production"){
  sessionOption.store = new RedisStore({client : redisClient})
}
//  sessionOption.store = new RedisStore({client : redisClient})

app.use(session(sessionOption))
app.use('/api/users', require('./routes/users'));
app.use('/api/passport', require('./routes/passport'));
app.use('/api/game', require('./routes/game'));
app.use('/api/scene', require('./routes/scene'));
app.use('/api/complaint', require('./routes/complaint'));
app.use('/api/comment', require('./routes/comment'));
app.use('/api/like', require('./routes/like'));
app.use('/api/view', require('./routes/view'));
app.use('/api/thumbsup', require('./routes/thumbsup'));
app.use('/api/treedata', require('./routes/treedata')); 

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT
const server = require('http').createServer(app);
server.listen(port);