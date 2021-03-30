import React from "react";
import { FileAddOutlined } from '@ant-design/icons';
import Dropzone from "react-dropzone";
import "./MyDropzone.css";


function MyDropzone({ onDrop, multiple, maxSize, accept, blobURL }) {
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
                    <div className = "thumbnail__container">
                        <img
                            className="thumbnail__img"
                            src={blobURL}
                            alt="thumbnail"
                        />

                    </div>
                    )
                :
                <>
                        <div><p className="thumbnail__msg"><b>Click or Drop</b></p>  </div>
                    <FileAddOutlined className="dropzone-icon" />
                </>
                }
            </div>
        )}
    </Dropzone>

}

export default MyDropzone;
