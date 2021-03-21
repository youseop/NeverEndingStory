import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";
import { Button } from "antd";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";
import { socket } from "../../App";

const InputModal = ({ scene_id, scene_depth, game_id, scene_next_list }) => {
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


  const handleCreate = () => {
    formRef.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log("Received values of form: ", values, scene_id, scene_depth, game_id);

      clearTimeout(increaseTimer);
      clearTimeout(decreaseTimer);
      socket.emit("created_choice", { scene_id, user_id })

      history.push({
        pathname: `/scene/make/${game_id}`,
        state: {
          scene_option: values.title,
          prev_scene_id: scene_id,
          prev_scene_depth: scene_depth,
        }
      });

      formRef.resetFields();
      setVisible(false);
    });
  };

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const onClickHandler = () => {
    socket.emit("empty_num_decrease", { scene_id, user_id });
    setIncreaseTimer(setTimeout(() => {
      cancelHandler();
    }, 30000));
    setRemainTime(29);
    setSelecting(selecting * -1);

    return setVisible(true);
  }

  const cancelHandler = () => {
    socket.emit("empty_num_increase", { scene_id, user_id });
    clearTimeout(increaseTimer);
    clearTimeout(decreaseTimer);
    return setVisible(false)
  }

  const createHandler = () => {
    return handleCreate();
  }

  const working = () => {
    console.log(emptyNum);
    if (emptyNum>=0){
      return [...Array(4 - emptyNum)].map((n, index) => {
        return <div key={index}>작업중..<br /></div>
      })
    }
  }
  useEffect(() => {
    if (remainTime > 0) {
      setDecreaseTimer(setTimeout(() => {
        setRemainTime(remainTime - 1);
      }, 980));
    }
  }, [remainTime, selecting])

  return (
    <>
      {working()}
      <div>------------------</div>
      {
        emptyNum > 0 &&
          <>
            <div
              onClick={onClickHandler}
              style={{ color: "red" }}
            >
              선택의 길...
            </div>
            <ModalForm
              ref={saveFormRef}
              visible={visible}
              onCancel={cancelHandler}
              onCreate={createHandler}
              remainTime={remainTime}
            />
          </>
      }
    </>
  );
};

export default InputModal;
