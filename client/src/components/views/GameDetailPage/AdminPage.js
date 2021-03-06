import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';
import { of, forkJoin } from "rxjs";
import { map, tap, mergeMap } from "rxjs/operators";
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
    mergeMap(parentWithChildIds =>
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
    Axios.get(`/api/game/detail/${gameId}`).then((response) => {
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
        message.error("????????? ????????? ??????????????? ??????????????????.");
      }
    });
    updateTree();
  }, []);

  const onClick_delete = () => {
    if (!isDelete)
      alert("???????????? ???????????? ???????????? ???????????? ???????????????. \n?????? ?????????????????? ???????????? ??????????????? ?????? ???????????? ????????? ??????????????????.");
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

  const handleChange = (value) => {
    setSelectedUser(value);
  }

  const onChange_slider = (value) => {
    setSliderInput(value)
  }

  const GameDelete = () => {
    const confirmComment= `????????? ?????? ?????????????????????????\n??? ??? ???????????? ????????? ??? ????????????.\n"????????? ?????????????????????."??? ???????????? ??????????????????.`;
    if(window.prompt(confirmComment) === "????????? ?????????????????????."){
      message.loading("?????? ?????? ???..", 1)
      Axios.delete(`/api/game/${gameId}`).then((response) => {
        message.info(`${response.data.messege}`,1.5);
        if(response.data.messege === "?????????????????????.")
          props.history.push(`/`);
      })
    }
  }

  return (
    <div className="adminPage__container">
      <div className="adminPage__body">
        {(treeData.userId !== "" && currUserData?._id === treeData.userId) ?
          <>
            <Link
              to={`/game/${gameId}`}
              className="admin_btn"
            >
              ???????????? ????????????
            </Link>
            <div className="admin_title">????????? ?????????</div>
              <div
                onClick={GameDelete}
                style={{color: "black"}}
              >
                ?????? ??????
              </div>
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
                  '???????????? ???????????? ???????????? ?????? ???????????? ?????? ?????????????????? ???????????? ?????? ???????????? ???????????????.   '
                  :
                  '???????????? ???????????? ???????????? ?????? ???????????? ????????? ????????? ????????? ??? ????????????.   '
                }
              </div>
              <div
                className="admin_btn"
                onClick={onClick_delete}
              >
                {isDelete ?
                  '?????? ?????? '
                  :
                  '?????? ??????'
                }
              </div>
            </div>
            <div className="adminPage_options">
              <Select
                defaultValue="????????? ???????????? ??????????????????"
                style={{ width: 300 }}
                onChange={handleChange}
              >
                <Option key={0} value="">????????????</Option>
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
                  {`?????? ????????? ${sliderInput} ????????? ?????????`}
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
            {/* ????????? ???????????????. */}
          </>
        }
      </div>
    </div>
  )
}

export default AdminPage
