import React, { memo } from "react";
import { Modal, Form, Input } from "antd";
import useKey from "../../functions/useKey";
import "./InputModalForm.css"

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
        className={"inputmodal"}
        title={`다음 이야기는 어떻게 이어질까요?`}
        okText="다음 이야기 제작하기"
        cancelText="취소"
        onCancel={onCancel}
        onOk={onCreate}
        getContainer='.gamePlay__container'
        centered={true}
        closable={false}
      >
        <Form layout="vertical">
          <Form.Item label="당신의 답변을 써주세요." name="title" rules={[
            {
              required: true,
              message: "당신의 답변을 써주세요.",
            },
          ]}>
            <Input onChange={onSceneTitleChange} ref={(input) => input && input.focus()} />
          </Form.Item>
          <p/>
          <p>이 답변은 현재 선택지의 제목으로 나타나게 됩니다.</p>
          <p>다음 페이지에서는 스토리의 컨텐츠를 활용해 다음 이야기를 쓰실 수 있습니다.</p>
          <p>({remainTime} 초 뒤에 화면이 닫힙니다...)</p>

        </Form>
      </Modal>
    );
  } else {
    return "";
  }
};

const ModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export default memo(ModalForm);
