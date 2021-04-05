import React, { useEffect, useState } from "react";
import { Modal, Form, message, Input, Button } from "antd";
import "./AdminModalForm.css"

const ModalFormComponent = ({ visible, onCancel }) => {

    return (
        <Modal
            visible={visible}
            title="스토리 정보"
            footer={[
              <Button key="move" onClick={onCancel}>
                스토리로 이동하기(todo)
              </Button>,
              <Button key="submit" type="primary" onClick={onCancel}>
                닫기
              </Button>
            ]}
            onCancel={onCancel}
            closable={false}
            bodyStyle={{
                height: "425px",
                width: "575px",
                fontFamily: "Noto Sans KR",
                fontSize: "18px",
                fontWeight: "300"
            }}
        >
            <Form layout="vertical">
              <div>
                <div>
                  만든 사람, 신고수
                </div>
                <div>
                  씬 첫 컷 디스플레이
                </div>
              </div>
            </Form>
        </Modal>
    );
};

const AdminModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export { AdminModalForm };
