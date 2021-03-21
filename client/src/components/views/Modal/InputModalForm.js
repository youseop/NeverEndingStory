import React from "react";
import { Modal, Form, Input } from "antd";
import useKey from "../../functions/useKey";

const ModalFormComponent = ({ visible, onCancel, onCreate, form, remainTime }) => {
  const { getFieldDecorator } = form;

  function handleEnter() {
    onCreate();
  }

  useKey("Enter", handleEnter);
  
  if (visible) {
    return (
      <Modal
        visible={true}
        title={`선택지 내용을 입력하세요 (${remainTime})`}
        okText="Submit"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <Form.Item label="Title">
            {getFieldDecorator("title", {
              rules: [
                {
                  required: true,
                  message: "Please input the title of collection!",
                },
              ],
            })(<Input ref={(input) => input && input.focus()} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  } else {
    return "";
  }
};

const ModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export default ModalForm;
