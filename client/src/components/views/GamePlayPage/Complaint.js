import React, { useState } from 'react'
import { Modal, Select, Form, Input, message } from "antd";
import { useSelector } from "react-redux";
import Axios from "axios";

export default function Complaint(props) {
    const { sceneId, gameId, isModalVisible, setIsModalVisible } = props

    const { Option } = Select;
    const { TextArea } = Input;
    
    const user = useSelector((state) => state.user);

    
    const onSubmit = (event) => {
        event.preventDefault();
        const variable = {
        title : Title,
        description : Description,
        user : user.userData._id,
        sceneId : sceneId,
        gameId : gameId,
        }
        Axios.post("/api/complaint/", variable).then((response) => {
        if(!response.data.success) {
            message.error("신고하는데 문제가 발생했습니다.")
        } else {
            message.success("감사합니다. 신고가 접수되었습니다.")
            setIsModalVisible(state => !state)
            setTitle("")
            setDescription("")
        }
        })
    }

    // };
    const [Title,setTitle] = useState("");
    const [Description,setDescription] = useState("");

    const onTitleChange = (event) => {
        setTitle(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Modal
                title="신고"
                visible={isModalVisible}
                onOk={onSubmit}
                onCancel={handleCancel}
            >
                <p>스토리에 대한 신고 사항을 작성해 주세요.</p>
                <p />
                <Form.Item required>
                    <p />
                    <Input placeholder="제목" value={Title} onChange={onTitleChange} />
                    <p />
                    <TextArea placeholder="신고 내용" rows={8} value={Description} onChange={onDescriptionChange} />
                    <p />
                </Form.Item>
            </Modal>
        </div>
    )
}
