import React, { useState } from 'react'
import { Modal, Select, Form, Input, message } from "antd";
import Axios from "axios"

export default function ContactUs(props: any) {
    const { isModalVisible, setIsModalVisible } = props
    const [Type, setType] = useState("feedback");
    const [Content, setContent] = useState("");
    const [Email, setEmail] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");

    const { Option } = Select;
    const { TextArea } = Input;

    function handleType(value: string) {
        setType(value)
    }

    const handleContent = (event: any) => {
        setContent(event.currentTarget.value);
    }

    const handleEmail = (event: any) => {
        setEmail(event.currentTarget.value);
    }

    const handlePhoneNumber = (event: any) => {
        setPhoneNumber(event.currentTarget.value);
    }

    const handleOk = () => {
        const feedback = {
            Type: Type,
            Email: Email,
            PhoneNumber: PhoneNumber,
            Content: Content
        }
        if (feedback.Content.length) {
            Axios.post("api/users/send-feedback", feedback).then((response) => {
                if (response.data.success) {
                    message.success('전송되었습니다. 고맙습니다.');
                } else {
                    message.error('전송 실패하였습니다. 조속히 처리하겠습니다.');
                }
                setType("feedback")
                setContent("")
                setEmail("")
                setPhoneNumber("")
            })
            setIsModalVisible(false);
        } else {
            message.error("내용을 입력해주세요.");
        }

    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Modal
                title="문의하기"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>사이트에 대한 피드백 혹은 문의를 남겨주세요. 필요하시다면, 답장 받으실 연락처를 남겨주세요.</p>
                <p />
                <div>
                    <Select defaultValue="feedback" style={{ width: 120 }} onChange={handleType}>
                        <Option value="feedback">피드백</Option>
                        <Option value="ask">문의</Option>
                        <Option value="copywrite">저작권 관련</Option>
                    </Select>
                </div>
                <Form.Item required>
                    <p />
                    <TextArea placeholder="내용을 적어주세요" rows={6} value={Content} onChange={handleContent} />
                    <p />
                    이메일 :
                <Input placeholder="이메일 주소" value={Email} onChange={handleEmail} />
                    <p />
                    연락처 :
                <Input placeholder="휴대폰 번호" value={PhoneNumber} onChange={handlePhoneNumber} />
                </Form.Item>
            </Modal>
        </div>
    )
}
