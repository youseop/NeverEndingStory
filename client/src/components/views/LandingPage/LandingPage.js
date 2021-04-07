import React, { useEffect, useState} from "react";
import { useDispatch } from "react-redux";
import Axios from "axios";
import "./LandingPage.css";
import { Banner_main } from "./LandingPage_banners";
import { GameList } from "./LandingPage_gameLists";
import { navbarControl,footerControl } from "../../../_actions/controlPage_actions"


const GameListInfos = {
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
  const dispatch = useDispatch();
  const [popularGames, setpopularGames] = useState([]);
  const [recentGames, setrecentGames] = useState([]);

  useEffect(() => {
    //* navigation bar control
    dispatch(navbarControl(true));
    dispatch(footerControl(true));

    GameListInfos.popular_games.pos=0;
    GameListInfos.recent_games.pos=0;

    Axios.get("/api/game/popular-games").then((response) => {
      if (response.data.success) {
        setpopularGames(response.data.games);
      } else {
        alert("인기게임 로드에 load에 실패했습니다.");
      }
    });

    Axios.get("/api/game/recent-games").then((response) => {
      if (response.data.success) {
        setrecentGames(response.data.games);
      } else {
        alert("최근게임 로드에 load에 실패했습니다.");
      }
    });

  }, []);

  return (
    <div className="mainPage_container">
      <div className="box-container">
        <Banner_main replace={props.history.replace} />
      </div>
      <GameList data={GameListInfos.popular_games} games={popularGames} rank={true} />
      <GameList data={GameListInfos.recent_games} games={recentGames} rank={false}/>
    </div>
  );
}

export default LandingPage;
