import React, { useEffect, useRef, useState } from "react";

function ActorTab({ gameDetail }) {
    const characterCards = gameDetail.character.map((character, index) => {
        return (
            <div className="actorTab_character_card" key={index}>
                <div className="actorTab_profile_image">
                    <img
                        src={character.image_array[0]}
                        alt="img"
                        className="actorTab_image"
                    />
                </div>
                <div className="actorTab_textarea" >
                    <textarea
                        className="actorTab_profile_text name"
                        defaultValue={character.name}
                        placeholder="???"
                        readOnly />
                    <textarea
                        className="actorTab_profile_text description"
                        defaultValue={character.description}
                        placeholder="???"
                        readOnly />
                </div>
            </div>

        )
    })

    return (
        <div className="gameInfoTab__padding actor">
            {gameDetail?.character?.length > 0 ?
                <div className="actorTab__container">{characterCards}</div>
                : <div className="actorTab__warning">{"업로드 된 캐릭터가 없습니다 :<"}</div>
            }
        </div>
    );
}

export default ActorTab;
