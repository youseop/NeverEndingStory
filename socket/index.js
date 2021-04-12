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
const { Scene } = require("./models/Scene");
const { logger } = require("./config/logger");

const app = express();

const connect = mongoose.connect(config.mongoURI,
  {
    useNewUrlParser: true, useUnifiedTopology: true,
    useCreateIndex: true, useFindAndModify: false
  })
  .then(() => logger.info(`mongoose connected...`))
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

const port = 5001
const server = require('http').createServer(app);
const io = require('socket.io')(server, { 
  cors: { origin: '*' },
  upgradeTimeout: 30000,
});

let scene_cache = {} // {empty: 2, cert: [{ userID: ??, }]}


const trimCache = (sceneTmp) => {
	  let formatCertList = [...sceneTmp.certificationList]
	  for(let i = 0 ; i < formatCertList.length; i ++){
		  	formatCertList[i] = {...formatCertList[i] , timer:null}
		    }
	  return {...sceneTmp, certificationList: formatCertList};
}
const updateCache = async (sceneId, userId, plus, exp) => {
  const idx = scene_cache[sceneId].certificationList.findIndex(item => item.userId === userId);
  if (idx < 0) {
    return;
  }

  scene_cache[sceneId].emptyNum += plus;
  io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum })
  const certTokenList = scene_cache[sceneId].certificationList;
  if (plus > 0) {
    clearTimeout(certTokenList[idx].timer);
    if (idx > -1) certTokenList.splice(idx, 1)
  }

  else if (plus === 0) {
    clearTimeout(certTokenList[idx].timer);

    certTokenList[idx].exp = exp;
    certTokenList[idx].isMakingScene = true;
    certTokenList[idx].timer = setTimeout(() => {

      if (scene_cache[sceneId].certificationList.some(item => item.userId === userId)) {
        scene_cache[sceneId].emptyNum += 1;
        io.sockets.to(userId.toString()).emit("timeout_making", { msg: "hi~" });
        io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum });
        if (idx > -1) {
          scene_cache[sceneId].certificationList.splice(idx, 1)
          Scene.deleteOne({
            prevSceneId: mongoose.Types.ObjectId(sceneId),
            writer: mongoose.Types.ObjectId(userId)
          }).exec().then((err) => { console.log(err) });
          logger.info("After 1hour delete ",sceneId, userId)
        }
      }
      return;
    }, exp - Date.now())

    scene_cache[sceneId].certificationList = certTokenList;
  }

  else {
    scene_cache[sceneId].certificationList[idx].timer = setTimeout(() => {
      if (scene_cache[sceneId].certificationList.some(item => item.userId === userId)) {
        scene_cache[sceneId].emptyNum += 1;

        io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: scene_cache[sceneId].emptyNum });
        if (idx > -1) scene_cache[sceneId].certificationList.splice(idx, 1)
      }
    }, 300000)
  }
  const formatCache = trimCache(scene_cache[sceneId])
  Scene.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(sceneId) },
    {
      "$set": {
        "sceneTmp": formatCache,
      }
    }
  ).exec();
}



io.on('connection', socket => {

  socket.on('disconnect', reason => {
    // console.log('user disconnected');
  });

  socket.on('room', data => {
    // console.log('room join', data.room);
    socket.join(data.room);
  });

  socket.on('leave room', data => {
    // console.log('leaving room', data.room);
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
      // console.log(scene_cache[sceneId].emptyNum)
      return;
    }

    // 이미 cert에 user가 있는 경우, 예외처리.
    let user_token = {
      userId,
      exp: Date.now() + 300000,
      timer: null,
      isMakingScene: false,
    }
    scene_cache[sceneId].certificationList.push(user_token);
    updateCache(sceneId, userId, -1, 0)
  });

  socket.on('empty_num_increase', async data => {
    const sceneId = data.scene_id;
    const userId = data.user_id;
    if (scene_cache[sceneId] === undefined) {
      const sceneTmp = await Scene.findOne({ _id: mongoose.Types.ObjectId(sceneId) }).select("sceneTmp");
      if(sceneTmp){
        scene_cache[sceneId] = sceneTmp.sceneTmp;
      }
      else{
        return;
      }
      // cert 리스트의 모든 녀석을 확인하여 exp가 넘은 친구는 제거
    }

    if (scene_cache[sceneId].emptyNum === 4) {
      io.sockets.to(sceneId).emit('empty_num_changed', { emptyNum: 4 });
      return;
    }
    updateCache(sceneId, userId, 1, 0)
  });

  // 기존에 플레이 되던 씬 삭제시 emptynum += 1
  socket.on('scene_deleted', async data => {
    const prevSceneId = data.prevScene_id;
    if (scene_cache[prevSceneId] === undefined) {
      const prevSceneData = await Scene.findOne({ _id: mongoose.Types.ObjectId(prevSceneId) }).select("sceneTmp");
      scene_cache[prevSceneId] = prevSceneData.sceneTmp;
    }
    
    scene_cache[prevSceneId].emptyNum += 1;
    io.sockets.to(prevSceneId).emit('empty_num_changed', 
      { emptyNum: scene_cache[prevSceneId].emptyNum }
    )
    Scene.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(prevSceneId) },
      {
        "$set": {
          "sceneTmp": scene_cache[prevSceneId],
        }
      }
    ).exec();
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

    try {
      // 캐시가 없으면?, DB에서 캐시 갖고온다.
      const sceneSelector = await Scene.findOne({ _id: mongoose.Types.ObjectId(scene_id) }).select("nextList sceneTmp");
      const sceneTmp = sceneSelector.sceneTmp;
  
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
          if (certToken.isMakingScene) {
            io.sockets.to(certToken.userId.toString()).emit("timeout_making", { sceneId: scene_id });
  
            Scene.deleteOne({
              prevSceneId: mongoose.Types.ObjectId(scene_id),
              writer: mongoose.Types.ObjectId(certToken.userId)
            }).exec().then((err) => { console.log(err) });
            logger.info("Restart - setting after 1hour:",scene_id,certToken.userId)
          }
          sceneTmp.emptyNum += 1;
          io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: sceneTmp.emptyNum });
        } else {
          newCertList.push(certToken);
  
          setTimeout(() => {
            const idx = scene_cache[scene_id].certificationList.findIndex(item => item.userId === certToken.userId);
            if (idx > -1) {
              if (scene_cache[scene_id].certificationList[idx].isMakingScene) {
                io.sockets.to(certToken.userId.toString()).emit("timeout_making", { sceneId: scene_id });
  
                Scene.deleteOne({
                  prevSceneId: mongoose.Types.ObjectId(scene_id),
                  writer: mongoose.Types.ObjectId(certToken.userId)
                }).exec().then((err) => { console.log(err) });
  
              }
  
              scene_cache[scene_id].emptyNum += 1;
              io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: scene_cache[scene_id].emptyNum });
              scene_cache[scene_id].certificationList.splice(idx, 1)
            }
          }, timeDiff)
        }
      }
  
      io.sockets.to(scene_id).emit('empty_num_changed', { emptyNum: sceneTmp.emptyNum });
      scene_cache[scene_id] = {
        emptyNum: sceneTmp.emptyNum,
        certificationList: [...newCertList],
      };
      Scene.updateOne({ _id: scene_id }, { $set: { "sceneTmp": { ...scene_cache[scene_id] } } }).exec();
      io.sockets.to(scene_id).emit("validated", { sceneId: scene_id, emptyNum: scene_cache[scene_id].emptyNum });
    } catch {
      return;
    }
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
    if (idx > -1) {
      clearTimeout(scene_cache[prevSceneId].certificationList[idx].timer);
      // scene_cache[prevSceneId].certificationList[idx].timer = null;
      scene_cache[prevSceneId].certificationList.splice(idx, 1)
    }
    const formatCache = trimCache(scene_cache[prevSceneId])
    Scene.updateOne({
      _id: mongoose.Types.ObjectId(prevSceneId)
    },
      {
        $set: {
          'sceneTmp': formatCache
        }
      }).exec();

    io.sockets.to(prevSceneId).emit("accept_final_change", { sceneId, title });
  })
});

server.listen(port, (err)=>{ console.log(err,  `port ${port}: connected..`)});
