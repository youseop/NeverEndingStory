import React, { useEffect,useState } from 'react'
import { SVG, BAR } from "../../svg/icon";
import "./LandingPage_gameLists.css"
import { LOCAL_HOST } from "../../Config";
import { Link } from "react-router-dom";

const config = require('../../../config/key')
interface Data {
    category: string;
    id: string;
    length: 0,
    pos: number;
    limit: number;
}

interface Game {
    title: string;
    _id: string;
    thumbnail: string;
    category: string;
    first_scene: string;
    sceneCnt: number;
    contributerList: any;
}

interface ContainerProps {
    data: Data;
    games: Game[];
    rank: boolean;
}

function ContainerToRight(target: Data, width: number) {
    if (target.pos < target.limit - 1) {
        //* bar
        var bar = document.getElementById(
            target.id + "_bar" + String(target.pos)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.filter = "brightness(50%)";
        }

        //* change location
        target.pos += 1;

        //* container
        var container = document.getElementById(target.id + "_gameList");
        if (container === null) {
            throw Error("can not find target container")
        } else {
            container.style.transform = `translate(${(-width + 80) * target.pos}px, 0px)`;
        }
        //* bar
        bar = document.getElementById(
            target.id + "_bar" + String(target.pos)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.filter = "brightness(100%)";
        }
        //* arrows
        if (target.pos == target.limit - 1) {
            var arrow = document.getElementById(
                target.id + "_right_arrow"
            );
            if (arrow === null) {
                throw Error("can not find target arrow")
            } else {
                arrow.style.display = "none";
            }
        }
        arrow = document.getElementById(target.id + "_left_arrow");
        if (arrow === null) {
            throw Error("can not find target arrow")
        } else {
            arrow.style.display = "block";
        }
    }
}

function ContainerToLeft(target: Data, width: number) {
    if (target.pos > 0) {
        //* bar
        var bar = document.getElementById(
            target.id + "_bar" + String(target.pos)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.filter = "brightness(50%)";
        }

        //* change location
        target.pos -= 1;

        //* container
        var container = document.getElementById(target.id + "_gameList");
        if (container === null) {
            throw Error("can not find target container")
        } else {
            container.style.transform = `translate(${(-width + 80) * target.pos}px, 0px)`;
        }
        //* bar
        bar = document.getElementById(
            target.id + "_bar" + String(target.pos)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.filter = "brightness(100%)";
        }
        //* arrows
        if (target.pos == 0) {
            var arrow = document.getElementById(
                target.id + "_left_arrow"
            );
            if (arrow === null) {
                throw Error("can not find target arrow")
            } else {
                arrow.style.display = "none";
            }
        }
        arrow = document.getElementById(target.id + "_right_arrow");
        if (arrow === null) {
            throw Error("can not find target arrow")
        } else {
            arrow.style.display = "block";
        }
    }
}

function mouseOnEvent(target: Data) {
    //* arrow right
    let arrow = document.getElementById(
        target.id + "_right_arrow"
    );
    if (target.pos < target.limit - 1) {
        if (arrow === null) {
            throw Error("can not find target arrow")
        } else {
            arrow.style.display = "block";
        }
    }
    //* arrow left
    arrow = document.getElementById(
        target.id + "_left_arrow"
    );
    if (target.pos > 0) {
        if (arrow === null) {
            throw Error("can not find target arrow")
        } else {
            arrow.style.display = "block";
        }
    }
    //* bar
    let bar
    for (let i = 0; i < target.limit; i++) {
        bar = document.getElementById(
            target.id + "_bar" + String(i)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.transform = "opacity(1)";
            bar.style.opacity = "1";

        }
    }
}

function mouseOffEvent(target: Data) {
    //* arrow right
    let arrow = document.getElementById(
        target.id + "_right_arrow"
    );
    if (arrow === null) {
        throw Error("can not find target arrow")
    } else {
        arrow.style.display = "none";
    }
    //* arrow left
    arrow = document.getElementById(
        target.id + "_left_arrow"
    );
    if (target.pos > 0) {
        if (arrow === null) {
            throw Error("can not find target arrow")
        } else {
            arrow.style.display = "none";

        }
    }
    //* bar
    let bar
    for (let i = 0; i < target.limit; i++) {
        bar = document.getElementById(
            target.id + "_bar" + String(i)
        );
        if (bar === null) {
            throw Error("can not find target bar")
        } else {
            bar.style.transform = "opacity(0)";
            bar.style.opacity = "0";
        }
    }
}

export function GameList(props: ContainerProps) {
    const { data, games, rank } = props;
    const [width, setWidth] = useState(Math.min(window.innerWidth, 1440));
    const isTouchScreen = window.matchMedia('(pointer: coarse)').matches;
    let style = {}
    let game_style = {}
    let arrow_style = {}

    function handleResize() {
        setWidth(Math.min(window.innerWidth, 1440))
    }

    useEffect(() => {
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);


    if (width < 767) {
        style = { height: width * 0.9 * 9 / 16 + "px" }
    } else {
        game_style = { width: (width - 80) / 4 + "px", height: (width - 80) / 4 * 5 / 7 + "px" }
        style = { height: (width - 80) / 4 * 0.95 * 9 / 16 + "px" }
    }
    //* game list
    data.length = 0;
    const gameList = games.map((game: Game, index: number) => {
        if (game?.first_scene) {
            data.length += 1;
            let thumbnailPath;

            if (process.env.NODE_ENV === "production")
                thumbnailPath = game.thumbnail
            else
                thumbnailPath = `${config.STORAGE}/${game.thumbnail}`
            if (rank) {
                return (
                    <div className="gamelist-game" key={game._id} style={game_style} >
                        <Link to={`/game/${game._id}`}>
                            <img className="game-image" src={thumbnailPath} alt={game.title}
                                style={style} />
                            <div className="game-title" style={{ paddingLeft: "30px" }}>{game.title}</div>
                            <div className="game-writerNum">{game.contributerList.length}명 참여</div>
                        </Link>
                        <div className="game-rank">{data.length}</div>
                        <div className="game-category" style={{ paddingLeft: "30px" }}>{game.category}</div>
                    </div>
                );
            } else {
                return (
                    <div className="gamelist-game" key={game._id} style={game_style}>
                        <Link to={`/game/${game._id}`}>
                            <img className="game-image" src={thumbnailPath} alt={game.title}
                                style={style} />
                            <div className="game-title">{game.title}</div>
                            <div className="game-writerNum">{game.contributerList.length}명 참여</div>

                        </Link>
                        <div className="game-category">{game.category}</div>
                    </div>
                );
            }

        }
        return null;
    });

    data.limit = Math.round((data.length / 4) + 0.49)

    //* arrow
    if (isTouchScreen && data.limit > 1) {
        arrow_style = { display: "block", height: (width - 80) / 4 * 0.95 * 9 / 16 + "px" }
    } else {
        arrow_style = { height: (width - 80) / 4 * 0.95 * 9 / 16 + "px" }
    }

    //* bars
    const bars = [];
    for (let i = data.limit - 1; i > 0; i--) {
        bars.push(
            <div id={`${data.id}_bar${i}`} className="bar" key={`${i}`}>
                <BAR />
            </div>
        )
    }
    bars.push(
        <div id={`${data.id}_bar0`} className="bar" key={0}
            style={{ filter: "brightness(100%)" }} >
            <BAR />
        </div>)

    //* return component
    if (width < 767) {
        return (
            <div className="box-container game-box"
                style={{ height: width * 1.4 * 9 / 16 * data.length + "px" }}
            >
                <div className="box-title">{data.category}</div>
                <div className="box-gameList">
                    <div
                        id={`${data.id}_gameList`} className="gamelist-container"
                        style={{ height: width * 1.2 * 9 / 16 * data.length + "px" }}
                    >
                        {gameList}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="box-container game-box">
            <div className="box-title">{data.category}</div>
            <div className="box-positionBar">
                {bars}
            </div>
            <div className="box-gameList"
                onMouseEnter={() => { mouseOnEvent(data) }}
                onMouseLeave={() => { mouseOffEvent(data) }}
            >
                <div id={`${data.id}_gameList`} className="gamelist-container"
                    style={{ width: data.length * (width - 80) / 4 + "px" }}>
                    {gameList}
                </div>

                <div id={`${data.id}_left_arrow`} className="gamelist-left-arrow"
                    onClick={() => { ContainerToLeft(data, width); }} style={style}>
                    <SVG src="arrow_1" width="100%" height="100%" color="#F5F5F5" />
                </div>

                <div id={`${data.id}_right_arrow`} className="gamelist-right-arrow"
                    onClick={() => { ContainerToRight(data, width); }} style={arrow_style}>
                    <SVG src="arrow_1" width="100%" height="100%" color="#F5F5F5" />
                </div>
            </div>
        </div>
    )
}
