import React from 'react'
import { faCompress, faExpand, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

function GamePlayButtons(props) {
  const {
    cutList,
    onClick_thumbsUp,
    thumbsUp,
    thumbsUpClicked,
    view,
    setDislike,
    setHistoryMap,
    setLog,
    mute,
    muted,
    errorMessage,
    isFullscreen,
    handleExitFullscreen,
    setIsFullscreen,
    fullButton,
    i
  } = props;

  return (
    <>
    <div>
      {i === cutList.length - 1 &&
        <>
          <button
            className="gamePlay__btn preventColorChange"
            style={{ cursor: "unset" }}
          >
            <FontAwesomeIcon icon={faEye} style={{ marginLeft: "3px" }} />
            {view}
          </button>
          <button
            className={"gamePlay__btn preventColorChange"}
            onClick={(e)=>{onClick_thumbsUp(); e.stopPropagation()}}
          >
          {thumbsUpClicked ?
              <FontAwesomeIcon style={{ color: "red", marginLeft: "3px" }} icon={faHeart} />
              :
              <FontAwesomeIcon icon={faHeart} style={{ marginLeft: "3px" }} />
          }
          {thumbsUp}
          </button>
        </>
      }
      <button
        className="gamePlay__btn"
        onClick={(e) => { setDislike((state) => !state); e.stopPropagation() }}
      >
        신고
      </button>
    </div>
    <div>
      <button
        className="gamePlay__btn"
        onClick={(e) => { setHistoryMap((state) => !state); e.stopPropagation() }}
      >
        미니맵
      </button>
      <button
        className="gamePlay__btn"
        onClick={(e) => { setLog((state) => !state); e.stopPropagation() }}
      >
        대화기록
      </button>
      <div
        className="gamePlay__btn sound"
        onClick={(e) => { mute(); e.stopPropagation() }}
      >
        {muted ? <VolumeOffIcon /> : <VolumeUpIcon />}
      </div>
      {errorMessage ? (
        <button
          onClick={(e) => {
            alert(
              "Fullscreen is unsupported by this browser, please try another browser."
            );
            e.stopPropagation()
          }
          }
          className="gamePlay__btn"
        >
          {errorMessage}
        </button>
      ) : isFullscreen ? (
        <button onClick={(e) => { handleExitFullscreen(); e.stopPropagation() }} className="gamePlay__btn full">
          <FontAwesomeIcon icon={faCompress} />
        </button>
      ) : (
        <button ref={fullButton} onClick={(e) => { setIsFullscreen(); e.stopPropagation() }} className="gamePlay__btn full">
          <FontAwesomeIcon icon={faExpand} />
        </button>
      )}
    </div>
    </>
  )
}

export default GamePlayButtons
