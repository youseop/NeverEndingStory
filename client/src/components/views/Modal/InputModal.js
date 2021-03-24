import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { Button } from "antd";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";
import { socket } from "../../App";
import axios from "axios";
import { loadEmptyNum } from "../../../_actions/sync_actions";
import { SecurityScanTwoTone } from "@ant-design/icons";

const InputModal = ({ scene_id, scene_depth, game_id, setClickable, scene_next_list }) => {
  const dispatch = useDispatch()
  let history = useHistory();
  const user = useSelector((state) => state.user);
  const emptyNum = useSelector((state) => state.sync.emptyNum);
  const user_id = user.userData._id.toString();
  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const [remainTime, setRemainTime] = useState(0);
  const [decreaseTimer, setDecreaseTimer] = useState(null);
  const [validated, setValidated] = useState(1)

  const tick = 30;


  const handleCreate = () => {
    formRef.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      clearTimeout(decreaseTimer);

      const data = {
        gameId: game_id,
        prevSceneId: scene_id,
        isFirst: 0,
        sceneDepth: scene_depth + 1,
        title: values.title,
      };
      const res = await axios.post("/api/scene/create", data);
      //! socket 보내서 서버에서 scene Cache x exp 업데이트

      socket.emit("created_choice", { sceneId: scene_id, userId: user_id, exp: res.data.exp })
      // tmp scene create

      formRef.resetFields();
      setVisible(false);

      //! 껍데기 넣을 때, 서버에서 exp 같이 넣기 (별개로 or 같이 해도됨 시간 동기화가 되는 좋은 방법이 있다면)
      history.replace({
        pathname: `/scene/make`,
        state: {
          gameId: game_id,
          sceneId: res.data.sceneId
        }
      });

    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const onClickHandler = () => {
    clearTimeout(decreaseTimer);

    let tick = 30;
    setRemainTime(tick);
    const decTimer = setInterval(() => {
      tick--;
      if (tick === 0) {
        clearInterval(decTimer);
        cancelHandler();
        return;
      }
      setRemainTime(tick);
    }, 970);
    setDecreaseTimer(decTimer);

    socket.emit("empty_num_decrease", { scene_id, user_id });

    return setVisible(true);
  }

  const cancelHandler = () => {
    socket.emit("empty_num_increase", { scene_id, user_id });
    clearTimeout(decreaseTimer);
    setClickable(false);
    return setVisible(false)
  }

  const createHandler = () => {
    return handleCreate();
  }

  useEffect(() => {
    socket.off("validated");
    socket.on("validated", (data) => {
      setValidated(validated * -1)
    })

    socket.off("decrease_failed");
    socket.on("decrease_failed", () => {
      console.log("failed..");
      clearTimeout(decreaseTimer);
      setClickable(false);
      setVisible(false);
    })

    socket.emit("validate_empty_num", { scene_id })
  }, [scene_id])

  const [working, setWorking] = useState();
  useEffect(() => {
    console.log("en", emptyNum);
    const nextListLen = Array.isArray(scene_next_list) ? scene_next_list.length : 0;
    const workingCnt = nextListLen + emptyNum
    console.log("nextListLen : ", nextListLen, "emptyNum : ", emptyNum)
    if (workingCnt >= 0 && workingCnt <= 4) {
      console.log("working Cnt : ", workingCnt)
      setWorking([...Array(4 - workingCnt)].map((n, index) => {
        return <div key={index}>작업중..<br /></div>
      }))
    }
  }, [emptyNum, scene_next_list])


  return (
    <>
      {
        working
      }
      {
        emptyNum > 0 &&
        <>
          <div
            id="choice"
            onClick={onClickHandler}
            style={{ color: "red" }}
          >
            선택의 길...
            </div>
        </>
      }
      <ModalForm
        ref={saveFormRef}
        visible={visible}
        onCancel={cancelHandler}
        onCreate={createHandler}
        remainTime={remainTime}
      />
    </>
  );
};

export default InputModal;
