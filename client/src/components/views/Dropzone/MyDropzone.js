import React from "react";
import { FileAddOutlined, InstagramOutlined, PlayCircleOutlined } from '@ant-design/icons';
import Dropzone from "react-dropzone";
import "./MyDropzone.css";


function MyDropzone({ onDrop, multiple, maxSize, accept, blobURL, type, icon }) {

    let mention;
    if (type === "background" || type === "thumbnail") {
        mention = "16 : 9 비율을 권장합니다."
    }
    else if (type === "character") {
        mention = "배경없는 사진을 권장합니다."
    } else if (type === "bgm" || type === "sound") {
        mention = "음원을 업로드 해주세요."
    }
    if (accept === "audio/*")
        accept = "audio/mp3, audio/wav, audio/w4a, audio/ogg, audio/flac"
    return <Dropzone
        onDrop={onDrop}
        multiple={multiple}
        maxSize={maxSize} // 10MB + 1
        accept={accept}
    >

        {({ getRootProps, getInputProps }) => (
            <div className="dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                {blobURL ? (
                    <div className="thumbnail__container">
                        <img
                            className="thumbnail__img"
                            src={blobURL}
                            alt="thumbnail"
                        />

                    </div>
                )
                    :
                    <>
                        <div><p className="thumbnail__msg"><b>{type === "thumbnail" ?
                            "Thumbnail Upload" : "파일 업로드"}</b></p>  </div>
                        {icon === "image" &&
                            <InstagramOutlined className="dropzone-icon" />
                        }
                        {icon === "audio" &&
                            <PlayCircleOutlined className="dropzone-icon" />
                        }
                        {icon === "file" &&
                            <FileAddOutlined className="dropzone-icon" />
                        }
                        <div><p className={`thumbnail__msg ${type === "character"}`}><b>{mention}</b></p></div>
                    </>
                }
            </div>

        )}
    </Dropzone>

}

export default MyDropzone;
