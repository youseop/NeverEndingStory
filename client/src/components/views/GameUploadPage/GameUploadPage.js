import React, { useState } from "react";
import { Typography, Button, Form, message, Input, Icon } from "antd";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useSelector } from "react-redux";
import "./GameUploadPage.css";

const { TextArea } = Input;
const { Title } = Typography;

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

const RatioOptions = [
    { value: `${9/16}`, label: "16:9"}, 
    { value: `${16/9}`, label: "9:16(스마트폰)"}, 
]

function GameUploadPage(props) {
    const user = useSelector((state) => state.user);
    const [GameTitle, setGameTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(0);
    const [category, setCategory] = useState("살아남기");
    const [ratio, setRatio] = useState(true);

    const [filePath, setFilePath] = useState("");
    // const [duration, setDuration] = useState("")
    // const [thumbnailPath, setThumbnailPath] = useState("")

    const onTitleChange = (event) => {
        setGameTitle(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        setDescription(event.currentTarget.value);
    };

    const onPrivateChange = (event) => {
        setIsPrivate(event.currentTarget.value);
    };

    const onCartegoryChange = (event) => {
        let cat_idx = event.currentTarget.value;
        setCategory(event.currentTarget[cat_idx].text);
    };

    const onRatioChange = (event) => {
        setRatio(state => !state);
    }

    const onDrop = (files) => {
        if (!files[0]) {
            alert("손상된 파일입니다.");
            return;
        }

        let formData = new FormData();
        const config = {
            header: { "content-type": "multipart/form-data" }, //content type을 같이 보내줘야한다!
        };
        formData.append("file", files[0]);

        Axios.post("/api/game/uploadfiles", formData, config).then(
            (response) => {
                if (response.data.success) {
                    setFilePath(response.data.url);
                } else {
                    alert("업로드 실패");
                }
            }
        );
    };

    const onSubmit = (event) => {
        event.preventDefault();
        if (GameTitle === "" || description === "" || filePath === "") {
            alert("모든 정보를 입력해주세요.");
            return;
        }

        let floatRatio;
        if (ratio) {
            floatRatio = 9/16;
        } else {
            floatRatio = 16/9;
        }
        const game_variables = {
            creator: user.userData._id,
            title: GameTitle,
            description: description,
            thumbnail: filePath,
            privacy: isPrivate,
            category: category,
            ratio: floatRatio,
            writer: [user.userData._id],
            character: [],
            background: [],
            bgm: [],
            sound: [],
        };
        Axios.post("/api/game/uploadgame", game_variables).then((response) => {
            if (response.data.success) {
                message.success(
                    "첫 Scene을 생성해주세요. 오른쪽의 +버튼을 활용해 이미지들을 추가할 수 있습니다."
                );
                setTimeout(() => {
                    props.history.push(
                        `/game/upload/${response.data.game._id}`
                    );
                }, 1000);
            } else {
                alert("game제작 실패");
            }
        });
    };

    return (
        <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                <Title level={2}>Upload Game</Title>
            </div>
            <Form onSubmit={onSubmit}>
                <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                >
                    {/* drop zone */}
                    <Dropzone
                        onDrop={onDrop}
                        multiple={false}
                        maxSize={1000000000}
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
                    {/* thunb nail */}
                    {filePath && (
                        <div>
                            <img
                                className="thumbnail__img"
                                src={`http://localhost:5000/${filePath}`}
                                alt="thumbnail"
                            />
                        </div>
                    )}
                </div>
                <br />
                <br />
                <label>Title</label>
                <Input onChange={onTitleChange} value={GameTitle} />
                <br />
                <br />
                <label>Description</label>
                <TextArea onChange={onDescriptionChange} value={description} />
                <br />
                <br />
                <select onChange={onPrivateChange}>
                    {PrivateOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <select onChange={onCartegoryChange}>
                    {CategoryOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select>
                <br />
                <br />
                <label><input type="radio" name="ratio" checked={ratio} onChange={onRatioChange}/>컴퓨터</label>
                <br />
                <label><input type="radio" name="ratio" checked={!ratio} onChange={onRatioChange}/>스마트폰</label>
                    
                {/* <select onChange={onRatioChange}>
                    {RatioOptions.map((item, index) => (
                        <option key={index} value={item.value}>
                            {item.label}
                        </option>
                    ))}
                </select> */}
                <br />
                <br />
                <Button type="primary" size="large" onClick={onSubmit}>
                    Next Step
                </Button>
            </Form>
        </div>
    );
}

export default GameUploadPage;
