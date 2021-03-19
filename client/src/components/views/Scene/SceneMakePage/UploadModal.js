import React, { useState } from "react";
import { Modal, Button, Form, message, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";
import MyDropzone from "../../Dropzone/MyDropzone";

const { TextArea } = Input;

const PrivateOptions = [
    { value: 0, label: "Private" },
    { value: 1, label: "Public" },
];

const CategoryOptions = [
    { value: 0, label: "살아남기" },
    { value: 1, label: "로맨스" },
    { value: 2, label: "스토리" },
    { value: 3, label: "추리" },
    { value: 4, label: "병맛" },
];

const UploadModal = ({ visible, setUploadModalState, onSubmit_saveScene }) => {
    const user = useSelector((state) => state.user);
    const [GameTitle, setGameTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(0);
    const [category, setCategory] = useState("");
    const [blobURL, setBlobURL] = useState("");
    const [thumbFile, setThumbFile] = useState([]);

    const onTitleChange = (event) => {
        setGameTitle(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        // console.log(event.currentTarget.value);
        setDescription(event.currentTarget.value);
    };

    const onPrivateChange = (event) => {
        setIsPrivate(event.currentTarget.value);
    };

    const onCartegoryChange = (event) => {
        let cat_idx = event.currentTarget.value;
        setCategory(event.currentTarget[cat_idx].text);
    };

    const onDrop = (files) => {
        if (!files[0]) {
            message.error("10MB 이하의 이미지 파일을 업로드해주세요.");
            return;
        }
        if (blobURL)
            URL.revokeObjectURL(blobURL)

        setBlobURL(URL.createObjectURL(files[0]))
        setThumbFile(files)
    };

    const cancel = () => {
        if (blobURL)
            URL.revokeObjectURL(blobURL)

        setUploadModalState(false)
    }
    const saveInfo = (event) => {
        event.preventDefault();
        if (GameTitle === "" || description === "" || blobURL === "") {
            message.error("모든 정보를 입력해주세요.");
            return;
        }

        uploadThumb();
        setUploadModalState(false)
    }

    const uploadThumb = () => {
        //revoke blobURL
        URL.revokeObjectURL(blobURL)

        let formData = new FormData();
        const config = {
            header: { "encrpyt": "multipart/form-data" }, //content type을 같이 보내줘야한다!
        };

        thumbFile.forEach(value => {
            formData.append('files', value);
        })

        Axios.post("/api/game/uploadfile", formData, config).then(
            (response) => {
                if (response.data.success) {
                    uploadGame(response.data.files[0].path);
                } else {
                    message.error("업로드 실패");
                }
            }
        );
    }

    const uploadGame = (filePath) => {
        const game_variables = {
            creator: user.userData._id,
            title: GameTitle,
            description: description,
            thumbnail: filePath,
            privacy: isPrivate,
            category: category,
            writer: [user.userData._id],
            character: [],
            background: [],
            bgm: [],
            sound: [],
        };

        Axios.post("/api/game/uploadgame", game_variables).then((response) => {
            if (response.data.success) {

            } else {
                message.error("game제작 실패");
            }
        });
    }

    const upload = () => {
        saveInfo()
        onSubmit_saveScene()
    }

    return (
        <Modal className="scenemake_modal"
            visible={visible}
            okText="Upload"
            onCancel={cancel}
            onOk={upload}
            width={1000}
            style={{ top: 20 }}
        >
            <div>
                <div >
                    Upload Game
                </div>
                <Form onSubmit={saveInfo}>
                    <div
                        style={{ display: "flex", justifyContent: "space-between" }}
                    >
                        {/* drop zone */}
                        <MyDropzone
                            onDrop={onDrop}
                            multiple={false}
                            maxSize={10485761} // 10MB + 1
                            accept="image/*"
                        >
                        </MyDropzone>
                        {/* thunb nail */}
                        {blobURL && (
                            <div>
                                <img
                                    className="thumbnail__img"
                                    src={blobURL}
                                    alt="thumbnail"
                                />

                            </div>
                        )}
                    </div>

                    <label>Title</label>
                    <Input onChange={onTitleChange} value={GameTitle} />

                    <label>Description</label>
                    <TextArea onChange={onDescriptionChange} value={description} />

                    <select onChange={onPrivateChange}>
                        {PrivateOptions.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <select onChange={onCartegoryChange}>
                        {CategoryOptions.map((item, index) => (
                            <option key={index} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>

                    <Button type="primary" size="large" onClick={upload}>
                        Save
                </Button>
                </Form>
            </div>
        </Modal>

    )
}
export default UploadModal;
