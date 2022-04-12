import axios from 'axios'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import SingleComment from './SingleComment'
import ReplyComment from './ReplyComment'

function Comment(props) {
    const videoId = props.postId
    const [commentValue, setcommentValue] = useState("")
    const user = useSelector(state => state.user)

    const handleClick = (event) => {
        setcommentValue(event.currentTarget.value)
    }

    const onSubmit = (event) => {
        event.preventDefault();

        const variables = {
            content: commentValue,
            writer: user.userData._id,   //글 작성자
            postId: videoId    //영상의 Id
        }

        axios.post('/api/comment/saveComment', variables)
            .then(response => {
                if(response.data.success) {
                    console.log(response.data.result)
                    setcommentValue("")
                    props.refreshFunction(response.data.result)

                }else {
                    alert('코멘트 저장 실패')
                }
            })
    }




    return (
        <div>
            < br />
            <p>Replies</p>
            {/* <h /> */}
            {/* Comment Lists */}
            {/* SingleComment에서 현재 댓글을 다 랜더링 시켜줌 */}
            {props.commentList && props.commentList.map((comment, index) => (
                (!comment.responseTo &&
                    <React.Fragment key={index}>
                        <SingleComment key={index} refreshFunction={props.refreshFunction} comment={comment} postId={props.postId}/>
                        <ReplyComment  refreshFunction={props.refreshFunction} parentCommentId={comment._id} postId={props.postId} commentList={props.commentList}/>
                    </React.Fragment>
                )
                
            ))}
            
            {/* Root Comment Form 여기는 댓글을 화면에 랜더링해주는 부분이 아니라 댓글 입력하는 부분을 그려줌 */}
            <form style={{display:'flex'}} onSubmit={onSubmit} >
                <textarea 
                    style={{ width:'100%', borderRadius: '5px' }}
                    onChange={handleClick}
                    value = {commentValue}
                    placeholder="코멘트 작성"
                />
                <br />
                <button style={{ width:'20%', height:'52px' }} onClick={onSubmit} >Submit</button>
            </form>
        </div>
    )
}

export default Comment
