import React, { useState, useEffect } from "react";
import { Modal, message } from "antd";
import Axios from "axios";

import SceneMakeModalTab from "./Tab/SceneMakeModalTab";
import CharacterTab from "./Tab/CharacterTab"
import BackgroundTab from "./Tab/BackgroundTab"
import BgmTab from "./Tab/BgmTab"
import SoundTab from "./Tab/SoundTab"

const SceneMakeModal = ({ gameId, visible, setTag, tag, setReload }) => {
  const [fileQueue, setFileQueue] = useState([]);
  const [typeQueue, setTypeQueue] = useState([]);

  const [charBlobList, setCharBlobList] = useState([]);
  const [backBlobList, setBackBlobList] = useState([]);
  const [bgmBlobList, setBgmBlobList] = useState([]);
  const [bgmBlobNames, setBgmBlobNames] = useState([]);
  const [soundBlobList, setSoundBlobList] = useState([]);
  const [soundBlobNames, setSoundBlobNames] = useState([]);

  const [game, setGame] = useState([]);


  const variable = { gameId: gameId }
  useEffect(() => {
    Axios.post('/api/game/getgamedetail', variable)
      .then(response => {
        if (response.data.success) {
          setGame(response.data.gameDetail);
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

      //upload file queue
      let formData = new FormData();
      fileQueue.forEach(value => {
        formData.append('files', value);
      })
      const config = {
        header: { "encrpyt": "multipart/form-data" }, //content type을 같이 보내줘야한다!
      };

      Axios.post("/api/game/uploadfile", formData, config).then(
        (response) => {
          if (response.data.success) {
            uploadDB(response.data.files);
          } else {
            alert("업로드 실패");
          }
        }
      );
    }

  };


  const uploadDB = (files) => {
    const DBForm = { gameId: gameId, character: [], background: [], bgm: [], sound: [] };
    for (var i = 0; i < files.length; i++) {
      switch (typeQueue[i]) {
        case 1:
          DBForm.character.push({
            name: files[i].originalname,
            image: `http://localhost:5000/${files[i].path}`,
          })
          break;
        case 2: //background
          DBForm.background.push({
            name: files[i].originalname,
            image: `http://localhost:5000/${files[i].path}`,
          })
          break;
        case 3:
          DBForm.bgm.push({
            name: files[i].originalname,
            music: `http://localhost:5000/${files[i].path}`,
          })
          break;
        case 4:
          DBForm.sound.push({
            name: files[i].originalname,
            music: `http://localhost:5000/${files[i].path}`,
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
        console.log("SceneMakeModal::DB 업데이트 성공")
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
      width={1000}
      style={{ top: 20 }}
    >
      <SceneMakeModalTab setTag={setTag} tag={tag} />
      {tag === 1 &&
        <CharacterTab
          game={game}
          setFileQueue={setFileQueue}
          setTypeQueue={setTypeQueue}
          setCharBlobList={setCharBlobList}
          charBlobList={charBlobList}
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
    </Modal>
  )
}
export default SceneMakeModal
