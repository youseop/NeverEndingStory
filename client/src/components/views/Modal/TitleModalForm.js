import React, { useState } from "react";
import { Modal, Form, message, Input } from "antd";
import "./TitleModalForm.css"

const ModalFormComponent = ({ visible, onCancel, onCreate, form }) => {
    const { getFieldDecorator } = form;
    const [GameTitle, setGameTitle] = useState("");

    const onTitleChange = (event) => {
        setGameTitle(event.currentTarget.value.substr(0, 30));
    };

    return (
        <Modal
            visible={visible}
            title="어떤 이야기를 만드실건가요?"
            okText="제작"
            cancelText="취소"
            onCancel={onCancel}
            onOk={onCreate}
            closable={false}
            bodyStyle={{
                height: "425px",
                fontFamily: "Noto Sans KR",
                fontSize: "18px",
                fontWeight: "300"
            }}
        >
            <Form layout="vertical">
                <Form.Item label="제목">
                    {getFieldDecorator("title", {
                        rules: [
                            { required: true, message: "제목을 입력해주세요!" },
                            { max: 30, message: '제목은 30자 이내여야 합니다.' },
                        ]
                    })(<textarea
                        className="title_modalform_title"
                        maxLength={31}
                        onChange={setGameTitle}
                        value={GameTitle} />)}
                </Form.Item>
                <Form.Item label="게임 설명">
                    {getFieldDecorator("description", {
                        rules: [
                            { required: true, message: "게임 설명을 입력해주세요!" },
                            { max: 1000, message: '설명은 1000자 이내여야 합니다.' },
                        ]
                    })(<textarea maxLength={1001} className="title_modalform_description" />)}
                </Form.Item>
            </Form>
        </Modal>
    );
};

const TitleModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export { TitleModalForm };
