import React, { useState, useRef, useEffect } from "react";
import { Modal, Form, message, Input } from "antd";
import "./TitleModalForm.css"
import { CategoryOptions } from "../Scene/SceneMakePage/UploadModal";

const ModalFormComponent = ({ type,visible, onCancel, onCreate, setGameTitle, setGameDescription, setCategory }) => {
    
    const onTitleChange = (event) => {
        setGameTitle(event.currentTarget.value);
    };
    const onDescriptionChange = (event) => {
        setGameDescription(event.currentTarget.value.substr(0, 5000));
    }
    const onCartegoryChange = (event) => {
        let cat_idx = event.currentTarget.value;
        setCategory(event.currentTarget[cat_idx].text);
    };

    const msg = useRef(null)
    if(type === "fork"){
        msg.current = `이 스토리의 사진과 음악 자원이 모두 복사됩니다.\n같은 자원을 이용해서 다른 버전의 스토리를 만들어보세요!`
    }
    else if(type === "create"){
        msg.current = "여러분의 스토리를 제작해보세요!"
    }
    return (
        <Modal
            visible={visible}
            title="어떤 이야기를 만드실건가요?"
            okText="제작"
            cancelText="취소"
            onCancel={onCancel}
            onOk={onCreate}
            closable={false}
            centered={true}
            bodyStyle={{
                height: "515px",
                fontFamily: "Noto Sans KR",
                fontSize: "18px",
                fontWeight: "300"
            }}
        >
            <div className="title_modalform_msg">{msg.current}</div>
            <Form layout="vertical">
                <Form.Item label="제목" name="title" rules={[
                    { required: true, message: "제목을 입력해주세요!" },
                    { max: 20, message: '제목은 20자 이내여야 합니다.' },
                ]}>
                    <textarea
                        className="title_modalform_title"
                        required="required"
                        maxLength={20}
                        onChange={onTitleChange}
                    />
                </Form.Item>
                <Form.Item label="스토리 설명" name="description" rules={[
                    { required: true, message: "스토리 설명을 입력해주세요!" },
                    { max: 1000, message: '설명은 1000자 이내여야 합니다.' },
                ]}>
                    <textarea maxLength={1001} onChange={onDescriptionChange} className="title_modalform_description" required="required"/>
                </Form.Item>
                <Form.Item label="카테고리" name="description">
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
