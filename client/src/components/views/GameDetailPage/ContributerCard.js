import React from 'react'
import { Link } from 'react-router-dom'

function ContributerCard({ contributer, creatorNickname, fakeRatio, contributeRatio, index, isMake }) {
    const defaultImg = "https://i.imgur.com/rF80MBo.png"
    return (
        <div
            key={contributer.userId}
            className="detailPage__contributer"
        >
            <div className={`detailPage__contributer_rankNum ${isMake} ${index}`}>
                {index >= 0 ? `${index + 1}위` : ""}
            </div>
            <img
                className={`detailPage__contributer_img ${isMake}`}
                src={contributer.image ? contributer.image : defaultImg}
                alt="image"
            />
            <div className={`detailPage__contributer_info ${isMake}`}>
                <Link to={`/profile/${contributer.userId}`}
                    className={
                        creatorNickname === contributer.nickname ?
                            `detailPage__creater_nickname ${isMake}` :
                            `detailPage__contributer_nickname ${isMake}`
                    }
                    target={isMake ? "_blank" : ""}
                >
                    {contributer.nickname.length > 11 ?
                        <>
                            {`${contributer.nickname.substr(0, 11)}...`}
                        </>
                        :
                        <>
                            {contributer.nickname}
                        </>
                    }
                </Link>
                <div className={`detailPage__contributer_graph ${isMake}`}>
                    <div
                        className="detailPage__graph_wrapper"
                        style={{ width: `${fakeRatio}%` }}
                    >
                        <div
                            className={`detailPage__graph ${isMake}`}>
                            {contributeRatio}%
                    </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContributerCard
