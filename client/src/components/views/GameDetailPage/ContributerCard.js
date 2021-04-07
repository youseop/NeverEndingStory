import React from 'react'
import { Link } from 'react-router-dom'

function ContributerCard({contributer, creatorNickname, fakeRatio, contributeRatio, index}) {
  
  return (
    <div 
        key={contributer.userId}
        className="detailPage__contributer"
    >
        <div className={`detailPage__contributer_rankNum ${index}`}>
            {index>=0 ? `${index+1}위` : "" }
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
                }
                >
                { contributer.nickname.length > 11?
                <>
                {`${contributer.nickname.substr(0,11)}...`}
                </>
                :
                <>
                {contributer.nickname}
                </>
                }
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
}

export default ContributerCard
