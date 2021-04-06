import { message, Switch } from 'antd';
import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { of, forkJoin, Observable } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
import RadialTree from '../TreeVisualization/RadialTree';

import './AdminPage.css';
import DragMove from './DragMove';

const config = require('../../../config/key');

const getRecursive = (managedData, id) => {
  return getFromServer(managedData, id).pipe(
    map(data => ({
      parent: { 
        name: data.name, 
        sceneId: data.sceneId, 
        gameId: data.gameId,
        userId: data.userId,
        _id: data._id, 
        complaintCnt: data.complaintCnt, 
        characterName: data.characterName,
        firstScript: data.firstScript,
        parentSceneId: data.parentSceneId,
        children: [],
      },
      childIds: data.children
    })),
    flatMap(parentWithChildIds =>
      forkJoin([
        of(parentWithChildIds.parent),
        ...parentWithChildIds.childIds.map(childId => getRecursive(managedData, childId))
      ])
    ),
    tap(
      ([parent, ...children]) => (parent.children = children)
    ),
    map(([parent]) => parent)
  );
};

// mocked back-end response 
const getFromServer = (managedData, id) => {
  return of(managedData[id]);
};

function AdminPage(props) {
  const gameId = props.match.params.gameId;
  const variable = { gameId: gameId };
  
  const currUserData = useSelector((state) => state.user.userData);
  const [gameDetail, setGameDetail] = useState([]);
  const [contributerList, setContributerList] = useState([]);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [treeData, setTreeData] = useState({
      name: "", 
      userId: "",
      complaint: 0,
      children: []
  });

  function updateTree() {
    Axios.get(`/api/treedata/${gameId}`). then((response) => {
        if (response.data.success) {
            const { rawData, firstNodeId } = response.data;
            let data = {};
            for (let i=0; i<rawData.length; i++){
            data = { ...data, [rawData[i]._id]: rawData[i]}
            } 
            getRecursive(data, firstNodeId).subscribe(d=> {
                setTreeData(d); 
            });
        }
    })
  }
  
  useEffect(() => {
    Axios.post("/api/game/detail", variable).then((response) => {
        if (response.data.success) {
            setGameDetail(response.data.gameDetail);
            const tmp = [];
            for (let i=0; i<response.data.gameDetail.contributerList.length; i++){
              tmp.push(response.data.gameDetail.contributerList[i].userId);
            }
            setContributerList(tmp);
        } else {
            message.error("게임 정보를 로딩하는데 실패했습니다.");
        }
    });
    updateTree();
  },[]);

  const onClick_delete = () => {
    setIsDelete((state) => !state);
  }
  
  const onCartegoryChange = (event) => {
    let cat_idx = event.currentTarget.value;
    setSelectedUser(event.currentTarget[cat_idx].text);
};

  const [translate, setTranslate] = useState({
    x:170,
    y:60
  });
  const [zoom, setZoom] = useState(700);

  const onClick_replace = () => {
    setTranslate({
      x:230,
      y:100
    })
    setZoom(700);
  }

  const onClick_zoomIn = () => {
    if(zoom < 2000){
      setZoom((state) => state+300);
      setTranslate({
        x: translate.x - 150,
        y: translate.y - 150
      });
    }
  }

  const onClick_zoomOut = () => {
    if(zoom > 400){
      setZoom((state) => state-300);
      setTranslate({
        x: translate.x + 150,
        y: translate.y + 150
      });
    }
  }

  const handleDragMove = (e) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  console.log(gameDetail)
  console.log(contributerList)

  return (
    <div className="adminPage__container">
      
      <div className="adminPage__thumbnail container">
        <img
            className="adminPage__thumbnail"
            src={
                process.env.NODE_ENV === 'production' ?
                    gameDetail.thumbnail
                    :
                    `${config.SERVER}/${gameDetail?.thumbnail}`}
            alt="thumbnail"
        />
        <div className="adminPage__gradation"></div>
        <div className="adminPage__UPTitle">
            관리자 페이지
            <br/>
            <br/>
            <div>{gameDetail?.title} 제목 수정</div>
        </div>
      </div>
      <div className="adminPage__body">
        <div className="adminPage__description">
            <br/>
            게임 설명 수정
            {gameDetail.description}
        </div>

        {(treeData.userId !== "" && currUserData?._id === treeData.userId) ?
        <>
            <div 
                style={isDelete ? {backgroundColor:"red"} : {backgroundColor:"black"} }
                onClick={onClick_delete}
                className="admin_btn"
            >
                {isDelete?
                "삭제 모드로"
                :
                "삭제 ㅌ"
                }
            </div>

            <div onClick={onClick_zoomIn}>확대</div>
            <div onClick={onClick_zoomOut}>축소</div>
            <div onClick={onClick_replace}>원 상태로 복구</div>
            
            <div className="scenemake_modal_detail_category_container">
                <select className="scenemake_modal_category" onChange={onCartegoryChange}>
                    {contributerList.map((contributer, index) => (
                        <option key={index} value={contributer}>
                            {contributer}
                        </option>
                    ))}
                </select>
            </div>
            <div className="dragDrop_container">
              <DragMove onDragMove={handleDragMove}>
                <div
                  style={{
                    transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
                  }}
                >
                  <RadialTree 
                      data={treeData} 
                      width={zoom} 
                      height={zoom} 
                      userId={currUserData._id}
                      dummy={false}
                      isDelete={isDelete}
                      updateTree={updateTree}
                  />
                </div>
              </DragMove>
            </div>
        </>
        :
        <>
        잘못된 접근입니다.fdsds
        </>
        }
      </div> 
    </div>
  )
}

export default AdminPage
