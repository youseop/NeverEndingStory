import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Axios from "axios";
import "./LandingPage.css";
import { Banner_main } from "./LandingPage_banners";
import { GameList } from "./LandingPage_gameLists";
import { navbarControl,footerControl,} from "../../../_actions/controlPage_actions";

const GameListInfos = {
  total_num: 4,
  recent_games: {
    category: "최근 플레이한 스토리",
    id: "recent",
    length: 0,
    pos: 0,
    limit: 0,
  },
  popular_games: {
    category: "인기 스토리",
    id: "popular",
    length: 0,
    pos: 0,
    limit: 0,
  },
  newest_games: {
    category: "새로 제작된 스토리",
    id: "newest",
    length: 0,
    pos: 0,
    limit: 0,
  },
  mystery_games: {
    category: "추리 장르의 스토리",
    id: "mystery",
    length: 0,
    pos: 0,
    limit: 0,
  },
};

function LandingPage(props) {
  const dispatch = useDispatch();
  const [GamelistNum, setGamelistNum] = useState(GameListInfos.total_num);
  const [popularGames, setpopularGames] = useState([]);
  const [recentGames, setrecentGames] = useState([]);
  const [newestGames, setnewestGames] = useState([]);
  const [mysteryGames, setmysteryGames] = useState([]);

  useEffect(() => {
    //* navigation bar control
    dispatch(navbarControl(true));
    dispatch(footerControl(true));

    GameListInfos.popular_games.pos = 0;
    GameListInfos.recent_games.pos = 0;
    GameListInfos.newest_games.pos = 0;

    Axios.get("/api/game/popular-games").then((response) => {
      if (response.data.success) {
        setpopularGames(response.data.games);
      } else {
        console.log("인기게임 로드에 load에 실패했습니다.");
      }
    });

    Axios.get("/api/game/recent-games").then((response) => {
      if (response.data.success) {
        setrecentGames(response.data.games);
        if (response.data.games.length == 0) {
          setGamelistNum(GameListInfos.total_num - 1);
        }
      } else {
        console.log("최근게임 로드에 load에 실패했습니다.");
      }
    });

    Axios.get("/api/game/newest-games").then((response) => {
      if (response.data.success) {
        setnewestGames(response.data.games);
      } else {
        console.log("새로 만든 게임 로드에 load에 실패했습니다.");
      }
    });

    Axios.post("/api/game/genre-games/", {genre:"추리"}).then((response) => {
      if (response.data.success) {
        setmysteryGames(response.data.games);
      } else {
        console.log("추리 장르 게임 로드에 load에 실패했습니다.");
      }
    });

  }, []);

  return (
    <div
      className="mainPage_container"
      style={{
        gridTemplateRows: `min(600px,50vw) repeat(${GamelistNum}, min(315px,25vw))`,
      }}
    >
      <div className="box-container">
        <Banner_main replace={props.history.replace} />
      </div>
      <GameList data={GameListInfos.popular_games} games={popularGames} rank={true}/>
      {!!recentGames.length && (<GameList data={GameListInfos.recent_games} games={recentGames} rank={false}/>)}
      <GameList data={GameListInfos.newest_games} games={newestGames} rank={false}/>
      <GameList data={GameListInfos.mystery_games} games={mysteryGames} rank={false}/>
    </div>
  );
}

export default LandingPage;
