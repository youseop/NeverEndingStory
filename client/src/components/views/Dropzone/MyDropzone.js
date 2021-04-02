import React from "react";
import { FileAddOutlined } from '@ant-design/icons';
import Dropzone from "react-dropzone";
import "./MyDropzone.css";


function MyDropzone({ onDrop, multiple, maxSize, accept, blobURL, type }) {

    let mention;
    if (type === "background" || type === "thumbnail") {
        mention = "16 : 9 비율을 권장합니다."
    }
    else if (type === "character") {
        mention = "배경이 없는 사진을 권장합니다."
    } else if (type === "bgm" || type === "sound") {
        mention = "음원을 업로드 해주세요."
    }
    return <Dropzone
        onDrop={onDrop}
        multiple={multiple}
        maxSize={maxSize} // 10MB + 1

        // accept="image/*,audio/*,video/*"
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
                        <div><p className="thumbnail__msg"><b>파일 업로드</b></p>  </div>
                        <FileAddOutlined className="dropzone-icon" />
                        <div><p className="thumbnail__msg"><b>{mention}</b></p></div>
                    </>
                }
            </div>

        )}
    </Dropzone>

}

export default MyDropzone;
