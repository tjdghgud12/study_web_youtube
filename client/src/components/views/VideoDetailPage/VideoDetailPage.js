import React, { useEffect, useState } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import axios from 'axios';
import SideVideo from './sections/SideVideo';   
import Subscribe from './sections/Subscribe';
import Comment from './sections/Comment';
import LikeDislikes from './sections/LikeDislikes'


function VideoDetailPage(props) {

    const videoId = props.match.params.videoId
    const variable = { videoId: videoId }

    const [VideoDetail, setVideoDetail] = useState([])
    const [Comments, setComments] = useState([])

    useEffect(() => {
        axios.post('/api/video/getvideoDetail', variable)
            .then(response => {
                if(response.data.success) {
                    setVideoDetail(response.data.videoDetail)
                }else{
                    alert('비디오 정보 가져오기 실패')
                }
            })
            axios.post('/api/comment/getComment', variable)
                .then(response => {
                    if(response.data.success) {
                        setComments(response.data.comments)
                        //console.log(response.data.comments)
                    }else {
                        alert('커맨트 가져오기 실패!')
                    }
                })
    }, [])

    const refreshFunction = (newComment) => {
        setComments(Comments.concat(newComment))
    }


    if(VideoDetail.writer) {

        const SubscribeButton = ((VideoDetail.writer._id !== localStorage.getItem('userId')) && <Subscribe userTo={VideoDetail.writer._id} userFrom={localStorage.getItem('userId')} />)

        return (
            <Row gutter={[16, 16]}>
                <Col lg={18} xs={24}>
                    <div style={{ width:'100%', padding:'3rem 4rem' }}>
                        <video style={{ width:'100%' }} src={`http://localhost:5000/${VideoDetail.filePath}`} controls/>
                        <List.Item 
                            actions={[<LikeDislikes video  userId={localStorage.getItem('userId')}  videoId={videoId} />, SubscribeButton]}
                        >
                            <List.Item.Meta 
                                avatar={<Avatar src={VideoDetail.writer.image} />}
                                title={VideoDetail.writer.name}
                                description={VideoDetail.description}
                            />
                        </List.Item>
                        {/* comments */}
                        <Comment refreshFunction={refreshFunction} commentList={Comments} postId={videoId} />
                    </div>
                </Col>
    
                <Col lg={6} xs={24}>
                    <SideVideo />
                </Col>
            </Row>
        )
    }else {
        return <div>....Loading</div>
    }

   
}

export default VideoDetailPage
