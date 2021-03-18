import React, { useState, useCallback } from "react";
import ModalForm from "./InputModalForm";
import { useHistory } from "react-router";

const InputModal = ({scene_id, scene_depth, game_id}) => {
  let history = useHistory();

  const [visible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);

  const handleCreate = () => {
    formRef.validateFields((err, values) => {
      if (err) {
        return;
      }
      // console.log("Received values of form: ", values, scene_id, scene_depth, game_id);

      history.push({
        pathname: `/scene/make/${game_id}`,
        state: {
          scene_option: values.title,
          prev_scene_id : scene_id,
          prev_scene_depth: scene_depth,
        }
      });

      formRef.resetFields();
    });
  };

  const saveFormRef = useCallback(node => {
    if (node !== null) {
      setFormRef(node);
    }
  }, []);

  const onClick = () => {
    setVisible(true);
  }

  return (
    <>
      <div onClick={onClick} style={{color:"red"}}>
        선택의 길...
      </div>
      {visible &&
        <ModalForm
          ref={saveFormRef}
          visible={visible}
          onCancel={() => setVisible(false)}
          onCreate={() => handleCreate()}
        />
      }
    </>
  );
};

export default InputModal;
