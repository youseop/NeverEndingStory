import React, { memo,useRef } from "react";
import { Modal, Form, Input } from "antd";
import useKey from "../../functions/useKey";
import "./InputModalForm.css"

const ModalFormComponent = ({ visible, onCancel, onCreate, setSceneTitle, remainTime }) => {
  
  function handleEnter() {
    onCreate();
  }
  const onSceneTitleChange = (event) => {
    setSceneTitle(event.currentTarget.value);
  }
  useKey("Enter", handleEnter);
  const msg = useRef(null)
  let min = parseInt(remainTime/60)
  let sec = parseInt(remainTime%60)
  if(sec<10) {sec = "0"+sec}
  
  msg.current = `다음 페이지에서 준비된 사진과 음악을 활용해 이야기를 만들 수 있습니다.\n${ min }: ${ sec } 이후 자동으로 창이 닫힙니다.`


  if (visible) {
    return (
      <Modal
        visible={true}
        className={"inputmodal"}
        title={`다음 이야기는 어떻게 이어질까요? `}
        okText="이야기 이어가기"
        cancelText="취소"
        onCancel={onCancel}
        onOk={onCreate}
        getContainer='.gamePlay__container'
        centered={true}
        closable={false}
      >
        <Form layout="vertical">
          <Form.Item className="scenemake_modal_input_container" label="당신의 답변을 입력해주세요" name="title" rules={[
            {
              required: true,
              message: "당신의 답변을 입력해주세요",
            },
          ]}>
            <Input className="scenemake_modal_input" onChange={onSceneTitleChange} placeholder={`이곳에 입력하시는 내용이 선택지로 보여집니다.`} maxLength={20} ref={(input) => input && input.focus()} />
          </Form.Item>
          <div className="scenemake_modal_msg">
            {msg.current}
          </div>
        </Form>
      </Modal>
    );
  } else {
    return "";
  }
};

const ModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export default memo(ModalForm);
