import React, { useEffect, useState } from 'react'
import { Tooltip } from 'antd'
import { LikeFilled, DislikeOutlined, LikeOutlined, DislikeFilled } from '@ant-design/icons'
import axios from 'axios'


function LikeDislikes(props) {

    const [Likes, setLikes] = useState()
    const [LikeAction, setLikeAction] = useState(null)
    const [DisLikes, setDisLikes] = useState()
    const [DisLikeAction, setDisLikeAction] = useState(null)
    let variable

    if(props.video){
        variable = { videoId: props.videoId , userId: props.userId }
    } else {
        variable = { commentId: props.commentId , userId: props.userId }
    }
    

    useEffect(() => {
        axios.post('/api/like/getLikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 1. 얼마나 많은 좋아요를 받았는지. and 내가 이미 좋아요를 눌렀는지
                    setLikes(response.data.likes.length)
                    if(response.data.likes.length) {
                        response.data.likes.map(like => {
                            if(like.userId === props.userId) {
                                setLikeAction('liked')
                            }
                        })
                    }
                    
                }else {
                    alert('좋아요 실패!')
                }
            })

        axios.post('/api/like/getDislikes', variable)
            .then(response => {
                if(response.data.success) {
                    // 1. 얼마나 많은 좋아요를 받았는지. and 내가 이미 좋아요를 눌렀는지
                    setDisLikes(response.data.dislikes.length)
                    if(response.data.dislikes.length) {
                        response.data.dislikes.map(dislike => {
                            if(dislike.userId === props.userId) {
                                setDisLikeAction('disliked')
                            }
                        })
                    }
                }else {
                    alert('싫어요 실패!')
                }
            })
    }, [])

    const onLike = () => {
        if( LikeAction === null ) {
            axios.post('/api/like/uplike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes+1)
                        setLikeAction('liked')

                        if(DisLikeAction !== null ) {
                            setDisLikeAction(null)
                            setDisLikes(DisLikes-1)
                        }
                    }else { 
                        alert('좋아요 누르기 실패!')
                    }
                })
        }else {
            axios.post('/api/like/unlike', variable)
                .then(response => {
                    if(response.data.success) {
                        setLikes(Likes-1)
                        setLikeAction(null)
                    }else { 
                        alert('좋아요 취소 실패!')
                    }
                })
        }
    }


    const onDislike = () => {
        if( DisLikeAction === null ) {
            axios.post('/api/like/updislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDisLikes(DisLikes+1)
                        setDisLikeAction('disliked')

                        if(LikeAction !== null ) {
                            setLikeAction(null)
                            setLikes(Likes-1)
                        }
                    }else { 
                        alert('싫어요 누르기 실패!')
                    }
                })
        }else {
            axios.post('/api/like/undislike', variable)
                .then(response => {
                    if(response.data.success) {
                        setDisLikes(DisLikes-1)
                        setDisLikeAction(null)
                    }else { 
                        alert('싫어요 취소 실패!')
                    }
                })
        }
    }



    const LikeComponent = LikeAction === 'liked'? <LikeFilled onClick={onLike} />: < LikeOutlined onClick={onLike} />
    const DisLikeComponent = DisLikeAction === 'disliked'? <DislikeFilled onClick={onDislike} />: < DislikeOutlined onClick={onDislike} />

    return (
        <div>
            <span key="comment-basic-like">
                <Tooltip title="Like">
                    {LikeComponent}
                </Tooltip>
                <span style={{ paddingRight: '8px', paddingLeft:'8px', cursor:'auto' }}>{Likes}</span>
            </span>&nbsp;&nbsp;

            <span key="comment-basic-dislike">
                <Tooltip title="Dislike">
                    {DisLikeComponent}
                </Tooltip>
                <span style={{ paddingLeft:'8px', cursor:'auto' }}>{DisLikes}</span>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
        </div>
    )
}

export default LikeDislikes
