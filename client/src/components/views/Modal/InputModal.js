import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { Button, message } from "antd";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";
import { socket } from "../../App";
import axios from "axios";
import { gamePause } from "../../../_actions/gamePlay_actions";
import { SecurityScanTwoTone } from "@ant-design/icons";

const InputModal = ({ scene_id, scene_depth, game_id, scene_next_list, theme }) => {
  const dispatch = useDispatch()
  let history = useHistory();
  const user = useSelector((state) => state.user);
  const emptyNum = useSelector((state) => state.sync.emptyNum);
  const [visible, setVisible] = useState(false);
  const [sceneTitle, setSceneTitle] = useState("");
  const [remainTime, setRemainTime] = useState(0);
  // const [decreaseTimer, setDecreaseTimer] = useState(null);
  const [validated, setValidated] = useState(1)

  const decreaseTimer = useRef(undefined)
  const createFlag = useRef(false)

  const tick = 30;


  // const user_id = user.userData.isAuth ? user.userData._id.toString() : "";
  const handleCreate = async () => {
    clearTimeout(decreaseTimer.current);
    if (createFlag.current || !visible) {
      return;
    }

    createFlag.current = true;
    const data = {
      gameId: game_id,
      prevSceneId: scene_id,
      isFirst: 0,
      sceneDepth: scene_depth + 1,
      title: sceneTitle,
    };
    const res = await axios.post("/api/scene/create", data);
    //! socket 보내서 서버에서 scene Cache x exp 업데이트

    socket.emit("created_choice", { sceneId: scene_id, userId: user.userData._id, exp: res.data.exp })
    // tmp scene create

    setVisible(false);

    //! 껍데기 넣을 때, 서버에서 exp 같이 넣기 (별개로 or 같이 해도됨 시간 동기화가 되는 좋은 방법이 있다면)
    history.replace({
      pathname: `/scene/make`,
      state: {
        gameId: game_id,
        sceneId: res.data.sceneId
      }
    });

  };

  let decTimer;

  const onClickHandler = () => {
    if (user.userData.isAuth) {
      dispatch(gamePause(true));
      clearTimeout(decreaseTimer.current);
      let tick = 300;

      setRemainTime(tick);
      decTimer = setInterval(() => {
        tick--;

        if (tick === 0) {
          clearInterval(decTimer);
          cancelHandler();
          return;
        }

        setRemainTime(tick);
      }, 970);
      decreaseTimer.current = decTimer

      socket.emit("empty_num_decrease", { scene_id, user_id: user.userData._id});

      setVisible(true);
    }
    else {
      message.error("로그인이 필요합니다.")
    }
  }

  const cancelHandler = () => {
    socket.emit("empty_num_increase", { scene_id, user_id : user.userData._id });
    clearTimeout(decreaseTimer.current);

    setVisible(false);
    dispatch(gamePause(false));
  }

  const createHandler = () => {
    if (!sceneTitle.length){
      message.error("내용을 입력해주세요")
      return
    }

    return handleCreate();
  }

  const [dino, setDino] = useState(0);

  useEffect(() => {
    // socket.off("validated");
    // socket.on("validated", (data) => {
    //   console.log("SET VALIDATED", scene_id)
    //   // setValidated(validated * -1)
    // })

    socket.on("decrease_failed", () => {

      setVisible(false);
      setDino(0);
      setDino(1);
    })

    socket.emit("validate_empty_num", { scene_id })

    return () => {
      socket.off("decrease_failed");
    }

  }, [scene_id])

  useEffect(() => {
    if (dino) {
      clearTimeout(decreaseTimer.current);
    }
  }, [dino]);

  return (
    <>
      {
        (scene_next_list?.length < 4) &&
        <>
          <div
            className={`text_line_choice ${theme}`}
            onClick={emptyNum > 0 ? onClickHandler : null}
          >
            이야기를 이어봐! (남은 빈 선택지 {emptyNum}개)
            </div>
        </>
      }
      <ModalForm
        visible={visible}
        onCancel={cancelHandler}
        onCreate={createHandler}
        remainTime={remainTime}
        setSceneTitle={setSceneTitle}
      />
    </>
  );
};

export default memo(InputModal);
