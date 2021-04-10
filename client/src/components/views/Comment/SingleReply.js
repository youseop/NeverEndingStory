import axios from 'axios';
import React, { memo, useEffect, useState } from 'react';
import { Input, message } from 'antd';
import { useSelector } from 'react-redux';
import './SingleReply.css';

function SingleReply({comment, updateToggle_comment, gameId, setReplyCnt}) {
  const isAuth = useSelector((state) => {
    if (state.user.userData){
      return state.user.userData.isAuth;
    } else {
      return null;
    }
  });
  const user_id = useSelector((state) => {
    if (state.user.userData){
      return state.user.userData._id;
    } else {
      return null;
    }
  });

  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [like, setLike] = useState(comment.like);
  const [content, setContent] = useState(comment.content);

  const onClick_removeComment = () => {
    setIsEdit(false);
    axios.delete(`/api/comment/${comment._id}/${gameId}`).then(response => {
      if(response.data.success) {
        message.success('댓글이 삭제되었습니다.');
        updateToggle_comment();
        setReplyCnt((state) => state-1)
      } else {
        message.error('댓글 삭제에 실패했습니다.');
      }
    })
  }

  const onClick_toggleEdit = () => {
    setIsEdit((state) => !state);
    setEditComment(comment.content);
  }

  const onChange_editcomment = (event) => {
    setEditComment(event.currentTarget.value);
  }

  const onClick_editComment = (e) => {
    e.preventDefault();
    axios.patch(`/api/comment/${comment._id}/${editComment}`)
    .then(response => {
      if(response.data.success) {
        message.success('댓글이 수정되었습니다.');
        setContent(editComment)
      } else {
        message.error('댓글 수정에 실패했습니다.');
      }
    })
    setIsEdit((state) => !state);
  }

  const onClick_like = () => {
    if(isAuth === false){
      return
    }
    const like_variable = {
      gameId: gameId,
      userId: user_id,
      commentId: comment._id
    }
    axios.post('/api/like/', like_variable).then(response => {
      if (response.data.success) {
        if(response.data.isClicked){
          setLike((state) => state+1);
        } else {
          setLike((state) => state-1);
        }
      } else {
        message.error('좋아요를 불러오는데 실패했습니다.')
      }
    })
  }

  return (
    <div className="container_box" id={comment._id}>
      <div className="comment_container">
        <img src={comment.writer.image} alt="img" className="SingleReply__img"/>
        <div className="comment_contents">
          <div className="SingleReply__nickname">{comment.writer.nickname}</div>
          {isAuth &isEdit ? 
          <div className="edit_container">
          <textarea className="comment_input" onChange={onChange_editcomment} value={editComment} />
          <button className="comment__btn" onClick={onClick_editComment}>수정</button>
          </div>
          :
          <div className="SingleReply__content">{content}</div>
          }
          <div className="SingleReply__comment_info">
          <div onClick={onClick_like} className="comment_like">좋아요 : {like}</div>
            { comment.writer._id === user_id&&
            <>
            <div onClick={onClick_toggleEdit} className="comment_option">{isEdit ? "수정 취소" : "댓글 수정"}</div>
            <div onClick={onClick_removeComment} className="comment_option">댓글 삭제</div>
            </>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(SingleReply)