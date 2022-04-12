import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Comment, Avatar, Button, Input } from 'antd'
import axios from 'axios';
import LikeDislikes from './LikeDislikes'

const { TextArea } = Input;

function SingleComment(props) {
    
    const videoId = props.postId
    const user = useSelector(state => state.user)
    const [OpenReply, setOpenReply] = useState(false)
    const [CommentValue, setCommentValue] = useState("")

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply)
    }
    const onHandleChange = (event) => {
        setCommentValue(event.currentTarget.value)
    }
    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: CommentValue,
            writer: user.userData._id,   //글 작성자
            postId: videoId,    //영상의 Id
            responseTo: props.comment._id
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    setCommentValue("")
                    setOpenReply(false)
                    props.refreshFunction(response.data.result)
                }else {
                    alert('코멘트 저장 실패')
                }
            })
    }

    const actions = [
        <LikeDislikes userId={localStorage.getItem('userId')} commentId={props.comment._id} />
        ,<span onClick={onClickReplyOpen} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
        <div>
            {/* 여기서 모든 댓글을 랜더링 시켜줌 */}
            <Comment 
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt/>}
                content={ <p>{props.comment.content}</p> }
            />

            {OpenReply &&
                <form style={{display:'flex'}} onSubmit={onSubmit} >
                    <TextArea 
                        style={{ width:'100%', borderRadius: '5px' }}
                        onChange={onHandleChange}
                        value={CommentValue}
                        placeholder="코멘트 작성"
                    />
                    <br />
                    <button style={{ width:'20%', height:'52px' }} onClick={onSubmit} >Submit</button>
                </form>
            }
        </div>
    )
}

export default SingleComment
