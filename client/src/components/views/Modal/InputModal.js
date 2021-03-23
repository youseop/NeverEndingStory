import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { Button } from "antd";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";
import { socket } from "../../App";
import axios from "axios";

const InputModal = ({ scene_id, scene_depth, game_id, setClickable, scene_next_list }) => {
  let history = useHistory();
  const user = useSelector((state) => state.user);
  const emptyNum = useSelector((state) => state.sync.emptyNum);
  const user_id = user.userData._id.toString();
  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const [remainTime, setRemainTime] = useState(0);
  const [selecting, setSelecting] = useState(1);
  const [increaseTimer, setIncreaseTimer] = useState(null);
  const [decreaseTimer, setDecreaseTimer] = useState(false);
  const [validated, setValidated] = useState(1)

  const handleCreate = () => {
    formRef.validateFields( async (err, values) => {
      if (err) {
        return;
      }

      clearTimeout(increaseTimer);
      clearTimeout(decreaseTimer);

      const data = {
        gameId: game_id,
        prevSceneId: scene_id,
        isFirst : 0,
        sceneDepth: scene_depth + 1,
        title: values.title,
      };
      const res = await axios.post("/api/scene/create", data);
      //! socket 보내서 서버에서 scene Cache x exp 업데이트
      
      socket.emit("created_choice", { sceneId: scene_id, userId: user_id, exp : res.data.exp })
      // tmp scene create
      
      formRef.resetFields();
      setVisible(false);

      //! 껍데기 넣을 때, 서버에서 exp 같이 넣기 (별개로 or 같이 해도됨 시간 동기화가 되는 좋은 방법이 있다면)
      history.push({
        pathname: `/scene/make/${game_id}/${res.data.sceneId}`,
      });

    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const onClickHandler = () => {
    clearTimeout(increaseTimer);
    setIncreaseTimer(setTimeout(() => {
      cancelHandler();
    }, 30000));
    setRemainTime(29);
    setSelecting(selecting * -1);
    socket.emit("empty_num_decrease", { scene_id, user_id });

    return setVisible(true);
  }

  const cancelHandler = () => {
    socket.emit("empty_num_increase", { scene_id, user_id });
    clearTimeout(increaseTimer);
    clearTimeout(decreaseTimer);
    setClickable(false);
    return setVisible(false)
  }

  const createHandler = () => {
    return handleCreate();
  }

  useEffect(() => {
    socket.on("validated", (data) =>{
      console.log("validated : ",data.emptyNum)
      setValidated(validated*-1)
    })

    socket.on("decrease_failed", ()=> {
      console.log("failed..");
      clearTimeout(increaseTimer);
      clearTimeout(decreaseTimer);
      setClickable(false);
      setVisible(false);
    })

    socket.emit("validate_empty_num", {emptyNum, scene_id})
  }, [])


  const working = () => {

    console.log("en", emptyNum);
    
    const nextListLen = Array.isArray(scene_next_list) ? scene_next_list.length : 0;

    const workingCnt = nextListLen + emptyNum
    console.log("nextListLen : ",nextListLen, "emptyNum : ",emptyNum)

    if (workingCnt>=0 && workingCnt <= 4){
      console.log("working Cnt : ",workingCnt)

      return [...Array(4 - workingCnt)].map((n, index) => {
        return <div key={index}>작업중..<br /></div>
      })
    }
  }


  useEffect(() => {
    console.log("??????????????????????????????SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS???????????????????????????")
    if (remainTime > 0) {
      setDecreaseTimer(setTimeout(() => {
        setRemainTime(remainTime - 1);
      }, 980));
    }
  }, [remainTime, selecting])

  return (
    <>
    {
      working()
    }
      {
        emptyNum > 0 &&
          <>
            <div
              id = "choice"
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
