import { Card, Row, Typography, Avatar, Col } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaCode } from 'react-icons/fa';
import moment from 'moment';

const { Title } = Typography
const { Meta } = Card

function SubscriptionPage() {
        
    const [Videos, setVideos] = useState([])

    useEffect(() => {
        const SubscriptionVariable = { 
            userFrom: localStorage.getItem('userId')
         }
        //[input] <= 이게 없으면 이 함수 계속 실행. 만약 있다면 dom이 업데이트 될때 한번 만 실행
        axios.post('/api/video/getSubscriptionVideos', SubscriptionVariable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data.videos)
                    setVideos(response.data.videos)
                }else {
                    alert('비디오 가져오기 실패')
                }
            })
    
    }, [])

    const renderCards = Videos.map((video, index) => {

        var minutes = Math.floor(video.duration / 60);
        var seconds = Math.floor((video.duration - minutes*60));

        return <Col key={index} lg={6} md={8} xs={24}>
                <a href={`/video/${video._id}`}>
                    <div style={{ position: 'relative' }}>
                        <img style={{ width:'100%' }} src={`http://localhost:5000/${video.thumbnail}`} />
                        <div className="duration">
                            <span>{minutes} : {seconds} </span>
                        </div>
                    </div>
                </a>
                <br />
                <Meta
                    avatar={ <Avatar src={video.writer.image} /> } 
                    title={video.title}
                    description="" 
                />
                <span>{video.writer.name}</span><br/>
                <span style={{ marginLeft:'3rem' }}>{video.views} views</span> - <span> {moment(video.createdAt).format("MMM Do YY")} </span>
            </Col>
    })
    
    return(
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <Title level={2}> Recommended </Title>
            <hr />
            <Row gutter={[32, 16]}>
                {renderCards}


            </Row>
            
        </div>
    )
}

export default SubscriptionPage
