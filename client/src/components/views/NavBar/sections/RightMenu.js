import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";
import { Cookies } from "react-cookie";

const cookies = new Cookies()

function RightMenu(props) {
  //const user = useSelector(state => state.user)
  let logInID;

  if(cookies.get('x_auth')) {
    logInID = false;
  }else {
    logInID = true;
  }

  const logoutHandler = () => {
    axios.get(`/api/users/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (logInID) {
    console.log("test1")
    return (
      <div>
        <Menu mode={props.mode}>
          <Menu.Item key="signin">
            <a href="/login">Signin</a>
          </Menu.Item>
          <Menu.Item key="signup">
            <a href="/register">Signup</a>
          </Menu.Item>
        </Menu>
      </div>
    )
  } else {
    console.log("test2")
    return (
      <div>
        <Menu mode={props.mode}>
          <Menu.Item key="upload">
            <a href="/video/upload">video</a>
          </Menu.Item>

          <Menu.Item key="logout">
            <a onClick={logoutHandler}>Logout</a>
          </Menu.Item>
        </Menu>
      </div>
    )
  }
}

export default withRouter(RightMenu);