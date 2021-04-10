import { Input, message } from 'antd';
import axios from 'axios';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SingleReply from './SingleReply';
import './SingleComment.css';


function SingleComment({gameId, comment, updateToggle_comment}) {
  const user = useSelector((state) => state.user);
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

  const reference = useRef();

  const [commentContent, setCommentContent] = useState("");
  const [Replys, setReplys] = useState([]);
  const [replyCnt, setReplyCnt] = useState(0);
  const [writeReply, setWriteReply] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editComment, setEditComment] = useState("");
  const [showComment, setShowComment] = useState(false);
  const [like, setLike] = useState(0);

  const updateToggle = () => {
    axios.get(`/api/comment/${gameId}/${comment._id.toString()}`)
      .then(response => {
        if (response.data.success) {
          setReplys(response.data.result);
        } else {
          message.error('대댓글을 불러오는데 실패했습니다.')
        }
    })
  }

  
  useEffect(() => {
    setLike(comment.like);
    setReplyCnt(comment.responseCnt);
  }, [])

  const onClick_writeReply = () => {
    setWriteReply((state) => !state);
  }

  const onClick_displayReply = () => {
    if (reference.current.style.display === 'block') {
      reference.current.style.display = 'none';
      setShowComment(false);
      setWriteReply(false);
    } else {
      axios.get(`/api/comment/${gameId}/${comment._id.toString()}`)
      .then(response => {
        if (response.data.success) {
          setReplys(response.data.result);
        } else {
          message.error('대댓글을 불러오는데 실패했습니다.')
        }
      })
      reference.current.style.display = 'block'
      setShowComment(true);
    }
  }
  
  const onChange_comment = (event) => {
    setCommentContent(event.currentTarget.value);
  }

  const onSubmit_response = (event) => {
    event.preventDefault();
    if(commentContent === ""){
      return;
    }
    const variables = {
      content: commentContent,
      writer: user.userData._id,
      gameId: gameId,
      responseTo: comment._id.toString()
    };

    axios.post('/api/comment/save-comment', variables).then(response => {
      if(response.data.success) {
        message.success('댓글 감사합니다!');
        updateToggle();
        
        setReplyCnt((state) => state+1);
        setCommentContent("");
        if (reference.current.style.display !== 'block') {
          reference.current.style.display = 'block'
          setShowComment(true);
        } 
      } else {
        message.error('댓글 저장에 실패했습니다.');
      }
    })
  }

  const onClick_removeComment = () => {
    setIsEdit(false);
    axios.post('/api/comment/remove-comment', {commentId: comment._id}).then(response => {
      if(response.data.success) {
        message.success('댓글이 삭제되었습니다.');
        updateToggle_comment();
        console.log('hey')
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
    axios.post('/api/comment/edit-comment', 
      {commentId: comment._id, comment: editComment}
    ).then(response => {
      if(response.data.success) {
        message.success('댓글이 수정되었습니다.');
        updateToggle_comment();
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

  const mapReply = Replys.map((reply, index) => {
    return (
      <div key={reply._id} style={{marginLeft:'10px'}}>
        {reply &&
          <SingleReply
            updateToggle_comment={updateToggle}
            gameId={gameId} 
            comment={reply}
            setReplyCnt={setReplyCnt}/>
        }
      </div>
    )
  })

  return (
    <div className="container_box" id={comment._id}>
      <div className="comment_container">
        <img src={comment.writer.image} alt="img" className="img"/>
        <div className="comment_contents">
          <div className="nickname">{comment.writer.nickname}</div>
          {isEdit ? 
          <div className="edit_container">
            <textarea className="singleComment_input" onChange={onChange_editcomment} value={editComment} />
            <button className="comment__btn" onClick={onClick_editComment}>수정</button>
          </div>
          :
          <div className="content">{comment.content}</div>
          }
          <div className="comment_info">
            <div onClick={onClick_like} className="comment_like">좋아요 : {like}</div>
            { replyCnt>0 ? 
            <>
            <div onClick={onClick_displayReply} className="comment_displayReplyToggle">
            { showComment ?
              <div>
                댓글 닫기
              </div>
              :
              <div>
                댓글 {replyCnt}개 보기
              </div>
            }
            </div>
            </>
            :
            <div></div>
            }
            <div onClick={onClick_writeReply} className="comment_option">{writeReply? "작성 취소" :"댓글 작성"}</div>
            { comment.writer._id === user_id&&
            <>
            <div onClick={onClick_toggleEdit} className="comment_option">{isEdit ? "수정 취소" : "댓글 수정"}</div>
            <div onClick={onClick_removeComment} className="comment_option">댓글 삭제</div>
            </>
            }
          </div>
          {(isAuth & writeReply) ?
          <form className="comment__form">
            <textarea
              className="singleComment__textarea"
              onChange={onChange_comment}
              value={commentContent}
              placeholder="코멘트를 작성해 주세요."
              />
            <button className="comment__btn" onClick={onSubmit_response}>댓글</button>
          </form> 
          :
          <div></div>
          }
        </div>
      </div>
      <div ref={reference} className="reply_container">
        {mapReply}
      </div>
    </div>
  )
}

export default memo(SingleComment)