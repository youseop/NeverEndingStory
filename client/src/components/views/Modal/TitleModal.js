import React, { useState, useCallback } from "react";
import ReactDOM from "react-dom";
import { Button } from "antd";
import TitleModalForm from "./TitleModalForm";
import "antd/dist/antd.css";


const TitleModal = () => {
    const [visible, setVisible] = useState(false);
    const [formRef, setFormRef] = useState(null);

    const handleCreate = () => {
        formRef.validateFields((err, values) => {
            if (err) {
                return;
            }

            console.log("Received values of form: ", values);
            formRef.resetFields();
            setVisible(false);
        });
    };

    const saveFormRef = useCallback(node => {
        if (node !== null) {
            setFormRef(node);
        }
    }, []);

    return (
        <>
            <Button type="primary" onClick={() => setVisible(true)}>
                Show Modal
      </Button>
            <TitleModalForm
                ref={saveFormRef}
                visible={visible}
                onCancel={() => setVisible(false)}
                onCreate={() => handleCreate()}
            />
        </>
    );
};

export default TitleModal;

