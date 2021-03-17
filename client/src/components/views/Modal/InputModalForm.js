import React from "react";
import { Modal, Form, Input, Radio } from "antd";

const ModalFormComponent = ({ visible, onCancel, onCreate, form }) => {
  const { getFieldDecorator } = form;
  if (visible) {
    return (
      <Modal
        visible="true"
        title="선택지 내용을 입력하세요"
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
