const express = require("express");
const app = express();
const path = require("path");
const cors = require('cors')

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const config = require("./config/key");

const mongoose = require("mongoose");
const { Scene } = require("./models/Scene");
const { User } = require("./models/User");
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
app.use('/api/complaint', require('./routes/complaint'));
app.use('/api/comment', require('./routes/comment'));

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


let scene_cache = {} // {empty: 2, cert: [{ userID: ??, }]}


const updateCache = async (sceneId, userId, plus, exp) => {
  console.log("plus", plus);
  scene_cache[sceneId].emptyNum += plus;

  io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum })
  const idx = scene_cache[sceneId].certificationList.findIndex(item => item.userId === userId);
  const certTokenList = scene_cache[sceneId].certificationList;
  if (plus > 0) {
    console.log("wokring idx:", idx);
    clearTimeout(certTokenList[idx].timer);
    if (idx > -1) certTokenList.splice(idx, 1)
  }

  else if (plus === 0) {
    clearTimeout(certTokenList[idx].timer);

    certTokenList[idx].exp = exp;
    certTokenList[idx].isMakingScene = true;
    certTokenList[idx].timer = setTimeout(() => {
      console.log("모든 문제의 시작점...")
      if (scene_cache[sceneId].certificationList.some(itme => itme.userId === userId)) {
        scene_cache[sceneId].emptyNum += 1;
        io.sockets.to(userId).emit("timeout_making", { msg: "hi~" });

        io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum });
        if (idx > -1) scene_cache[sceneId].certificationList.splice(idx, 1)
      }
      return;
    }, exp - Date.now())

    scene_cache[sceneId].certificationList = certTokenList;
  }

  else {
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

  Scene.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(sceneId) },
    {
      "$set": {
        "sceneTmp": scene_cache[sceneId],
      }
    }
  ).exec();
}


io.on('connection', socket => {
  console.log('a user connected');

  socket.on('disconnect', reason => {
    console.log(reason);
    console.log('user disconnected');
  });

  socket.on('room', data => {
    console.log('room join', data.room);
    socket.join(data.room);
  });

  socket.on('leave room', data => {
    console.log('leaving room', data.room);
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
      socket.emit('decrease_failed');
      
      socket.emit('empty_num_changed', { emptyNum: 0 });
      console.log(scene_cache[sceneId].emptyNum)
      console.log("이게 맞음......................")
      return;
    }

    // 이미 cert에 user가 있는 경우, 예외처리.
    user_token = {
      userId,
      exp: Date.now() + 30000,
      timer: null,
      isMakingScene: false,
    }
    scene_cache[sceneId].certificationList.push(user_token);
    console.log("concorrency problem")
    updateCache(sceneId, userId, -1, 0)
  });

  socket.on('empty_num_increase', async data => {
    console.log("increasing~~~")
    const sceneId = data.scene_id;
    const userId = data.user_id;
    if (scene_cache[sceneId] === undefined) {
      const sceneTmp = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId) }).select("sceneTmp");
      scene_cache[sceneId] = sceneTmp.sceneTmp;
      // cert 리스트의 모든 녀석을 확인하여 exp가 넘은 친구는 제거
    }

    if (scene_cache[sceneId].emptyNum === 4) {
      io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: 4 });
      return;
    }
    updateCache(sceneId, userId, 1, 0)
  });

  socket.on('validate_empty_num', async data => {
    const { scene_id } = data;
    if (scene_cache[scene_id]) {
      
      //! validate 되는 녀석만 하면 된다.
      //! 동시에 validate 되는 녀석이면? 동시적용이 안되긴 함
      // socket.emit('empty_num_changed', { emptyNum: scene_cache[scene_id].emptyNum });
      io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: scene_cache[scene_id].emptyNum });
      io.sockets.to(scene_id).emit("validated", { sceneId: scene_id, emptyNum: scene_cache[scene_id].emptyNum });
      return
    };

    // 캐시가 없으면?, DB에서 캐시 갖고온다.
    const sceneSelector = await Scene.findOne({ _id: mongoose.Types.ObjectId(scene_id) }).select("nextList sceneTmp");
    const sceneTmp = sceneSelector.sceneTmp;
    const nextList = sceneSelector.nextList;

    // exp 안된 녀석만 push 해서 newCertList.
    let newCertList = [];
    // cerList에 들어있는 녀석 체크한다. (why? 서버 꺼졌으니까 재 검정)
    let limit = Array.isArray(sceneTmp.certificationList) ? sceneTmp.certificationList.length : 0;
    for (let i = 0; i < limit; i++) {

      // 리스트 각 원소 = certToken
      const certToken = sceneTmp.certificationList[i];

      const timeDiff = certToken.exp - Date.now();

      // 혹시 몰라서 1초 버퍼 둠..(1초 안에 뭐가 안끝나서 꼬일 것 같았음)
      if (timeDiff < 0) {
        console.log(certToken)
        console.log("exp over !! - emptyNum PLUS ")
        sceneTmp.emptyNum += 1;
      } else {
        newCertList.push(certToken);

        setTimeout(() => {
          console.log("TIME OUT...")
          // 믿음이 강력한 코드 --- 에러 발생 가능함
          const idx = scene_cache[scene_id].certificationList.findIndex(item => item.userId === certToken.userId);
          if (idx > -1) {
            console.log("원상복구...")
            if (scene_cache[scene_id].certificationList[idx].isMakingScene) {
              io.sockets.to(certToken.userId).emit("timeout_making", { msg: "hi~" });
            }
            console.log("TIME OUT !! - emptyNum PLUS ")

            scene_cache[scene_id].emptyNum += 1;

            io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: scene_cache[scene_id].emptyNum });
            scene_cache[scene_id].certificationList.splice(idx, 1)
          }
        }, timeDiff)
      }
    }
    
    console.log("empty_num_changed , emptyNum : ", sceneTmp.emptyNum)  // 클라 dispatch 시점
    io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: sceneTmp.emptyNum });
    scene_cache[scene_id] = {
      emptyNum: sceneTmp.emptyNum,
      certificationList: [...newCertList],
    };
    console.log("??:", scene_cache[scene_id]);
    Scene.updateOne({ _id: scene_id }, { $set: { "sceneTmp": { ...scene_cache[scene_id] } } }).exec();
    io.sockets.to(scene_id).emit("validated", { sceneId: scene_id, emptyNum: scene_cache[scene_id].emptyNum });
  });

  socket.on('created_choice', async (data) => {
    const { sceneId, userId, exp } = data;
    if (scene_cache[sceneId] === undefined) {
      const sceneTmp = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId) }).select("sceneTmp");
      scene_cache[sceneId] = sceneTmp.sceneTmp;
      // cert 리스트의 모든 녀석을 확인하여 exp가 넘은 친구는 제거
    }

    updateCache(sceneId, userId, 0, exp)
  })

  socket.on('final_submit', async data => {
    const { prevSceneId, sceneId, title, userId } = data;

    if (scene_cache[prevSceneId] === undefined) {
      const sceneSelector = await Scene.findOne({ _id: mongoose.Types.ObjectId(prevSceneId) }).select("sceneTmp");
      scene_cache[prevSceneId] = sceneSelector.sceneTmp;
    }


    const idx = scene_cache[prevSceneId].certificationList.findIndex(item => item.userId === userId);
    console.log("idx:", idx)
    if (idx > -1) {
      clearTimeout(scene_cache[prevSceneId].certificationList[idx].timer);
      scene_cache[prevSceneId].certificationList.splice(idx, 1)
    }


    Scene.updateOne({
      _id: mongoose.Types.ObjectId(prevSceneId)
    },
      {
        $set: {
          'sceneTmp': scene_cache[prevSceneId]
        }
      }).exec();

    io.sockets.to(prevSceneId).emit("accept_final_change", { sceneId, title });
  })
});

server.listen(port);