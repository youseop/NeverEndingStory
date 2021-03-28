import { message } from 'antd';
import axios from 'axios';
import React, { memo, useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import './Comment.css';
import SingleComment from './SingleComment';
import mongodb from "mongodb";
import { Mongoose } from 'mongoose';

interface GameId {
  gameId: string
}

interface State_user {
  user: {
    userData: {
      isAuth: boolean;
      _id: mongodb.ObjectID
    }
  }
}

function Comment({gameId}: GameId) {
  const user = useSelector((state: State_user) => state.user);
  const isAuth = useSelector((state: State_user) => {
    if (state.user.userData){
      return state.user.userData.isAuth;
    } else {
      return null;
    }
  });
  
  const [update, setUpdate] = useState<boolean>(true);
  const [commentContent, setCommentContent] = useState<string>("");
  const [comments, setComments] = useState<string[]>([]);
 
  const updateToggle = () => {
    setUpdate((state: boolean) => !state);
  }

  useEffect(() => {
    axios.post('/api/comment/get-comment', {gameId: gameId}).then(response => {
      if (response.data.success) {
        setComments(response.data.result);
      } else {
        message.error('댓글을 불러오는데 실패했습니다.')
      }
    })
  }, [update])

  const onChange_comment = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setCommentContent(event.currentTarget.value);
  }

  const onSubmit_comment = (event: React.ChangeEvent<HTMLInputElement>): void => {
    event.preventDefault();
    if(commentContent === ""){
      return;
    }

    const variables = {
      content: commentContent,
      writer: user.userData._id,
      gameId: gameId,
      responseTo : ""
    };

    axios.post('/api/comment/save-comment', variables).then(response => {
      if(response.data.success) {
        message.success('댓글 감사합니다!');
        updateToggle();
        setCommentContent("");
      } else {
        message.error('댓글 저장에 실패했습니다.');
      }
    })
  }

  interface Comment {
    content: string;
    writer: mongodb.ObjectID;
    gameId: string;
    responseTo: mongodb.ObjectID;    
  }

  const mapComment = comments.map((comment: Comment, index: number) => {
    return (
      <div key={index}>
        {comment &&
          <SingleComment 
            updateToggle_comment={updateToggle}
            gameId={gameId} 
            comment={comment}/>
        }
      </div>
    )
  })

  return (
    <div className="container">
      <br />
      {isAuth &&
      <form className="form">
        <textarea
          className="textarea"
          onChange={onChange_comment}
          value={commentContent}
          placeholder="코멘트를 작성해 주세요."
        />
        <button className="comment_btn" onClick={onSubmit_comment}>댓글 작성</button>
      </form>
      }
      <br />
      <div>댓글 {comments.length}개</div>
      <hr/>
      {mapComment}
      <br />

    </div>
  )
}

export default memo(Comment)