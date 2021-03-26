import React, { useEffect, useState } from "react";
import { message } from "antd";
import Axios from "axios";
import { LOCAL_HOST } from "../../Config";
import "./LandingPage.css";
import { SVG, BAR } from "../../svg/icon";
import {Banner_main1} from"./LandingPage_banners"
import {NewGameButton} from"./LandingPage_buttons"

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
    console.log(target.pos);

    var bar = document.getElementById(
      target.id.split("_")[0] + "_bar" + String(target.pos)
    );
    bar.style.filter = "brightness(50%)";

    target.pos += 1;
    //* container
    var container = document.getElementById(target.id);
    container.style.transform = `translate(${-1267 * target.pos}px, 0px)`;
    // container.style.left = -1267 * target.pos + "px";
    //* bar
    bar = document.getElementById(
      target.id.split("_")[0] + "_bar" + String(target.pos)
    );
    bar.style.filter = "brightness(100%)";
    //* arrow
    if (target.pos == target.limit - 1) {
      var arrow = document.getElementById(
        target.id.split("_")[0] + "_right_arrow"
      );
      arrow.style.display = "none";
    }
    arrow = document.getElementById(target.id.split("_")[0] + "_left_arrow");
    arrow.style.display = "";
  }
}

function ContainerToLeft(target) {
  if (target.pos > 0) {
    // console.log(target.pos);
    var bar = document.getElementById(
      target.id.split("_")[0] + "_bar" + String(target.pos)
    );
    bar.style.filter = "brightness(50%)";

    target.pos -= 1;
    //* container
    var container = document.getElementById(target.id);
    container.style.transform = `translate(${-1267 * target.pos}px, 0px)`;

    // container.style.left = -1267 * target.pos + "px";
    //* bar
    bar = document.getElementById(
      target.id.split("_")[0] + "_bar" + String(target.pos)
    );
    bar.style.filter = "brightness(100%)";
    //* arrow
    if (target.pos == 0) {
      var arrow = document.getElementById(
        target.id.split("_")[0] + "_left_arrow"
      );
      arrow.style.display = "none";
    }
    arrow = document.getElementById(target.id.split("_")[0] + "_right_arrow");
    arrow.style.display = "";
  }
}

function LandingPage(props) {
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
              src={`http://${LOCAL_HOST}:5000/${game.thumbnail}`}
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
    <div className="mainPage_container">
      <div className="box-container">
        <Banner_main1/>
        <NewGameButton replace={props.history.replace}/>
      </div>
      <div className="box-container game-box">
        <div className="box-title">최근 플레이한 게임</div>
        <div className="box-positionBar">
          <div id="recent_bar2" className="bar">
            <BAR />
          </div>
          <div id="recent_bar1" className="bar">
            <BAR />
          </div>
          <div
            id="recent_bar0"
            className="bar"
            style={{ filter: "brightness(100%)" }}
          >
            <BAR />
          </div>
        </div>
        <div className="box-gameList">
          <div
            id="recent_gameList"
            className="gamelist-container"
            style={{ width: game_length * 335 + "px" }}
          >
            {gameList}
          </div>
          <div
            id="recent_left_arrow"
            className="gamelist-left-arrow"
            style={{ display: "none" }}
            onClick={() => {
              ContainerToLeft(ListContainer.recent_games);
            }}
          >
            <SVG src="arrow_1" width="45" height="27" color="#F5F5F5" />
          </div>
          <div
            id="recent_right_arrow"
            className="gamelist-right-arrow"
            onClick={() => {
              ContainerToRight(ListContainer.recent_games);
            }}
          >
            <SVG src="arrow_1" width="45" height="27" color="#F5F5F5" />
          </div>
        </div>
      </div>
      <div className="box-container game-box">
        <div className="box-title">인기 게임</div>
        <div className="box-positionBar">
          <div id="popular_bar1" className="bar">
            <BAR />
          </div>
          <div
            id="popular_bar0"
            className="bar"
            style={{ filter: "brightness(100%)" }}
          >
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
            id="popular_left_arrow"
            className="gamelist-left-arrow"
            style={{ display: "none" }}
            onClick={() => {
              ContainerToLeft(ListContainer.popular_games);
            }}
          >
            <SVG src="arrow_1" width="45" height="27" color="#F5F5F5" />
          </div>
          <div
            id="popular_right_arrow"
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
