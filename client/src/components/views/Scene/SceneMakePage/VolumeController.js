import React, { memo } from "react";
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import Slider from 'react-rangeslider'
import "./VolumeController.css";

function VolumeController({ audio, volume, setVolume, muted, setMuted, tempVolume }) {
    const mute = () => {
        if (muted) {
            setMuted(false)
            volumeControl(tempVolume.current)
        } else {
            tempVolume.current = volume
            setMuted(true)
            volumeControl(0)
        }
    }

    const volumeControl = (volume) => {
        setVolume(volume)
        volume === 0 ? setMuted(true) : setMuted(false)
        audio.volume = volume
    }

    return (
        <div className="volumeController_container">
            <div
                className="volumeController_icon_container"
                onClick={mute}
            >
                {muted ? <VolumeOffIcon style={{ fontSize: 30 }} /> : <VolumeUpIcon style={{ fontSize: 30 }} />}
            </div>
            <div className="volumeController_slide">
                <Slider
                    min={0}
                    max={1}
                    step={0.02}
                    value={volume}
                    onChange={event => {
                        volumeControl(event)
                    }}
                />
            </div>
        </div>
    )
}

export default memo(VolumeController);


