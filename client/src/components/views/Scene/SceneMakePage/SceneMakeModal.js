import React, { useState, useRef, useEffect } from "react";
import { Modal, message } from "antd";
import Axios from "axios";

import SceneMakeModalTab from "./Tab/SceneMakeModalTab";
import CharacterTab from "./Tab/CharacterTab"
import BackgroundTab from "./Tab/BackgroundTab"
import BgmTab from "./Tab/BgmTab"
import SoundTab from "./Tab/SoundTab"
import { LOCAL_HOST } from "../../../Config";
import _ from "lodash";
import "./SceneMakeModal.css";

const config = require('../../../../config/key');

const SceneMakeModal = ({ gameId, visible, setTag, tag, setReload }) => {
  const [game, setGame] = useState([]);
  const [fileQueue, setFileQueue] = useState([]);
  const [typeQueue, setTypeQueue] = useState([]);

  const [backBlobList, setBackBlobList] = useState([]);
  const [bgmBlobList, setBgmBlobList] = useState([]);
  const [bgmBlobNames, setBgmBlobNames] = useState([]);
  const [soundBlobList, setSoundBlobList] = useState([]);
  const [soundBlobNames, setSoundBlobNames] = useState([]);

  const [blobGame, setBlobGame] = useState([]);
  const charPageNum = useRef(0);
  const [charFileQueue, setCharFileQueue] = useState([]);
  const [charBlobList, setCharBlobList] = useState([]);


  const variable = { gameId: gameId }
  useEffect(() => {
    Axios.post('/api/game/getgamedetail', variable)
      .then(response => {
        if (response.data.success) {
          setGame(response.data.gameDetail);
          setBlobGame(_.cloneDeep(response.data.gameDetail));
        } else {
          alert('게임 정보를 로딩하는데 실패했습니다.')
        }
      })
  }, [])

  const revokeBlobList = () => {
    charBlobList.forEach(function (value) {
      if (value)
        URL.revokeObjectURL(value)
    });
    backBlobList.forEach(function (value) {
      if (value)
        URL.revokeObjectURL(value)
    });
    bgmBlobList.forEach(function (value) {
      if (value)
        URL.revokeObjectURL(value)
    });
    soundBlobList.forEach(function (value) {
      if (value)
        URL.revokeObjectURL(value)
    });
  }


  const cancelUpload = () => {
    revokeBlobList();
    setTag(0)
  }

  let uploadFlag = false;
  const upload = () => {
    if (!uploadFlag) {
      uploadFlag = true;
      revokeBlobList();

      uploadCharFiles()
      if (fileQueue.length)
        uploadFiles()
    }
  };

  const uploadCharFiles = () => {
    if (charFileQueue.length) {
      let fileNum = Array.from({ length: blobGame.character.length }, () => 0);
      let formData = new FormData();
      for (var i = 0; i < blobGame.character.length; i++) {
        //파일 합치기        
        for (var j = 0; j < charFileQueue.length; j++) {
          if (charFileQueue[j].index === i) {
            fileNum[i] += charFileQueue[j].array.length
            charFileQueue[j].array.forEach(function (value) {
              formData.append('files', value);
            });
          }
        }
      }
      const config = {
        header: { "encrpyt": "multipart/form-data" },
      };


      Axios.post("/api/game/uploadfile", formData, config).then(
        (response) => {
          if (response.data.success) {
            uploadCharDB(fileNum, response.data.files);
          } else {
            alert("캐릭터 DB 업로드 실패");
          }
        }
      );
    } else {
      uploadCharDB(null, null);
    }
  }

  const uploadCharDB = (fileNum, files) => {
    let cnt = 0
    for (var i = 0; i < blobGame.character.length; i++) {
      if (!game.character[i])
        game.character.push({
          name: "",
          description: "",
          image_array: [],
        })
      game.character[i].name = blobGame.character[i].name;
      game.character[i].description = blobGame.character[i].description;

      if (fileNum) {
        for (var j = cnt; j < cnt + fileNum[i]; j++) {
          game.character[i].image_array.push(process.env.NODE_ENV === 'development' ? `${config.SERVER}/${files[j].path}` : files[j].location)
        }
        cnt += fileNum[i]
      }
    }
    const DBForm = {
      gameId: gameId,
      character: game.character
    };
    Axios.post(
      "/api/game/putCharDB",
      DBForm
    ).then((response) => {
      if (response.data.success) {
        // character파일만 올리는 경우
        if (!fileQueue.length) {
          setReload(reload => reload + 1)
          setTag(0)
        }
      } else {
        message.error("DB 업데이트 실패");
      }
    });
  }


  const uploadFiles = () => {
    //upload file queue
    let formData = new FormData();
    fileQueue.forEach(value => {
      formData.append('files', value);
    })
    const header = {
      header: { "encrpyt": "multipart/form-data" }, //content type을 같이 보내줘야한다!
    };

    Axios.post("/api/game/uploadfile", formData, header).then(
      (response) => {
        if (response.data.success) {
          uploadDB(response.data.files);
        } else {
          alert("업로드 실패");
        }
      }
    );
  }


  const uploadDB = (files) => {
    const DBForm = { gameId: gameId, background: [], bgm: [], sound: [] };
    for (var i = 0; i < files.length; i++) {
      switch (typeQueue[i]) {
        case 1: //background
          DBForm.background.push({
            name: files[i].originalname,
            image: (process.env.NODE_ENV === 'development' ? `${config.SERVER}/${files[i].path}` : files[i].location),
          })
          break;
        case 2:
          DBForm.bgm.push({
            name: files[i].originalname,
            music: (process.env.NODE_ENV === 'development' ? `${config.SERVER}/${files[i].path}` : files[i].location),
          })
          break;
        case 3:
          DBForm.sound.push({
            name: files[i].originalname,
            music: (process.env.NODE_ENV === 'development' ? `${config.SERVER}/${files[i].path}` : files[i].location),
          })
          break;
        default:
          message.error("정의되지 않은 업로드 버튼입니다.");
          break;
      }
    }
    Axios.post(
      "/api/game/putDB",
      DBForm
    ).then((response) => {
      if (response.data.success) {
        setReload(reload => reload + 1)
        setTag(0)
      } else {
        message.error("DB 업데이트 실패");
      }
    });
  }
  return (
    <Modal className="scenemake_modal"
      visible={visible}
      okText="Upload"
      onCancel={cancelUpload}
      onOk={upload}
      width={1500}
      style={{ top: 20 }}
    >
      <div className="sceenmake_modal_container">
        <SceneMakeModalTab setTag={setTag} tag={tag} />
        {tag === 1 &&
          <CharacterTab
            blobGame={blobGame}
            setBlobGame={setBlobGame}
            charPageNum={charPageNum}
            setCharFileQueue={setCharFileQueue}
            setCharBlobList={setCharBlobList}
          />
        }
        {tag === 2 &&
          <BackgroundTab
            game={game}
            setFileQueue={setFileQueue}
            setTypeQueue={setTypeQueue}
            setBackBlobList={setBackBlobList}
            backBlobList={backBlobList}
          />
        }
        {tag === 3 &&
          <BgmTab
            game={game}
            setFileQueue={setFileQueue}
            setTypeQueue={setTypeQueue}
            setBgmBlobList={setBgmBlobList}
            bgmBlobList={bgmBlobList}
            setBgmBlobNames={setBgmBlobNames}
            bgmBlobNames={bgmBlobNames}
          />
        }
        {tag === 4 &&
          <SoundTab
            game={game}
            setFileQueue={setFileQueue}
            setTypeQueue={setTypeQueue}
            setSoundBlobList={setSoundBlobList}
            soundBlobList={soundBlobList}
            setSoundBlobNames={setSoundBlobNames}
            soundBlobNames={soundBlobNames}
          />
        }
      </div>
    </Modal>

  )
}
export default SceneMakeModal
