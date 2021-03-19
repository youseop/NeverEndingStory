import React, { useState, useCallback } from "react";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";

const InputModal = ({ scene_id, scene_depth, game_id, setClickable }) => {
  let history = useHistory();

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const handleCreate = () => {
    formRef.validateFields((err, values) => {
      if (err || values.title==="") {
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
    });
  };

  const saveFormRef = useCallback((node) => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const cancel = () => {
    setClickable(false);
    setVisible(false);
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
