import React, { useEffect, useState } from "react";
import { Modal, Form, message, Input, Button } from "antd";
import "./AdminModalForm.css"
import Axios from "axios";
import ContributerCard from "./ContributerCard";
import ComplaintCard from "./ComplaintCard";

const ModalFormComponent = ({ visible, onCancel, node }) => {
    const [sceneInfo,setSceneInfo] = useState({
      userInfo: null,
      cutList: null,
      totalSceneCnt: 0,
      complaints: []
    });

    useEffect(() => {
      if(node){
        const {userId, sceneId, gameId} = node.data;
        Axios.get(`/api/treedata/nodeInfo/${userId}/${sceneId}/${gameId}`). then((response) => {
          if (response.data.success) {
            setSceneInfo({
              userInfo: {
                ...response.data.sceneUserInfo,
                userId: userId
              },
              cutList: response.data.cutList,
              totalSceneCnt: response.data.totalSceneCnt,
              complaints: response.data.complaints
            })
          }
        })  
      } else {
        setSceneInfo({
          userInfo: null,
          cutList: null,
          totalSceneCnt: 0,
          complaints: []
        })
      }
    },[node])

    const complaintList = sceneInfo.userInfo ?
      sceneInfo.complaints.map((complaint,index) => {
        return(
          <div key={index}>
            <ComplaintCard complaint={complaint}/>
          </div>
        )
      })
      :
      ""

    const contributeRatio = sceneInfo.userInfo ?
     Math.round(sceneInfo.userInfo.contributedSceneList[0].sceneCnt/sceneInfo.totalSceneCnt*100) 
     : 
     0;
    
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
                height: "480px",
                width: "520px",
                fontFamily: "Noto Sans KR",
                fontSize: "18px",
                fontWeight: "300"
            }}
        >
            <Form layout="vertical">
            {sceneInfo.userInfo &&
              <div className="adminModalForm_container">
                <div className="adminModalForm_title">
                  스토리 제작자
                  <div className="adminModalForm_card">
                    {visible &&
                      <ContributerCard
                          contributer={sceneInfo.userInfo}
                          fakeRatio={contributeRatio}
                          contributeRatio={contributeRatio}
                      />
                    }
                  </div>
                </div>
                <div className="complaint_description">
                    <div className="adminModalForm_nickname">
                      {sceneInfo.userInfo.nickname}
                    </div> 
                    님은 게임에서 
                    <div className="adminModalForm_number">
                      {sceneInfo.userInfo.contributedSceneList[0].sceneCnt}
                    </div> 
                    개의 스토리를 제작했습니다.
                </div>
                <div className="adminModalForm_title complaint">
                  신고
                </div>
                <div className="complaint_description">
                  
                  <div className="adminModalForm_number">
                    {sceneInfo.complaints.length}
                  </div> 
                  건의 신고가 접수되었습니다.
                </div>
                <div className="complaint_container">
                  <div>
                    {complaintList}
                  </div>
                </div>
                <div className="complaint_gradation"></div>
              </div>
            }
            </Form>
        </Modal>
    );
};

const AdminModalForm = Form.create({ name: "modal_form" })(ModalFormComponent);

export { AdminModalForm };
