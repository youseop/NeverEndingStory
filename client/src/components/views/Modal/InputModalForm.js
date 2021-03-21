import React, { useEffect, useRef } from "react";
import { Modal, Form, Input, Radio } from "antd";
import useKey from "../../functions/onClickFunction";

const ModalFormComponent = ({ visible, onCancel, onCreate, form, remainTime }) => {
  const { getFieldDecorator } = form;
<<<<<<< HEAD
=======

  function handleEnter() {
    onCreate();
  }

  useKey("Enter", handleEnter);

>>>>>>> origin/makeScene
  return (
    <Modal
      visible={visible}
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
