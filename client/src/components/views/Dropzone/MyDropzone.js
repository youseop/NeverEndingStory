import React from "react";
import { FileAddOutlined } from '@ant-design/icons';
import Dropzone from "react-dropzone";
import "./MyDropzone.css";


function MyDropzone({ onDrop, multiple, maxSize, accept }) {
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
                <FileAddOutlined className="dropzone-icon" />
            </div>
        )}
    </Dropzone>

}

export default MyDropzone;
