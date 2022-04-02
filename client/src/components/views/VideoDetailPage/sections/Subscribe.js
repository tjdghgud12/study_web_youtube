import axios from 'axios'
import React, { useEffect, useState } from 'react'

function Subscribe(props) {

    const [SubscribeNumber, setSubscribeNumber] = useState();
    const [Subscribed, setSubscribed] = useState(false)

    useEffect(() => {
        let variable = { userTo: props.userTo }
        axios.post('/api/subscribe/subscribeNumber', variable)
            .then(response => {
                if(response.data.success) {
                    setSubscribeNumber(response.data.subscribeNumber)
                }else {
                    alert('구독자 수 가져오기 실패!')
                }
            })
        let subscribedVariable = { userTo: props.userTo, userFrom: props.userFrom }
        axios.post('/api/subscribe/subscribed', subscribedVariable)
            .then(response => {
                if(response.data.success) {
                    //console.log(response.data.subscribed)
                    setSubscribed(response.data.subscribed)
                }else {
                    alert('subscribed 부분 실패!')
                }
            })
    })

    const onSubscribe = () => {
        let subscribeVariable = { userTo: props.userTo, userFrom: props.userFrom  }
        if(Subscribed) {
            //구독중
            axios.post('/api/subscribe/unSubscribe', subscribeVariable)
                .then(response => {
                    if(response.data.success) {
                        //여기 강사님은 -1 하라고 했지만, 제대로만드려면 그냥 값을 새로 받아서 입력하는게 맞는거같음.
                        setSubscribeNumber(SubscribeNumber - 1)
                        setSubscribed(!Subscribed)
                    }else {
                        alert('구독 버튼 off 실패!')
                    }
                })
        }else {
            //구독중 아님
            axios.post('/api/subscribe/subscribe', subscribeVariable)
            .then(response => {
                if(response.data.success) {
                    //여기 강사님은 -1 하라고 했지만, 제대로만드려면 그냥 값을 새로 받아서 입력하는게 맞는거같음.
                    setSubscribeNumber(SubscribeNumber + 1)
                    setSubscribed(!Subscribed)
                }else {
                    alert('구독 버튼 on 실패!')
                }
            })

        }
    }


    return (
        <div>
            <button 
                style={{ backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`, borderRadius:'4px', color:'white', padding:'10px 16px', 
                         fontWeight:'500', fontSize:'1rem', textTransform:'uppercase'
                }}
                onClick={onSubscribe}
            >
                {SubscribeNumber} {Subscribed ? 'Subscribed': 'Sbuscribe'}
            </button>
        </div>
    )
}

export default Subscribe
