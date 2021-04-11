// import React, { useEffect, useRef, useState } from "react";
// import { SVG } from "../../../../svg/icon";
// import TopRatingContributer from "../../../GameDetailPage/TopRatingContributer";
// import { Link } from "react-router-dom";

// const config = require('../../../../../config/key')
// function GameInfoTab({ gameDetail }) {
//     console.log(gameDetail)
//     const [ContributerCnt, setContributerCnt] = useState(0);
//     const [contributerList, setContributerList] = useState([]);
//     const [totalSceneCnt, setTotalSceneCnt] = useState(0);
//     //! creator일때와 아닐 때 
//     // <div className="gameInfoTab_container">
//     //     <div>
//     //         <div className="gameInfoTab_title">제목</div>
//     //         <div
//     //             className={"gameInfoTab_image_box"}
//     //         // onClick={onClick_selectCharacter}
//     //         >
//     //             <img
//     //                 src={`${config.SERVER}/${gameDetail?.thumbnail}`}
//     //                 alt="img"
//     //                 className="gameInfoTab_image"
//     //             />
//     //         </div>
//     //         <div className="gameInfoTab_description">제목</div>
//     //         <div>213145</div>
//     //     </div>
//     // </div >
//     return (
//         <div className="detailPage__container">
//             <div className="detailPage__thumbnail_container">
//                 <img
//                     className="detailPage__thumbnail"
//                     src={
//                         process.env.NODE_ENV === 'production' ?
//                             gameDetail?.thumbnail
//                             :
//                             `${config.SERVER}/${gameDetail?.thumbnail}`}
//                     alt="thumbnail"
//                 />
//                 <div className="detailPage__gradation"></div>
//             </div>
//             <div className="detailPage__gamePlay">

//                 <div className="detailPage__UPTitle">
//                     {gameDetail?.title}
//                     <div className="detailPage__genre">
//                         <div style={{ "display": "block" }}>
//                             작가:&nbsp;
//                                     <Link
//                                 to={`/profile/${gameDetail?.creator?._id}`}
//                                 className="bold_text"
//                             >
//                                 {gameDetail?.creator?.nickname?.substr(0, 20)}
//                             </Link>&nbsp;&nbsp;

//                             </div>
//                         <div style={{ "display": "block" }}>
//                             장르:&nbsp;{gameDetail?.category}&nbsp;
//                             </div>
//                     </div>
//                     <div
//                         className="detailPage__gamePlay_link"
//                         onClick={() => playFirstScene(false)}
//                     >
//                         <div className="icon">
//                             <SVG
//                                 src="playIcon_1"
//                                 width="30"
//                                 height="30"
//                                 color="#FFF"
//                             />
//                         </div>
//                     </div>
//                 </div>
//                 <div className="detailPage__contributer_container_box">
//                     <div className="detailPage__contributer_container_box fit">
//                         <div className="detailPage__contributer_container">
//                             <div className="detailPage__contributer_title"> 가장 많은 기여를 한 사람</div>
//                             <TopRatingContributer
//                                 contributerList={contributerList}
//                                 creatorNickname={gameDetail?.creator?.nickname}
//                                 totalSceneCnt={totalSceneCnt}
//                             />
//                         </div>
//                         <div className="detailPage__gamePlay_container_box">
//                             <div className="detailPage__gamePlay_container">
//                                 <div className="detailPage__gamePlay_text">
//                                     현재 스토리
//                                 </div>
//                                 <div className="detailPage__gamePlay_sceneCntContainer">
//                                     <div className="detailPage__gamePlay_sceneCnt">
//                                         {totalSceneCnt}
//                                     </div>
//                                     <div className="detailPage__gamePlay_cntText">
//                                         개
//                                     </div>
//                                 </div>
//                             </div>
//                             <h1 style={{ "color": "white", "fontSize": "50px" }}>|</h1>
//                             <div className="detailPage__gamePlay_container">
//                                 <div className="detailPage__gamePlay_text">
//                                     현재 기여자
//                             </div>
//                                 <div className="detailPage__gamePlay_sceneCntContainer">
//                                     <div className="detailPage__gamePlay_sceneCnt">
//                                         {ContributerCnt}
//                                     </div>
//                                     <div className="detailPage__gamePlay_cntText">
//                                         명
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <div className="detailPage__info_container">
//                 <div className="detailPage__info_bar">
//                     {gameDetail?.creator?._id?.toString() === user?.userData?._id &&
//                         <Link
//                             to={`/admin/${gameId}`}
//                             className="admin_btn"
//                         >
//                             스토리 미니맵
//                         </Link>
//                     }
//                     <div className="detailPage__interaction">
//                         <div className="detailPage__view">
//                             <FontAwesomeIcon icon={faEye} style={{ marginLeft: "3px" }} />
//                             {view}회
//                             </div>
//                         <div
//                             onClick={onClick_thumbsUp}
//                             className="detailPage__like"
//                         >
//                             {thumbsUpClicked ?
//                                 <FontAwesomeIcon style={{ color: "red", marginLeft: "3px" }} icon={faHeart} />
//                                 :
//                                 <FontAwesomeIcon icon={faHeart} style={{ marginLeft: "3px" }} />
//                             }
//                             {thumbsUp}개
//                             </div>
//                         <div
//                             className="link_bttn"
//                             onClick={(e) => {
//                                 pasteLink(gameId);
//                             }}>
//                             <FontAwesomeIcon
//                                 icon={faLink}
//                             />
//                             초대링크복사&nbsp;
//                             </div>
//                         <GameForkButton
//                             history={props.history}
//                             user={user}
//                             gameId={gameId}
//                         />
//                     </div>

//                 </div>
//                 <div className="detailPage__description">
//                     {gameDetail?.description}
//                 </div>

//                 <Comment gameId={gameId} />
//             </div>
//         </div>
//     );
// }

// export default GameInfoTab;
