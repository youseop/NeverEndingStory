import React, { useEffect, useState } from 'react'
import { Row, Card, Icon, Avatar, Col, Typography } from 'antd';
import Axios from 'axios';
import moment from 'moment';
import GameDetailPage from '../GameDetailPage/GameDetailPage';

const { Title } = Typography;
const { Meta } = Card;

function LandingPage() {

    const [games, setGames] = useState([])

    useEffect(() => {
        Axios.get('/api/game/getgames')
        .then(response => {
            if(response.data.success) {
                setGames(response.data.games)
            } else {
                alert('game load에 실패했습니다.');
            }
        })
    }, [])

    const renderCards = games.map((game, index) => {
        console.log(game._id)
        return <Col key={index} lg={6} md={8} xs={24}>
        <div style={{position: 'relative'}}>
            <a href={`/game/${game._id}`}>
                <img style={{width:'100%'}} src={`http://localhost:5000/${game.game_thumbnail}`} alt="thumbnail" />
            </a>
        </div>
        <br />
        <Meta
            avatar={
                <Avatar src={game.game_creater.image} />
            }
            title={game.game_title}
            description=""
        />
        <span>{game.game_creater.name}</span><br/>
        <span style={{marginLeft: '3rem'}}>{game.game_views}</span> - <span>{moment(game.createdAt).format("MMM Do YY")}</span>
    </Col>
    })

    return (
        <div style={{width: '85%', margin: '3rem auto'}}>
            <Title level={2}>Recommended</Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}
            </Row>

        </div>
    )
}

export default LandingPage
