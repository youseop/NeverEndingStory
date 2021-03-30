import React, { useEffect, useState } from "react";
import Axios from "axios";
import "./LandingPage.css";
import { Banner_main1 } from "./LandingPage_banners";
import { NewGameButton } from "./LandingPage_buttons";
import { GameList } from "./LandingPage_gameLists";

const ListContainer = {
  recent_games: {
    category: "최근 플레이한 게임",
    id: "recent",
    length: 0,
    pos: 0,
    limit: 0,
  },
  popular_games: {
    category: "인기 게임",
    id: "popular",
    length: 0,
    pos: 0,
    limit: 0,
  },
};

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

  return (
    <div className="mainPage_container">
      <div className="box-container">
        <Banner_main1 />
        <NewGameButton replace={props.history.replace} />
      </div>
      <GameList data={ListContainer.recent_games} games={games} />
      {/* <GameList data={ListContainer.popular_games} games={games} /> */}
    </div>
  );
}

export default LandingPage;
