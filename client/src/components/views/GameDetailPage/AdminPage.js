import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { of, forkJoin, Observable } from "rxjs";
import { map, tap, flatMap } from "rxjs/operators";
import RadialTree from '../TreeVisualization/RadialTree';

import './AdminPage.css';
import DragMove from './DragMove';
import { message, Select, Slider } from 'antd';
import { faCaretSquareUp, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const { Option } = Select;
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
  const [sliderInput, setSliderInput] = useState(20);
  const [treeData, setTreeData] = useState({
    name: "",
    userId: "",
    complaint: 0,
    children: []
  });

  function updateTree() {
    Axios.get(`/api/treedata/${gameId}`).then((response) => {
      if (response.data.success) {
        const { rawData, firstNodeId } = response.data;
        let data = {};
        for (let i = 0; i < rawData.length; i++) {
          data = { ...data, [rawData[i]._id]: rawData[i] }
        }
        getRecursive(data, firstNodeId).subscribe(d => {
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
        for (let i = 0; i < response.data.gameDetail.contributerList.length; i++) {
          tmp.push({
            value: response.data.gameDetail.contributerList[i].userId,
            label: response.data.gameDetail.contributerList[i].nickname
          });
        }
        setContributerList(tmp);
      } else {
        message.error("게임 정보를 로딩하는데 실패했습니다.");
      }
    });
    updateTree();
  }, []);

  const onClick_delete = () => {
    if (!isDelete)
      alert("지도에서 스토리를 클릭하면 스토리가 삭제됩니다. \n해당 스토리로부터 이어지는 스토리들도 함께 삭제되니 신중히 선택해주세요.");
    setIsDelete((state) => !state);
  }

  const [translate, setTranslate] = useState({
    x: 240,
    y: 20
  });
  const [zoom, setZoom] = useState(700);

  const onClick_replace = () => {
    setTranslate({
      x: 240,
      y: 20
    })
    setZoom(700);
  }

  const onClick_zoomIn = () => {
    if (zoom < 2000) {
      setZoom((state) => state + 300);
      setTranslate({
        x: translate.x - 150,
        y: translate.y - 150
      });
    }
  }

  const onClick_zoomOut = () => {
    if (zoom > 400) {
      setZoom((state) => state - 300);
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

  function handleChange(value) {
    setSelectedUser(value);
  }

  const onChange_slider = (value) => {
    setSliderInput(value)
  }

  return (
    <div className="adminPage__container">

      {/* <div className="adminPage__thumbnail container">
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
        <div className="admin">
          관리자 페이지
        </div>
        <div className="adminPage__UPTitle">
          <div>
            {gameDetail?.title} 
            <div className="adminPage_edit">
              제목 수정
            </div>
          </div>
        </div>
      </div> */}
      <div className="adminPage__body">
        {/* <div className="adminPage__description">
          <div className="adminPage_edit">
            게임 설명 수정
          </div>
          {gameDetail.description}
        </div> */}

        {(treeData.userId !== "" && currUserData?._id === treeData.userId) ?
          <>
            <Link
              to={`/game/${gameId}`}
              className="admin_btn"
            >
              게임으로 돌아가기
            </Link>
            <div className="admin_title">스토리 미니맵</div>
            <div className="dragDrop_container">
              <DragMove
                onDragMove={handleDragMove}
              >
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
                    selectedUser={selectedUser}
                    threshold={sliderInput}
                  />
                </div>
              </DragMove>
            </div>
            <div
              className="admin_delete"
            >
              <div className="description">
                {isDelete ?
                  '미니맵의 스토리를 클릭하면 해당 스토리와 해당 스토리로부터 이어지는 모든 스토리가 제거됩니다.   '
                  :
                  '미니맵의 스토리를 클릭하면 해당 스토리의 자세한 정보를 확인할 수 있습니다.   '
                }
              </div>
              <div
                className="admin_btn"
                onClick={onClick_delete}
              >
                {isDelete ?
                  '삭제 중지 '
                  :
                  '삭제 시작'
                }
              </div>
            </div>
            <div className="adminPage_options">
              <Select
                defaultValue="스토리 제작자를 선택해주세요"
                style={{ width: 300 }}
                onChange={handleChange}
              >
                <Option key={0} value="">선택해제</Option>
                {contributerList.map((contributer) => (
                  <Option key={contributer.value} value={contributer.value}>
                    {contributer.label}
                  </Option>
                ))}
              </Select>
              <Slider
                min={1}
                max={100}
                style={{ width: 290 }}
                onChange={onChange_slider}
                value={sliderInput}
              />
              <div className="admin_searchComplaint">
                <div className="complaint_circle"></div>
                <div className="complaint_threshold">
                  {`신고 횟수가 ${sliderInput} 이상인 스토리`}
                </div>
              </div>
              <div onClick={onClick_zoomIn} className="edit_btn">
                <FontAwesomeIcon icon={faPlus} />
              </div>
              <div onClick={onClick_zoomOut} className="edit_btn">
                <FontAwesomeIcon icon={faMinus} />
              </div>
              <div onClick={onClick_replace} className="edit_btn">
                <FontAwesomeIcon icon={faCaretSquareUp} />
              </div>
            </div>
          </>
          :
          <>
            {/* 잘못된 접근입니다. */}
          </>
        }
      </div>
    </div>
  )
}

export default AdminPage
