import React, { memo } from "react";
import { Modal, Form, Input } from "antd";
import useKey from "../../functions/useKey";

const ModalFormComponent = ({ visible, onCancel, onCreate, setSceneTitle, remainTime }) => {
  function handleEnter() {
    onCreate();
  }
  const onSceneTitleChange = (event) =>{
    setSceneTitle(event.currentTarget.value.substr(0, 30));
  }
  useKey("Enter", handleEnter);

  if (visible) {
    return (
      <Modal
        visible={true}
        title={`선택지 내용을 입력하세요 (${remainTime})`}
        okText="제작 시작"
        cancelText="취소"
        onCancel={onCancel}
        onOk={onCreate}
        getContainer='.gamePlay__container'
        centered={true}
        closable={false}
      >
        <Form layout="vertical">
          <Form.Item label="Title" name="title" rules={[
            {
              required: true,
              message: "제목을 입력해주세요!",
            },
          ]}>
            <Input onChange={onSceneTitleChange} ref={(input) => input && input.focus()} />
          </Form.Item>
        </Form>
      </Modal>
    );
  } else {
    return "";
  }
};

const ModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export default memo(ModalForm);
