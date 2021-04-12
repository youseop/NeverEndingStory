import React from 'react'
import ContributerCard from './ContributerCard';


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
          <div key={contributer.userId}>
                <ContributerCard
                    contributer={contributer}
                    creatorNickname={creatorNickname}
                    fakeRatio={fakeRatio}
                    contributeRatio={contributeRatio}
                    index={index}
                />
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
