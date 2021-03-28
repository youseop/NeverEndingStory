const express = require("express");
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');

dotenv.config();

const config = require("./config/key");
const { logger } = require("./config/logger");


const app = express();

const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => logger.info("mongoose connected...!"))
  .catch(err => console.log(err));

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
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/game', require('./routes/game'));
app.use('/api/scene', require('./routes/scene'));
app.use('/api/complaint', require('./routes/complaint'));
app.use('/api/comment', require('./routes/comment'));
<<<<<<< HEAD
=======
app.use('/api/like', require('./routes/like'));

>>>>>>> da1eb82cf58f6a4a1b4169f5d2a827b4ffb5ba3f
app.use('/api/test', require('./routes/subdoc_route'));
app.use('/uploads', express.static('uploads'));

const port = process.env.PORT
const server = require('http').createServer(app);
server.listen(port);