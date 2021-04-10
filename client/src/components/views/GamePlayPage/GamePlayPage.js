import "./GamePlayPage.css";
import "./GamePlaySlider.css";
import GameCharacterBlock from "./GameCharacterBlock";
import { TextBlock, TextBlockChoice } from "./TextBlock.js";
import React, { useEffect, useMemo, useRef, useState, useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Axios from "axios";
import HistoryMapPopup from "./HistoryMap";
import LoadingPage from "./LoadingPage";
import { message } from "antd";
import { socket } from "../../App"
import { loadEmptyNum, savePrevScene } from "../../../_actions/sync_actions"
import useKey from "../../functions/useKey";
import { gameLoadingPage } from "../../../_actions/gamePlay_actions";
import { navbarControl, footerControl } from "../../../_actions/controlPage_actions";
import useFullscreenStatus from "../../../utils/useFullscreenStatus";
import { useLocation } from "react-router";
import TreeMapPopup from "./TreeMap";
import { gamePause } from "../../../_actions/gamePlay_actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import Complaint from './Complaint.js';
import { faCheckSquare, faCompress, faExpand, faEye, faHeart, faLink, } from "@fortawesome/free-solid-svg-icons";
import Comment from '../Comment/Comment.js';
import LogPopup from "./LogPopup";
import { Link } from "react-router-dom";
import GameForkButton from "../GameDetailPage/GameForkButton";
import { pasteLink } from "../../functions/pasteLink";
import GamePlayButtons from './GamePlayButtons';
import SceneInfo from "./SceneInfo";


const bgm_audio = new Audio();
bgm_audio.volume = 0.5
const sound_audio = new Audio();
sound_audio.volume = 0.5

//! playscreen
const ProductScreen = (props) => {
  const isMobile = useRef(false);
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) {
    isMobile.current = true;
  }
  useLayoutEffect(() => {
    const nav = document.getElementById("menu");
    nav.className += " isPlay"
  }, []);


  const { full } = props?.match?.params;
  const location = useLocation();

  const { gameId, sceneId } = location.state;
  const userHistory = props.history;

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const isPause = useSelector((state) => state.gameplay.isPause);

  const ratio = 1080 / 1920;

  const [windowWidth, setwindowWidth] = useState(window.innerWidth);
  const [windowHeight, setwindowHeight] = useState(window.innerHeight);
  const [i, setI] = useState(0);
  const [Scene, setScene] = useState({});
  const [Dislike, setDislike] = useState(false);
  const [History, setHistory] = useState({});
  const [HistoryMap, setHistoryMap] = useState(false);
  const [Log, setLog] = useState(false);
  const [gameDetail, setGameDetail] = useState({});
  const [lastMotion, setLastMotion] = useState(false)
  const [view, setView] = useState(0);
  const [thumbsUp, setThumbsUp] = useState(0);
  const [thumbsUpClicked, setThumbsUpClicked] = useState(false);

  const prevSceneId = useSelector(state => state.sync.prevSceneId);

  const maximizableElement = useRef(null);

  const handleExitFullscreen = () => document.exitFullscreen();
  const fullButton = useRef();
  let isFullscreen, setIsFullscreen;
  let errorMessage;
  try {
    [isFullscreen, setIsFullscreen] = useFullscreenStatus(maximizableElement);
  } catch (e) {
    errorMessage = "";
    isFullscreen = false;
    setIsFullscreen = undefined;
  }
  useEffect(() => {
    if (full === "full") {
      const rootDom = document.getElementById("root");
      const footer = rootDom.getElementsByClassName("footer-container");
      if (footer[0]) {
        footer[0].remove();
      }
    }

    //* navigation bar and footer control
    dispatch(navbarControl(true));
    // dispatch(footerControl(false));

    dispatch(loadEmptyNum({
      sceneId,
    }));

    return () => {
      bgm_audio.pause();
      sound_audio.pause();
      const nav = document.getElementById("menu");
      nav.className = "menu"
    };
  }, [])


  useKey("Enter", handleEnter);
  useKey("Space", handleEnter);
  useKey("Digit1", handleChoice);
  useKey("Digit2", handleChoice);
  useKey("Digit3", handleChoice);
  useKey("Digit4", handleChoice);


  useEffect(() => {
    socket.off("accept_final_change");
    socket.on("accept_final_change", data => {
      const { sceneId, title } = data;
      let newNextList = Scene.nextList ? [...Scene.nextList] : [];
      newNextList.push({ sceneId, script: title });
      const newScene = { ...Scene, nextList: newNextList };
      setScene(newScene);
    })
  }, [Scene])

  const [volume, setVolume] = useState(0.5)
  const [muted, setMuted] = useState(false)
  const tempVolume = useRef(0.5)

  const mute = () => {
    if (muted) {
      setMuted(false)
      volumeControl(tempVolume.current)
    } else {
      tempVolume.current = volume
      setMuted(true)
      volumeControl(0)
    }
  }

  const volumeControl = (volume) => {
    setVolume(volume)
    volume === 0 ? setMuted(true) : setMuted(false)
    bgm_audio.volume = volume
    sound_audio.volume = volume
  }

  const [isFirstCut, setIsFirstCut] = useState(true);
  function playMusic(i) {
    if (isFirstCut) setIsFirstCut(false);
    if (Scene?.cutList[i]?.bgm.music) {
      //이전 곡과 같은 bgm이 아니라면
      if (
        !(i > 0 && Scene.cutList[i - 1].bgm.music == Scene.cutList[i]?.bgm.music)
      ) {
        bgm_audio.pause();
        bgm_audio.src = Scene.cutList[i]?.bgm.music;
        bgm_audio.play();
      }
    }
    if (Scene?.cutList[i]?.sound.music) {
      sound_audio.pause();

      sound_audio.src = Scene.cutList[i]?.sound.music;
      sound_audio.play();
    }
  }

  const [isTyping, setIsTyping] = useState(true);


  function handleEnter(event) {
    //! 타이핑 끝 & 미니맵 X
    if (!isTyping && !isPause) {
      if (i < Scene?.cutList?.length - 1) {
        playMusic(i + 1);
        setI(i + 1);
        setIsTyping(true);
      }
      else if (i == Scene?.cutList?.length - 1) {
        //! 엔딩자리
        setLastMotion(true)
        // setIsTyping(true)
      }
    }
  }

  function handleChoice(event) {
    if (i === Scene.cutList.length - 1 && !isPause) {
      if (Scene.nextList[parseInt(event.key) - 1]) {
        userHistory.replace({
          pathname: `/gameplay`,
          state: {
            sceneId: Scene.nextList[parseInt(event.key) - 1].sceneId,
            gameId: gameId,
          }
        })
      } else {
        if (parseInt(event.key) - 1 === Scene.nextList.length) {
          dispatch(gamePause(true));
          event.preventDefault();
          let choice = document.getElementById("choice");
          if (choice) {
            choice.click();
          }
        }
      }
    }
  }

  function onClick_thumbsUp() {
    if (user && user.userData) {
      const variable = {
        userId: user.userData._id,
        objectId: sceneId,
        flag: "1"
      }
      if(thumbsUpClicked){
        setThumbsUpClicked(false);
        setThumbsUp((state) => state-1);
      } else {
        setThumbsUpClicked(true);
        setThumbsUp((state) => state+1);
      }
      Axios.post("/api/thumbsup/", variable)
    }
    else {
      message.error("로그인이 필요합니다.")
    }
  }

  const [isClickedGame, setIsClickedGame] = useState(false);
  const [thumbsupCntGame, setThumbsupCntGame] = useState(0);

  function onClick_thumbsUpGame() {
    if (user && user.userData) {
      const variable = {
        userId: user.userData._id,
        objectId: gameId,
        flag: "1"
      }
      if(isClickedGame){
        setIsClickedGame(false);
        setThumbsupCntGame((state) => state-1);
      } else {
        setIsClickedGame(true);
        setThumbsupCntGame((state) => state+1);
      }
      Axios.post("/api/thumbsup/", variable)
    }
    else {
      message.error("로그인이 필요합니다.")
    }
  }

  const nextSceneFlag = useRef("");
  const gameFlag = useRef(true);
  useEffect(() => {
    const userId = user.userData._id;
    if (user && user.userData && sceneId!=nextSceneFlag.current) {
      nextSceneFlag.current = sceneId;

      Axios.get(`/api/gameplaypage/sceneinfo/${sceneId}/${userId}`).then((response) => {
        if (response.data.success) {
          setThumbsUpClicked(response.data.isClicked);
          setThumbsUp(response.data.thumbsup);
          setView(response.data.view);
        }
      })
      
      setLastMotion(false)
      Axios.get(`/api/game/getnextscene/${gameId}/${sceneId}`).then(
        (response) => {
          if (response.data.success) {
            const history = {
              gameId: gameId,
              sceneId: response.data.sceneIdList,
            };
            setIsTyping(true)
            setHistory(history);
            setI(0);
            bgm_audio.pause();
            sound_audio.pause();
            setIsFirstCut(true);
            setScene(response.data.scene);
            dispatch(gamePause(false));
            dispatch(gameLoadingPage(0));
            // dispatch(gameLoadingPage(6));
          } else {
            if (response.data.msg)
              message.error(response.data.msg);
            props.history.replace(`/game/${gameId}`);
          }
        }
      )
    }
    if(gameFlag.current){
      gameFlag.current = false;
      Axios.get(`/api/gameplaypage/gameinfo/${gameId}/${userId}`).then((response) => {
        if (response.data.success) {
          const {isClickedGame, thumbsupCntGame, gameDetail} = response.data;
          setGameDetail(gameDetail);
          setIsClickedGame(isClickedGame);
          setThumbsupCntGame(thumbsupCntGame);
          console.log(gameDetail,isClickedGame,thumbsupCntGame)
        } else {
          message.error("게임 정보를 로딩하는데 실패했습니다.");
        }
      });
    }
  }, [sceneId, user])

  useEffect(() => {
    socket.emit("leave room", { room: prevSceneId });
    socket.emit("room", { room: sceneId });
    // socket.emit("exp_val", {room: sceneId});
    dispatch(savePrevScene({ prevSceneId: sceneId }));
    socket.off("empty_num_changed") //! 매번 열린다.
    socket.on("empty_num_changed", data => {
      dispatch(loadEmptyNum({
        sceneId,
        emptyNum: data.emptyNum
      }));
    })
    socket.emit("validate_empty_num", { scene_id: sceneId })

  }, [sceneId])

  //* game pause control
  useEffect(() => {
    // if (HistoryMap || Dislike || TreeMap) {
    if (HistoryMap || Dislike || Log) {
      dispatch(gamePause(true));
    } else {
      dispatch(gamePause(false));
    }
  }, [HistoryMap, Dislike, Log]);

  useEffect(() => {
    function handleResize() {
      setwindowWidth(window.innerWidth);
      setwindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
  }, [window.innerWidth, window.inner]);

  const padding = isFullscreen ? 0.0 : 0.1;
  const minSize = 300;

  let newScreenSize;
  if (windowWidth * ratio > windowHeight) {
    newScreenSize = (full === "full") ? {
      width: `${windowHeight / ratio}px`,
      height: `${windowHeight}px`,
      minWidth: `${minSize / ratio}px`,
      minHeight: `${minSize}px`,
    }
      : {
        width: `${(windowHeight * (1 - 2 * padding)) / ratio}px`,
        height: `${windowHeight * (1 - 2 * padding)}px`,
        minWidth: `${minSize / ratio}px`,
        minHeight: `${minSize}px`,
      };
  } else {
    newScreenSize = (full === "full") ? {
      width: `${windowWidth}px`,
      height: `${windowWidth * ratio}px`,
      minWidth: `${minSize}px`,
      minHeight: `${minSize * ratio}px`,
    } : {
      width: `${windowWidth * (1 - 2 * padding)}px`,
      height: `${windowWidth * (1 - 2 * padding) * ratio}px`,
      minWidth: `${minSize}px`,
      minHeight: `${minSize * ratio}px`,
    };
  }

  useEffect(() => {
    if (isFullscreen && isMobile.current)
      window.screen.orientation.lock('landscape')
    return () => {
    };
  }, [isFullscreen]);

  {/* //! detail pages */ }
  // 기존에 playPage에 있던 좋아요는 Scene의 좋아요
  // DetailPage에 있는 좋아요는 게임의 좋아요 이다.
  // 사용자 반응 및 적용 후 모습을 보고 추후에 어떻게 통폐합할지 정하자!


  if (Scene?.cutList !== undefined) {
    if (i == 0 && isFirstCut) playMusic(0);
    return (
      <>
      <div
        className={`${isFullscreen
          ? "gamePlay__container gamePlay__container_fullscreen"
          : `gamePlay__container ${full}`
          }`}
        ref={maximizableElement}
      >
        <div
          className={`${isFullscreen
            ? "gamePlay__mainContainer_fullscreen"
            : `gamePlay__mainContainer ${full}`
            }`}
        >
          <div
            className={`${isFullscreen
              ? "backgroundImg_container_fullscreen"
              : `backgroundImg_container ${full}`
              }`}
            style={newScreenSize}
            onClick={(event) => handleEnter(event)}
          >
            <LoadingPage />
            {(Scene.cutList[i] && Scene.cutList[i]?.background) ?
              <img
                className="backgroundImg"
                src={Scene.cutList[i]?.background}
                alt="Network Error"
              />
              : (
                <div></div>
              )}
            <GameCharacterBlock
              characterList={Scene?.cutList[i]?.characterList}
            />


            {i === Scene.cutList.length - 1 ? (
              <TextBlockChoice
                game_id={gameId}
                cut_name={Scene.cutList[i]?.name}
                cut_script={Scene.cutList[i]?.script}
                scene_depth={Scene.depth}
                scene_id={Scene._id}
                scene_next_list={Scene.nextList}
                setIsTyping={setIsTyping}
                isTyping={isTyping}
                isEnding={Scene.isEnding}
                isLastMotion={lastMotion}
                theme={Scene.theme}
                setScene={setScene}
              />
            ) :
              <TextBlock
                cut_name={Scene.cutList[i]?.name}
                cut_script={Scene.cutList[i]?.script}
                setIsTyping={setIsTyping}
                isTyping={isTyping}
                theme={Scene.theme}
              />
            }

            <HistoryMapPopup
              userhistory={userHistory}
              history={History}
              trigger={HistoryMap}
              setTrigger={setHistoryMap}
              setScene={setScene}
              isFullscreen={isFullscreen}
            />
            <LogPopup
              trigger={Log}
              setTrigger={setLog}
              cutList={Scene.cutList}
              i={i}
            />
            <div className="gamePlay__btn_container">
              <GamePlayButtons 
                cutList={Scene.cutList}
                onClick_thumbsUp={onClick_thumbsUp}
                thumbsUp={thumbsUp}
                thumbsUpClicked={thumbsUpClicked}
                view={view}
                setDislike={setDislike}
                setHistoryMap={setHistoryMap}
                setLog={setLog}
                mute={mute}
                muted={muted}
                errorMessage={errorMessage}
                isFullscreen={isFullscreen}
                handleExitFullscreen={handleExitFullscreen}
                setIsFullscreen={setIsFullscreen}
                fullButton={fullButton}
                i={i}
              />
            </div>
            <Complaint
              sceneId={sceneId}
              gameId={gameId}
              isModalVisible={Dislike}
              setIsModalVisible={setDislike}
            />
          </div>
        </div>
      </div>
      <div className="detail_relative_container"></div>
      <SceneInfo 
        gameDetail={gameDetail}
        view={view}
        onClick_thumbsUpGame={onClick_thumbsUpGame}
        isClickedGame={isClickedGame}
        thumbsupCntGame={thumbsupCntGame}
        history={props.history}
        user={user}
        gameId={gameId}
        sceneId={sceneId}
      />
      <Comment 
        sceneId={sceneId}
        gameId={gameId}
      />
      </>
    );
  } else {
    return (
      <div className="loader_container">
        <div className="loader">Loading...</div>
      </div>
    )
  }
};

export default ProductScreen;
