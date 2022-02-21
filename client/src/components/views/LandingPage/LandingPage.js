//첫페이지 말 그대로 초기 화면
import React from 'react'
//import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { FaCode } from 'react-icons/fa';

function LandingPage(props) {
    return(
        <div>
            <div className ="app">
                <FaCode style={{fontSize:'4rem'}} /> <br/>
                <span style={{fontSize:'2rem'}}>전혀 성장하지 않았구나 쿠쿠로삥뽕</span>
            </div>
            <div style={{float:'right'}}>
                광잃구쿠무룩
            </div>
        </div>
    )
}

export default withRouter(LandingPage)
