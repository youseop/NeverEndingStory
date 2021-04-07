import React, { useEffect, useRef, useState } from "react";
import { message, Form } from "antd";
import MyDropzone from "../../../Dropzone/MyDropzone";
import "../EssetModal.css";
import "./CharacterTab.css";
import { SVG } from "../../../../svg/icon";
import useMouse from "../../../../functions/useMouse";
import AssetLibraryModal from "../AssetLibraryModal"

function CharacterTab({ blobGame, setBlobGame, blobCharList, setBlobCharList, setFileQueue, charPageNum, assetUsedFlag, blobAssetList }) {
    const [LibraryModalVisible, setLibraryModalVisible] = useState(false)
    const [characterProfile, setCharacterProfile] = useState("");
    const [characterCards, setCharacterCards] = useState("");
    const [isUpdate, setIsUpdate] = useState(0);
    const indexNum = useRef(0); //! 몇번째 캐릭터냐?

    const onNameChange = (event) => {

        setBlobGame(game => {
            game.character[charPageNum.current].name = event.currentTarget.value
            return game
        })

        // setBlobCharList(blobCharacterList => {
        //     blobCharacterList[charPageNum.current] = {
        //         ...blobCharacterList[charPageNum.current],
        //         name = event.currentTarget.value
        //     }
        //     return blobCharacterList
        // })

        setIsUpdate(num => num + 1)
    };

    const onDescriptionChange = (event) => {
        setBlobGame(game => {
            game.character[charPageNum.current].description = event.currentTarget.value
            return game
        })
        setIsUpdate(num => num + 1)
    };

    const onDrop = (files) => {
        let blobURL = []
        let id = -100;

        for (var i = 0; i < files.length; i++) {
            if (!files[i]) {
                message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
                return;
            }
            let curURL = URL.createObjectURL(files[i])
            blobURL.push(curURL)
        }

        //new Character
        if (indexNum.current === "-1") {
            setBlobGame(game => {
                if(game.character.length)
                    id = game.character[game.character.length - 1].id + 1
                else
                    id = 0;

                game.character = [...game.character, {
                    name: "",
                    description: "",
                    image_array: blobURL,
                    id: id,
                }]
                return game
            })
            indexNum.current = blobGame.character.length - 1
        }
        else {
            setBlobGame(game => {
                id = game.character[indexNum.current].id
                                                                //! blob FIRST
                game.character[indexNum.current].image_array = [...blobURL, ...game.character[indexNum.current].image_array]
                return game
            })
        }

        console.log("id:::",id)
        //! indexNum - 몇번째 페이지에서 dropzone을 눌렀는지 -- 새로운녀석때문에
        setFileQueue(oldArray => [...oldArray, { type: "character", id : id, num:files.length, fileArray: files }])
        setIsUpdate(num => num + 1)

    };

    const characterDelete = () => {
        let characterId;
        
        setBlobGame(game => { // delete for blob
            characterId = game.character[charPageNum.current].id
            game.character.splice(charPageNum.current,1)

            return game
        })

        setFileQueue(oldArray => {  // delete for files
            let fileIdx = oldArray.findIndex(i=> i.id === characterId)
            console.log("file DELETE ! ", fileIdx, characterId)
            if (fileIdx > -1)
                oldArray.splice(fileIdx,1)
            return oldArray
        })
        setIsUpdate(num => num+1)
    }

    const characterSplice = (event) => {
        let characterId;
        const idx = event.target.id
        setBlobGame(game=>{
            characterId = game.character[charPageNum.current].id
            if (game.character[charPageNum.current].image_array.length > 1 ){
                game.character[charPageNum.current].image_array.splice(idx,1)
            }
            else{
                game.character.splice(charPageNum.current,1)
            }
            return game
        })

        //! blob 먼저 -- Real 이후에! 로 설정하면, 누른 idx가 항상 파일의 image_array의 idx와 같음
        setFileQueue(oldArray => {

            let fileIdx = oldArray.findIndex(i => i.id === characterId)
            if(fileIdx > -1){
                if(oldArray[fileIdx].num > idx){    // just for blob
                    if(oldArray[fileIdx].fileArray.length > 1){    // splice
                        oldArray[fileIdx].fileArray.splice(idx,1)
                        oldArray[fileIdx].num--;
                    }
                    else{
                        oldArray.splice(fileIdx,1)  // delete
                    }
                }
                else{
                    console.log("already uploaded file!!!")
                }
            }
            return oldArray
        })
        setIsUpdate(num => num + 1)
    }

    // 왜 인자로 넘어온 game이 처음에 존재하지 않는지 모르겠음
    //! blobGame은 모달 창이 믿고있는 이 게임의 캐릭터.
    useEffect(() => {
        if (blobGame.character && charPageNum.current < blobGame.character.length) {
            const profile = () => {
                // const img = new Image()
                // img.src = image;
                const image = blobGame.character[charPageNum.current]?.image_array[0]
                return (
                    <div>
                        <div className="characterTab_profile_image">
                            <img
                                // className={img.width > img.height ?
                                //     "characterTab_image_width" : "characterTab_image_height"}
                                className="characterTab_image"
                                src={image}
                                alt="img"
                            />
                        </div>
                        <div
                            id={charPageNum.current}
                            className="characterTab_profile_delete"
                            onClick={characterDelete}>
                            삭제하기
                        </div>

                        <Form>
                            <input
                                onChange={onNameChange}
                                value={blobGame.character[charPageNum.current]?.name}
                                className="characterTab_profile_name"
                                placeholder="이름을 입력해주세요." />
                            <textarea
                                onChange={onDescriptionChange}
                                value={blobGame.character[charPageNum.current]?.description}
                                className="characterTab_profile_text"
                                placeholder="설명을 입력해주세요." />
                            {/* <label>(혈액형/좋아하는 것 등 이모지넣을 수 있는 공간?)</label> */}
                        </Form>
                    </div>
                )
            }
            setCharacterProfile(profile);
            const cards = blobGame.character[charPageNum.current]?.image_array.map((image, index) => {
                // const img = new Image()
                // img.src = image;
                return (
                    <div
                        id={charPageNum.current}
                        key={index}
                        className="characterTab_cards"
                    >
                        <div>
                            <img
                                // className={img.width > img.height ?
                                //     "characterTab_image_width" : "characterTab_image_height"}
                                className="characterTab_image"
                                src={image}
                                alt="img"
                            />
                        </div>
                        <div
                            id={index}
                            className="characterTab_image_delete"
                            onClick={characterSplice}>
                            삭제하기
                        </div>
                    </div>
                )
            })
            setCharacterCards(cards)
        } else {
            setCharacterProfile("");
            setCharacterCards("")
        }

    }, [isUpdate, blobGame]);


    //! ON CLICK 한 친구의 ID를 찾는다. -- 눌렀을 때, PATH 에 모든 DIV가 뜨는데, 해당 녀석들의 ID를 찾는다.
    useMouse("mousedown", handleMouse)
    function handleMouse(event) {
        for (var i = 0; i < event.path.length; i++) {
            if (event.path[i].id) {
                indexNum.current = event.path[i].id
                return;
            }
        }
    }
    return (
        <div className="characterTab-container">
            {blobGame.character?.length > 0 &&
                blobGame.character?.length !== charPageNum.current &&
                <div>
                    <div>{characterProfile}</div>
                    <div className="characterTab_cards_Box">{characterCards}</div>
                    <div className="characterTab_char_dropzone"
                        id={charPageNum.current}>
                        <MyDropzone
                            onDrop={onDrop}
                            multiple={true}
                            maxSize={10485761} // 10MB + 1
                            accept="image/*"
                            type="character"
                            icon="image"
                        />
                    </div>
                    {blobGame.character &&
                        <div
                            className="characterTab_pagenum"
                        >
                            {charPageNum.current + 1}/{blobGame.character.length}
                        </div>
                    }
                </div>
            }
            {blobGame.character?.length === charPageNum.current &&
                <>
                    <div className="characterTab_upload_container">
                        <div className="characterTab_library"
                            onClick={() => {
                                setLibraryModalVisible(true)
                            }}>
                            캐릭터 저장소
                    </div>

                        <AssetLibraryModal
                            visible={LibraryModalVisible}
                            setVisible={setLibraryModalVisible}
                            assetType="character"
                            blobGame={blobGame}
                            setBlob={setBlobGame}
                            assetUsedFlag={assetUsedFlag}
                            charPageNum={charPageNum}
                            setIsUpdate={setIsUpdate}
                            blobAssetList={blobAssetList}
                        />
                        <div
                            className="characterTab_empty_dropzone"
                            id={-1}>
                            <MyDropzone
                                onDrop={onDrop}
                                multiple={true}
                                maxSize={10485761} // 10MB + 1
                                accept="image/*"
                                type="character"
                                icon="image"
                            />
                        </div>
                        <div className="characterTab_instruct">
                            캐릭터를 추가해주세요
                    </div>
                    </div>

                </>
            }
            {
                charPageNum.current !== 0 &&
                <div
                    className="characterTab_leftarrow"
                    onClick={() => {
                        charPageNum.current--
                        setIsUpdate(num => num + 1)
                    }}>
                    <SVG src="arrow_1" width="50" height="50" color="#222831" />
                </div>
            }
            {blobGame.character?.length > 0 &&
                blobGame?.character?.length !== charPageNum.current &&
                <div
                    className="characterTab_rightarrow"
                    onClick={() => {
                        charPageNum.current++
                        setIsUpdate(num => num + 1)
                    }}>
                    <SVG src="arrow_1" width="50" height="50" color="#222831" />
                </div>
            }
        </div>
    );
}

export default CharacterTab;
