import React, { useState } from "react";
import { Modal, Form, message, Input } from "antd";
import "./TitleModalForm.css"
import { CategoryOptions } from "../Scene/SceneMakePage/UploadModal";

const ModalFormComponent = ({ visible, onCancel, onCreate, setGameTitle, setGameDescription, setCategory }) => {
    const onTitleChange = (event) => {
        setGameTitle(event.currentTarget.value.substr(0, 30));
    };
    const onDescriptionChange = (event) => {
        setGameDescription(event.currentTarget.value.substr(0, 5000));
    }
    const onCartegoryChange = (event) => {
        let cat_idx = event.currentTarget.value;
        setCategory(event.currentTarget[cat_idx].text);
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
                height: "515px",
                fontFamily: "Noto Sans KR",
                fontSize: "18px",
                fontWeight: "300"
            }}
        >
            <Form layout="vertical">
                <Form.Item label="제목" name="title" rules={[
                    { required: true, message: "제목을 입력해주세요!" },
                    { max: 30, message: '제목은 30자 이내여야 합니다.' },
                ]}>
                    <textarea
                        className="title_modalform_title"
                        required="required"
                        maxLength={31}
                        onChange={onTitleChange}
                    />
                </Form.Item>
                <Form.Item label="게임 설명" name="description" rules={[
                    { required: true, message: "게임 설명을 입력해주세요!" },
                    { max: 1000, message: '설명은 1000자 이내여야 합니다.' },
                ]}>
                    <textarea maxLength={1001} onChange={onDescriptionChange} className="title_modalform_description" required="required"/>
                </Form.Item>
                <Form.Item label="category" name="description">
                <select onChange={onCartegoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>

                </Form.Item>
            </Form>
        </Modal>
    );
};

const TitleModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export { TitleModalForm };
