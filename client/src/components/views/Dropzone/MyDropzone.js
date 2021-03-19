import React from "react";
import { Icon } from "antd";
import Dropzone from "react-dropzone";


function MyDropzone({ onDrop, multiple, maxSize,accept }) {
    return  <Dropzone
    onDrop={onDrop}
    multiple={multiple}
    maxSize={maxSize} // 10MB + 1
    
    // accept="image/*,audio/*,video/*"
    accept={accept}
>
    {({ getRootProps, getInputProps }) => (
        <div
            style={{
                width: "300px",
                height: "240px",
                border: "1px solid lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <Icon
                type="plus"
                style={{ fontSize: "3rem" }}
            />
        </div>
    )}
</Dropzone>
  
}

export default MyDropzone;
