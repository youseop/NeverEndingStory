import React, { useState, useRef, useEffect } from "react";
import { Modal, message, Card, Col } from "antd";
import Axios from "axios";
import "./AssetLibraryModal.css"

const AssetLibraryModal = ({ visible, setVisible, assetType, setBlob, setBlobName, charPageNum, assetUsedFlag, setIsUpdate, blobAssetList }) => {
    const [asset, setAsset] = useState(null)
    const cards = useRef(null)
    const selectCount = useRef(0)
    //! Asset 호출 -- 이후 분할

    const handleCancel = () => {
        setVisible(false)
    }
    const handleOk = () => {
        if (assetType === "character") {
            setBlob(game => {
                // index가 length 보다 큰 경우 문제가 될 수 있으니 
                for (const [key, value] of Object.entries(assetUsedFlag.current[assetType])) {
                    if (value.isAdd && value.index === undefined) { // click and not added -- add
                        value.index = game.character.length
                        value.asset.character.isAsset = true;
                        game.character = [...game.character, value.asset.character]
                    }
                    else if (!value.isAdd && value.index !== undefined) {   // unclick and added -- clear
                        game.character[value.index] = undefined
                        value.index = undefined;
                    }
                }
                game.character = game.character.filter(character => character !== undefined)
                if(game.character.length > 0){
                    charPageNum.current = game.character.length-1;
                }
                else{
                    charPageNum.current = 0;
                }
                return game;
            })
            setIsUpdate(num => num + 1)
        }
        else if (assetType === "background") {
            setBlob(oldArray => {
                for (const [key, value] of Object.entries(assetUsedFlag.current[assetType])) {
                    if (value.isAdd && value.index === undefined) {
                        // 해제해도 남아있을 듯??
                        value.blobIndex = blobAssetList.current.length
                        blobAssetList.current.push(value.asset)
                        
                        value.index = oldArray.length;
                        oldArray = [...oldArray, value.asset.background.image]
                    }
                    else if (!value.isAdd && value.index !== undefined) {
                        oldArray[value.index] = undefined;
                        blobAssetList.current[value.blobIndex] = undefined;

                        value.blobIndex = undefined
                        value.index = undefined;
                    }
                }
                oldArray = oldArray.filter(background=>background!== undefined)
                return oldArray
            })
        }
        else if (assetType === "bgm") {
            setBlob(oldArray => {
                for (const [key, value] of Object.entries(assetUsedFlag.current[assetType])) {
                    if (value.isAdd && value.index === undefined) {
                        // 해제해도 남아있을 듯??
                        value.blobIndex = blobAssetList.current.length
                        blobAssetList.current.push(value.asset)

                        value.index = oldArray.length;
                        oldArray = [...oldArray, value.asset.bgm]
                    }
                    else if (!value.isAdd && value.index !== undefined) {
                        oldArray[value.index] = undefined;
                        blobAssetList.current[value.blobIndex] = undefined;

                        value.blobIndex = undefined
                        value.index = undefined;
                    }
                }
                oldArray = oldArray.filter(bgm => bgm !== undefined)
                return oldArray
            })
        }
        else if (assetType === "sound") {
            setBlob(oldArray => {
                for (const [key, value] of Object.entries(assetUsedFlag.current[assetType])) {
                    if (value.isAdd && value.index === undefined) {
                        // 해제해도 남아있을 듯??
                        value.blobIndex = blobAssetList.current.length
                        blobAssetList.current.push(value.asset)

                        value.index = oldArray.length;
                        oldArray = [...oldArray, value.asset.sound]
                    }
                    else if (!value.isAdd && value.index !== undefined) {
                        oldArray[value.index] = undefined;
                        blobAssetList.current[value.blobIndex] = undefined;

                        value.blobIndex = undefined
                        value.index = undefined;
                    }
                }
                oldArray = oldArray.filter(sound => sound !== undefined)
                return oldArray
            })
        }
        setVisible(false)

    }

    const cardClick = (index, asset) => {
        if (assetUsedFlag.current[assetType][index]?.isAdd) {
            selectCount.current--;
            assetUsedFlag.current[assetType][index].isAdd = false;
            // tempAssetList.current[index]=asset;
        }
        else {
            selectCount.current++;
            if (assetUsedFlag.current[assetType][index] === undefined)
                assetUsedFlag.current[assetType][index] = {}

            assetUsedFlag.current[assetType][index].isAdd = true
            assetUsedFlag.current[assetType][index].asset = asset

        }
    }


    useEffect(() => {
        Axios.get(`/api/asset/${assetType}`).then((response) => {
            //! asset 도착!
            if (response.data.success) {
                setAsset(response.data.asset)
            }
        })
    }, [])

    useEffect(() => {
        if (asset) {
            if (assetType === "character") {
                cards.current = asset.map((asset, index) => {
                    let isSelected = `false`;
                    if (assetUsedFlag.current['character'][index]?.isAdd) {
                        isSelected = `true`;
                    }
                    return (
                        <div
                            className={`assetImg_card assetImg_card_${isSelected}`}
                            key={index}
                            onClick={() => cardClick(index, asset)}>
                            <img className="assetImg"
                                src={asset.character.image_array[0]}
                                alt="img"
                            />
                        </div>

                    )
                })
            }
            else if (assetType === "background") {
                cards.current = asset.map((asset, index) => {
                    let isSelected = `false`;
                    if (assetUsedFlag.current['background'][index]?.isAdd) {
                        isSelected = `true`;
                    }
                    return (
                        <div
                            className={`assetImg_card assetImg_card_${isSelected}`}
                            key={index}
                            onClick={() => cardClick(index, asset)}>
                            <img className="assetImg"
                                src={asset.background.image}
                                alt="img"
                            />
                        </div>

                    )
                })
            }
            else if (assetType === "bgm") {
                cards.current = asset.map((asset, index) => {
                    let isSelected = `false`;
                    if (assetUsedFlag.current['bgm'][index]?.isAdd) {
                        isSelected = `true`;
                    }
                    return (
                        <div
                            className={`assetMusic_card assetMusic_card_${isSelected}`}
                            key={index}
                            onClick={() => cardClick(index, asset)}>
                                {asset.bgm.name}
                        </div>

                    )
                })
            }
            else if (assetType === "sound") {
                cards.current = asset.map((asset, index) => {
                    let isSelected = `false`;
                    if (assetUsedFlag.current['sound'][index]?.isAdd) {
                        isSelected = `true`;
                    }
                    return (
                        <div
                            className={`assetMusic_card assetMusic_card_${isSelected}`}
                            key={index}
                            onClick={() => cardClick(index, asset)}>
                            {asset.sound.name}
                        </div>

                    )
                })
            }
        }
    }, [asset])

    // const characterCards = Axios.get(`/asset/character`).then( )
    return (
        <Modal
            okText="완료"
            cancelText="취소"
            className="asset_library_modal"
            closable={false}
            visible={visible}
            onCancel={handleCancel}
            onOk={handleOk}
            width={1000}
        // onOk = {handleOk}\
        >
            <div>
                캐릭터 리스트
            </div>
            <div className="assetImg_container">
                {cards.current}

            </div>


        </Modal>
    )

}


export default AssetLibraryModal

