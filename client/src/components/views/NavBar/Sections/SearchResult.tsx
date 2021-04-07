import React, { useState, useEffect, } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Axios from "axios"
import "./SearchResult.css"
import { searchControl } from "../../../../_actions/controlPage_actions";

const config = require('../../../../config/key')

interface Store_controlpage {
    controlpage: {
        searchOn: string;
    }
}

interface Game {
    title: string;
    _id: string;
    thumbnail: string;
    category: string;
}

export default function SearchResult() {
    const dispatch: any = useDispatch();
    const searchOn: string = useSelector((state: Store_controlpage) => state.controlpage.searchOn);
    const [gameList, setgameList] = useState([])

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        if (searchOn.length >= 2) {
            Axios.post("/api/game/search-game", { input: searchOn })
                .then(response => {
                    if (response.data.games.length) {
                        setgameList(response.data.games.map((game: Game, index: number) => {
                            let thumbnailPath;
                            if (process.env.NODE_ENV === "production")
                                thumbnailPath = game.thumbnail
                            else
                                thumbnailPath = `${config.STORAGE}/${game.thumbnail}`
                            return (
                                <div className="searchResult-game" key={index}
                                    onClick={() => { dispatch(searchControl("")) }}>
                                    <Link to={`/game/${game._id}`}>
                                        <img
                                            className="searchResult-image"
                                            src={thumbnailPath}
                                            alt={game.title}
                                        />
                                        <div className="searchResult-title">{game.title}</div>
                                    </Link>
                                    <div className="searchResult-category">{game.category}</div>
                                </div>
                            );
                        }));
                    }
                });
        }
        return () => {
            if (searchOn.length === 0) {
                setgameList([])
            }
        }
    }, [searchOn])

    if (searchOn) {
        return (
            <div className="searchResult-background">
                <div className="searchResult-container">
                    <div className="searchResult-result">검색결과</div>
                    {gameList.length ?
                        <div className="searchResult-flex">
                            {gameList}
                        </div>
                        :
                        <div className="searchResult-result" style={{ fontSize: "3vmin", opacity: "0.8" }}>
                            일치하는 결과가 없습니다.
                    </div>
                    }
                </div>
            </div>
        )
    } else {
        return null
    }
}
