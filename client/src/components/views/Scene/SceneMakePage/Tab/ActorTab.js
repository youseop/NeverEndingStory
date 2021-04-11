import React, { useEffect, useRef, useState } from "react";

function ActorTab({ gameDetail }) {
    const characterCards = gameDetail.character.map((character, index) => {
        console.log(character, index)
        return (
            <div className="actorTab_character_card">
                <div className="actorTab_profile_image">
                    <img
                        src={character.image_array[0]}
                        alt="img"
                        className="actorTab_image"
                    />
                </div>
                <div className="actorTab_textarea" >
                    <textarea
                        value={character.name}
                        className="actorTab_profile_text name" />
                    <textarea
                        value={character.description}
                        className="actorTab_profile_text description" />
                </div>
            </div>

        )
    })

    return (
        <div className="gameInfoTab__padding">
            <div className="actorTab__container">{characterCards}</div>
        </div>
    );
}

export default ActorTab;
