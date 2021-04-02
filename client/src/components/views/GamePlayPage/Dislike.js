import { message } from "antd";
import Axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Dislike.css";

function DislikePopup(props) {
  const { gameId, sceneId, trigger, setTrigger } = props;

  const user = useSelector((state) => state.user);

  const [Title,setTitle] = useState("");
  const [Description,setDescription] = useState("");

  const onTitleChange = (event) => {
    setTitle(event.currentTarget.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const variable = {
      title : Title,
      description : Description,
      user : user.userData._id,
      sceneId : sceneId,
      gameId : gameId,
    }
    Axios.post("/api/complaint/", variable).then((response) => {
      if(!response.data.success) {
        message.error("신고하는데 문제가 발생했습니다.")
      } else {
        message.success("감사합니다. 신고가 접수되었습니다.")
        setTrigger(state => !state)
      }
    })
  }

  return trigger ? (
    <div className="dislike_popup">
      <div className="dislike_inner">
        <button className="close_btn" onClick={() => setTrigger(state => !state)}>
          close
        </button>
        <label>Title</label>
        <input onChange={onTitleChange} value={Title} />
        <label>Description</label>
        <textarea onChange={onDescriptionChange} value={Description} />
        <button className="btn" onClick={onSubmit}>
          신고하기
        </button>
      </div>
    </div>
  ) : (
    ""
  );
}

export default DislikePopup;
