import React from "react";
import { Modal, Form, Input } from "antd";
import useKey from "../../functions/useKey";

const ModalFormComponent = ({ visible, onCancel, onCreate, form }) => {
  const { getFieldDecorator } = form;

  function handleEnter() {
    onCreate();
  }

  useKey("Enter", handleEnter);

  return (
    <Modal
      visible={visible}
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
                message: "Please input the title of collection!"
              }
            ]
          })(<Input/>)}
        </Form.Item>
        {/* <Form.Item className="collection-create-form_last-form-item">
          {getFieldDecorator("modifier", {
            initialValue: "public"
          })(
            <Radio.Group>
              <Radio value="public">Public</Radio>
              <Radio value="private">Private</Radio>
            </Radio.Group>
          )}
        </Form.Item> */}
      </Form>
    </Modal>
  );
};

const ModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export default ModalForm;
