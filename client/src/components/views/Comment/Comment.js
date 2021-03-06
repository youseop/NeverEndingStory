import { message } from 'antd';
import axios from 'axios';
import React, { memo, useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import './Comment.css';
import SingleComment from './SingleComment';

function Comment({gameId, sceneId}) {
  const user = useSelector((state) => state.user);
  const isAuth = useSelector((state) => {
    if (state.user.userData){
      return state.user.userData.isAuth;
    } else {
      return null;
    }
  });
  
  const [commentContent, setCommentContent] = useState("");
  const [comments, setComments] = useState([]);

  const FETCHNIG_CNT = 8;
  const [fetching, setFetching] = useState(false);
  const [totalComment, setTotalComment] = useState([]);
  const [contentNumber, setContentNumber] = useState(FETCHNIG_CNT);

  const fetchNextData = async () => {
    setFetching(true);
    
    setComments(totalComment.slice(0,contentNumber+FETCHNIG_CNT));
    setContentNumber((state) => state+FETCHNIG_CNT);

    setFetching(false);
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight*(3/2) >= scrollHeight && fetching === false) {
      fetchNextData();
    }
   };

   useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
 
  const updateToggle = () => {
    if(sceneId){
      axios.get(`/api/comment/scene/${gameId}/${sceneId}`).then(response => {
        if (response.data.success) {
          setTotalComment(response.data.result);
          setComments(response.data.result.slice(0,contentNumber));
        } else {
          message.error('댓글을 불러오는데 실패했습니다.')
        }
      })
    } else {
      axios.get(`/api/comment/${gameId}`).then(response => {
        if (response.data.success) {
          setTotalComment(response.data.result);
          setComments(response.data.result.slice(0,contentNumber));
        } else {
          message.error('댓글을 불러오는데 실패했습니다.')
        }
      })
    }
  }

  useEffect(() => {
    updateToggle();
  }, [])

  const onChange_comment = (event) => {
    setCommentContent(event.currentTarget.value);
  }

  const onSubmit_comment = (event) => {
    event.preventDefault();
    if(commentContent === ""){
      return;
    }
    let variables;
    if(sceneId){
      variables = {
        content: commentContent,
        writer: user.userData._id,
        gameId: gameId,
        sceneId: sceneId,
        responseTo : ""
      };
    } else {
      variables = {
        content: commentContent,
        writer: user.userData._id,
        gameId: gameId,
        sceneId: "",
        responseTo : ""
      };
    }

    message.loading("댓글 저장 중..", 1)
    axios.post('/api/comment/', variables).then(response => {
      if(response.data.success) {
        message.success('댓글 감사합니다.');
        updateToggle();
        setCommentContent("");
      } else {
        message.error('댓글 저장에 실패했습니다.');
      }
    })
  }

  const mapComment = comments.map((comment, index) => {
    return (
      <div key={comment._id}>
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
    <div className={sceneId ? "comment__container gamePlay_comment" : "comment__container"}>
      <div className="comment__commentCnt">
        댓글 {totalComment.length}개
      </div>
      <hr/>
      <br />
      {isAuth &&
      <form className="comment__form">
        <textarea
          className="comment__textarea"
          onChange={onChange_comment}
          value={commentContent}
        />
        <button className="comment__btn" onClick={onSubmit_comment}>댓글</button>
      </form>
      }
      {mapComment}
      <br />

    </div>
  )
}

export default memo(Comment)