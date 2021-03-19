const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const { Scene } = require("./models/Scene");
const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

app.use(cors())

//to not get any deprecation warning or error
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//to get json data
// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/users', require('./routes/users'));
app.use('/api/game', require('./routes/game'));
app.use('/api/scene', require('./routes/scene'));

app.use('/api/test', require('./routes/subdoc_route'));


//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {

  // Set static folder   
  // All the javascript and css files will be read and served from this folder
  app.use(express.static("client/build"));

  // index.html for all page routes    html or routing and naviagtion
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000

const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });


let scene_cache = {}

const updateCache = (sceneId, userId, plus)=>{

  scene_cache[sceneId].emptyNum += plus;
  io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum })
  const idx = scene_cache[sceneId].certificationList.findIndex(item => item.userId === userId);
  if (plus >= 0)
  {
    clearTimeout(scene_cache[sceneId].certificationList[idx].timer);
    if (idx > -1) scene_cache[sceneId].certificationList.splice(idx, 1)
  }
  else{
    scene_cache[sceneId].certificationList[idx].timer = setTimeout(() => {
      console.log("30 초 지남...")
      if (scene_cache[sceneId].certificationList.some(itme => itme.userId === userId)) {
        console.log("원상복구...")
        scene_cache[sceneId].emptyNum += 1;
        io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum });
        if (idx > -1) scene_cache[sceneId].certificationList.splice(idx, 1)
      }
    }, 30000)
  }
  Scene.updateOne({ _id: mongoose.Types.ObjectId(sceneId) }, { sceneTmp: scene_cache[sceneId] });
}



io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', reason => {
    console.log(reason);
    console.log('user disconnected');
  });

  socket.on('room', data => {
    console.log('room join');
    socket.join(data.room);
  });

  socket.on('leave room', data => {
    console.log('leaving room');
    console.log(data);
    socket.leave(data.room)
  });

  socket.on('empty_num_decrease', async data => {
    const sceneId = data.scene_id;
    const userId = data.user_id;
    if (scene_cache[sceneId] === undefined) {
      const sceneTmp = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId) }).select("sceneTmp");
      scene_cache[sceneId] = sceneTmp.sceneTmp;
      // cert 리스트의 모든 녀석을 확인하여 exp가 넘은 친구는 제거
    }

    if (scene_cache[sceneId].emptyNum === 0) {
      // 예외 처리
      return;
    }

    // 이미 cert에 user가 있는 경우, 예외처리.
    user_token = {
      userId,
      exp: Date.now(),
      // type: "scene",
      timer: null,
    }
    scene_cache[sceneId].certificationList.push(user_token);

    updateCache(sceneId, userId, -1)
  });

  socket.on('empty_num_increase', async data => {
    const sceneId = data.scene_id;
    const userId = data.user_id;
    if (scene_cache[sceneId] === undefined) {
      const sceneTmp = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId) }).select("sceneTmp");
      scene_cache[sceneId] = sceneTmp.sceneTmp;
    }

    if (scene_cache[sceneId].emptyNum === 4) {
      // 예외 처리
      return;
    }
    updateCache(sceneId, userId, 1)
  });

  socket.on('created_choice', data => {
    const sceneId = data.scene_id;
    const userId = data.user_id;
    updateCache(sceneId, userId, 0)
  })
});

server.listen(port);