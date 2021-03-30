import React from "react";
import { Modal, Form, Input, Radio } from "antd";
import "./TitleModalForm.css"

const ModalFormComponent = ({ visible, onCancel, onCreate, form }) => {
    const { getFieldDecorator } = form;
    return (
        <Modal
            visible={visible}
            title="어떤 이야기를 만드실건가요?"
            okText="제작"
            cancelText="취소"
            onCancel={onCancel}
            onOk={onCreate}c
            closable = {false}
        >
            <Form layout="vertical">
                <Form.Item label="제목">
                    {getFieldDecorator("title", {
                        rules: [
                            {
                                required: true,
                                message: "제목을 입력해주세요!"
                            }
                        ]
                    })(<Input />)}
                </Form.Item>
                <Form.Item label="게임 설명">
                    {getFieldDecorator("description")(<Input type="textarea"/>)}
                </Form.Item>
            </Form>
        </Modal>
    );
};

const TitleModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export  {TitleModalForm};
