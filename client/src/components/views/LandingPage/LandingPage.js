import React, { useEffect, useState } from "react";
import { Row, Card, Avatar, Col, Typography } from "antd";
import Axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import "./LandingPage.css";
import { SVG, BAR } from "../../svg/icon";

const { Title } = Typography;
const { Meta } = Card;

const ListContainer = {
  recent_games: {
    id: "recent_gameList",
    pos: 0,
    limit: 3,
  },
  popular_games: {
    id: "popular_gameList",
    pos: 0,
    limit: 2,
  },
};

function ContainerToRight(target) {
  if (target.pos < target.limit - 1) {
    target.pos += 1;
    var container = document.getElementById(target.id);
    container.style.left = -1240 * target.pos + "px";
    console.log(target.pos);
  }
}

function ContainerToLeft(target) {
  if (target.pos > 0) {
    target.pos -= 1;
    var container = document.getElementById(target.id);
    container.style.left = -600 * target.pos + "px";
  }
}

function LandingPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    Axios.get("/api/game/getgames").then((response) => {
      if (response.data.success) {
        setGames(response.data.games);
      } else {
        alert("game load에 실패했습니다.");
      }
    });
  }, []);

  const renderCards = games.map((game, index) => {
    if (!game.title) {
      return null;
    }
    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <div style={{ position: "relative" }}>
          <Link to={`/game/${game._id}`}>
            <img
              style={{ width: "100%" }}
              src={`http://localhost:5000/${game.thumbnail}`}
              alt="thumbnail"
            />
          </Link>
        </div>
        <br />
        <Meta
          avatar={<Avatar src={game.creator.image} />}
          title={game.title}
          description=""
        />
        <span>{game.creator.name}</span>
        <br />
        <span style={{ marginLeft: "3rem" }}>{game.view}</span> -{" "}
        <span>{moment(game.createdAt).format("MMM Do YY")}</span>
      </Col>
    );
  });

  // console.log(games);
  let game_length = 0;

  const gameList = games.map((game, index) => {
    if (game.title) {
      // console.log(game.title);
      game_length += 1;
      return (
        <div key={index} className="gamelist-game">
          <a href={`/game/${game._id}`}>
            <img
              className="game-image"
              src={`http://localhost:5000/${game.thumbnail}`}
              alt={game.title}
            />
            <div className="game-title">{game.title}</div>
          </a>
          <div className="game-category">{game.category}</div>
        </div>
      );
    }
    return null;
  });

  return (
    // <div className="mainPage_background" style={{ width: "85%", margin: "3rem auto" }}>
    //     <Title level={2}>Recommended</Title>
    //     <hr />
    //     <Row gutter={[32, 16]}>{renderCards}</Row>
    // </div>

    <div className="mainPage_container">
      <div className="box-container">
        <button className="button-newgame">NEW 게임 만들기</button>
      </div>
      <div className="box-container game-box">
        <div className="box-title">최근 플레이한 게임</div>
        <div className="box-positionBar"></div>
        <div className="box-gameList">
          <div
            id="recent_gameList"
            className="gamelist-container"
            style={{ width: game_length * 335 + "px" }}
          >
            {gameList}
          </div>
        </div>
      </div>
      <div className="box-container game-box">
        <div className="box-title">인기 게임</div>
        <div className="box-positionBar">
          <div id="popular_bar0" className="bar">
            <BAR />
          </div>
          <div id="popular_bar1" className="bar">
            <BAR />
          </div>
        </div>
        <div className="box-gameList">
          <div
            id="popular_gameList"
            className="gamelist-container"
            style={{ width: game_length * 335 + "px" }}
          >
            {gameList}
          </div>
          <div
            className="gamelist-left-arrow"
            onClick={() => {
              ContainerToLeft(ListContainer.popular_games);
            }}
          >
            <SVG src="arrow_1" width="45" height="27" color="#F5F5F5" />
          </div>
          <div
            className="gamelist-right-arrow"
            onClick={() => {
              ContainerToRight(ListContainer.popular_games);
            }}
          >
            <SVG src="arrow_1" width="45" height="27" color="#F5F5F5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
