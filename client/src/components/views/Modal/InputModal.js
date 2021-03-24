import React, { useState, useCallback, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { gamePause } from "../../../_actions/gamePlay_actions";

const InputModal = ({ scene_id, scene_depth, game_id }) => {
  let history = useHistory();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const handleCreate = () => {
    if (!visible) {
      return;
    }
    formRef.validateFields((err, values) => {
      if (err || !visible) {
        return;
      }
      history.push({
        pathname: `/scene/make/${game_id}`,
        state: {
          scene_option: values.title,
          prev_scene_id: scene_id,
          prev_scene_depth: scene_depth,
        },
      });

      formRef.resetFields();
      setVisible(false);
    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const cancel = () => {
    setVisible(false);
    dispatch(gamePause(false));
  };

  return (
    <>
      <div
        id="choice"
        onClick={() => setVisible(true)}
        style={{ color: "red" }}
      >
        선택의 길...
      </div>
      <ModalForm
        ref={saveFormRef}
        visible={visible}
        onCancel={cancel}
        onCreate={() => handleCreate()}
      />
    </>
  );
};

export default InputModal;
