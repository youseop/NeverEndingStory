import React from 'react'
import { Link } from 'react-router-dom';


function TopRatingContributer(props) {
  const contributerList = props.contributerList;
  const totalSceneCnt = props.totalSceneCnt;
  const creatorNickname = props.creatorNickname;

  const topRateContributer_SceneCnt = contributerList[0]?.userSceneCnt;

  const topContributer = contributerList.map((contributer, index) => {
      if(contributer.userSceneCnt === 0){
          return;
      }
      const contributeRatio = Math.round(contributer.userSceneCnt/totalSceneCnt*100);
      const fakeRatio = Math.round(contributer.userSceneCnt/topRateContributer_SceneCnt*100);
      return (
          <div 
              key={contributer.userId}
              className="detailPage__contributer"
          >
              <div className={`detailPage__contributer_rankNum ${index}`}>
                  {index+1}위
              </div>
              <img 
                  className="detailPage__contributer_img"   
                  src={contributer.image} 
                  alt="image"
              />
              <div className="detailPage__contributer_info">
                  <Link to={`/profile/${contributer.userId}`}
                      className={
                      creatorNickname === contributer.nickname ? 
                      "detailPage__creater_nickname" : 
                      "detailPage__contributer_nickname"
                      }>
                      {contributer.nickname.substr(0,11)}
                  </Link>
                  <div className="detailPage__contributer_graph">
                      <div 
                          className="detailPage__graph_wrapper"
                          style={{width: `${fakeRatio}%`}}
                      >
                          <div 
                              className="detailPage__graph">
                              {contributeRatio}%
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )
  })  
  return (
    <div>
      {topContributer}
    </div>
  )
}

export default TopRatingContributer
