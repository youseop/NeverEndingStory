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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHide, setIsHide] = useState(true);
  const [isDelete, setIsDelete] = useState(false);
  const [data,setData] = useState({});
  const [treeData, setTreeData] = useState({
      name: "", 
      userId: "",
      complaint: 0,
      children: []
  });

  function updateTree() {
    Axios.get(`/api/treedata/${gameId}`, variable). then((response) => {
        if (response.data.success) {
            const { rawData, firstNodeId } = response.data;
            let data = {};
            for (let i=0; i<rawData.length; i++){
            data = { ...data, [rawData[i]._id]: rawData[i]}
            } 
            setData(data);
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
        } else {
            message.error("게임 정보를 로딩하는데 실패했습니다.");
        }
    });
    updateTree();
  },[]);
  
  const onClick_toggle = () => {
    setIsHide((state) => !state)
    setIsAdmin((state) => !state)
  }

  const onClick_delete = () => {
    setIsDelete((state) => !state);
  }
  
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });
  const [zoom, setZoom] = useState(700);

  const onClick_replace = () => {
    setTranslate({
      x:0,
      y:0
    })
  }

  const onClick_zoomIn = () => {
    setZoom((state) => state+100);
  }

  const onClick_zoomOut = () => {
    setZoom((state) => {
      if (state > 100){
        return (state-100);
      }
    })
  }

  const handleDragMove = (e) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  return (
    <div className="detailPage__container">
      
      <div className="detailPage__thumbnail_container">
        <img
            className="detailPage__thumbnail"
            src={
                process.env.NODE_ENV === 'production' ?
                    gameDetail.thumbnail
                    :
                    `${config.SERVER}/${gameDetail?.thumbnail}`}
            alt="thumbnail"
        />
        <div className="detailPage__gradation"></div>
        <div className="detailPage__UPTitle">
            {gameDetail?.title}
        </div>
    </div>

      {(treeData.userId !== "" && currUserData?._id === treeData.userId) ?
      <>
          <div 
              style={isDelete ? {backgroundColor:"red"} : {backgroundColor:"black"} }
              onClick={onClick_delete}
              className="admin_btn"
          >
              {isDelete?
              "삭제 하기"
              :
              "삭제 ㅌ"
              }
          </div>
          <div 
              style={isAdmin ? {backgroundColor:"red"} : {backgroundColor:"black"} }
              onClick={onClick_toggle}
              className="admin_btn"
          >
              {isAdmin?
              "신고 횟수 숨기기"
              :
              "신고 횟수 보기"
              }
          </div>
          <div 
              style={isHide ? {backgroundColor:"red"} : {backgroundColor:"black"} }
              onClick={onClick_toggle}
              className="admin_btn"
          >
              {isHide?
              "스토리 상세정보 보지 않기"
              :
              "스토리 상세정보 보기"
              }
          </div>

          <div onClick={onClick_zoomIn}>확대</div>
          <div onClick={onClick_zoomOut}>축소</div>
          <div onClick={onClick_replace}>원 상태로 복구</div>
          
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
                    isAdmin={isAdmin}
                    isHide={isHide}
                    isDelete={isDelete}
                    updateTree={updateTree}
                    clickable={true}
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
  )
}

export default AdminPage
