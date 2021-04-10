import { faEye, faHeart, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Link } from 'react-router-dom';
import { pasteLink } from '../../functions/pasteLink';
import GameForkButton from '../GameDetailPage/GameForkButton';
import './SceneInfo.css';

function SceneInfo(props) {
  const {
    gameDetail,
    view,
    onClick_thumbsUpGame,
    isClickedGame,
    thumbsupCntGame,
    history,
    user,
    gameId,
    sceneId,
  } = props;

  return (
    <div className="sceneInfo">
      <div className="sceneInfo__container">
        <div className="sceneInfo__title">
          {gameDetail?.title}
        </div>
        <div className="sceneInfo__genre">
            <div className="sceneInfo__creater">
                스토리를 만든 작가:&nbsp;
                    <Link
                    to={`/profile/${gameDetail?.creator?._id}`}
                    className="bold_text"
                >
                    {gameDetail?.creator?.nickname?.substr(0, 20)}
                </Link>&nbsp;&nbsp;

            </div>
            <div>
              현재 스토리에 기여한 작가:&nbsp;
                    <Link
                    to={`/profile/${user?.userData?._id}`}
                    className="bold_text"
                >
                    {user?.userData?.nickname?.substr(0, 20)}
                </Link>&nbsp;&nbsp;
            </div>
            <div style={{ "display": "block" }}>
                장르:&nbsp;{gameDetail?.category}&nbsp;
            </div>
        </div>
        <div className="detailPage__info_bar">
            <div></div>
            <div className="detailPage__interaction">
                <div className="detailPage__view">
                    <FontAwesomeIcon icon={faEye} style={{ marginLeft: "3px" }} />
                    {view}회
                </div>
                <div
                    onClick={onClick_thumbsUpGame}
                    className="detailPage__like"
                >
                    {isClickedGame ?
                        <FontAwesomeIcon style={{ color: "red", marginLeft: "3px" }} icon={faHeart} />
                        :
                        <FontAwesomeIcon icon={faHeart} style={{ marginLeft: "3px" }} />
                    }
                    {thumbsupCntGame}개
                </div>
                <div
                    className="link_bttn"
                    onClick={(e) => {
                        pasteLink(gameId);
                    }}>
                    <FontAwesomeIcon
                        icon={faLink}
                    />
                초대링크복사&nbsp;
                </div> 
                <GameForkButton
                    history={history}
                    user={user}
                    gameId={gameId}
                />
            </div>

        </div>
        <div className="detailPage__description">
            {gameDetail?.description}
        </div>
      </div>
    </div>
  )
}

export default SceneInfo
