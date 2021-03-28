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

<<<<<<< HEAD
  const uploadGameFrame = async () => {

    // tmp scene create
    const gameResponse = await Axios.get("/api/game/uploadgameframe");
  
    if (!gameResponse.data.success) {
      alert("game Frame제작 실패");
      return;
    }
  
    const firstScene = {
      gameId: gameResponse.data.game._id,
      prevSceneId: null,
      sceneDepth: 0,
      isFirst: 1,
      title: "",
    };
  
    const sceneResponse = await Axios.post("/api/scene/create", firstScene);
    if (!sceneResponse.data.success) {
      alert("scene Frame제작 실패");
      return;
    }
  
    message.success(
      "첫 Scene을 생성해주세요. 오른쪽의 버튼을 활용해 이미지들을 추가할 수 있습니다."
    );

    // console.log(props)
    setTimeout(() => {
      props.history.replace({
        pathname: `/scene/make`,
        state: {
          gameId: gameResponse.data.game._id,
          sceneId: sceneResponse.data.sceneId,
        },
      });
    }, 1000);
  };


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
              src={ process.env.NODE_ENV === 'development' ? `http://${LOCAL_HOST}:5000/${game.thumbnail}` : game.thumbnail}
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

=======
>>>>>>> da1eb82cf58f6a4a1b4169f5d2a827b4ffb5ba3f
  return (
    <div className="mainPage_container">
      <div className="box-container">
        <Banner_main1 />
        <NewGameButton replace={props.history.replace} />
      </div>
      <GameList data={ListContainer.recent_games} games={games} />
      <GameList data={ListContainer.popular_games} games={games} />
    </div>
  );
}

export default LandingPage;
