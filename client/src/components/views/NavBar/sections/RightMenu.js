/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useSelector } from "react-redux";

function RightMenu(props) {
  const user = useSelector(state => state.user)

  const logoutHandler = () => {
    axios.get(`/api/users/logout`).then(response => {
      if (response.status === 200) {
        props.history.push("/login");
        window.localStorage.removeItem('userId')
      } else {
        alert('Log Out Failed')
      }
    });
  };

  if (user.userData && user.userData.isAuth) {   //유저 데이터가 있고, 유저 데이터의 isAuth가 false라면
    console.log("right1")
    return (
      <Menu mode="horizontal">
        <Menu.Item key="videoUpload">
          <a href="/video/upload">videoUpload</a>
        </Menu.Item>
        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    )
  } else {
    console.log("right2")
    console.log(user.userData)
    return (
      <Menu mode="horizontal">
        <Menu.Item key="mail">
          <a href="/login">Signin</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">Signup</a>
        </Menu.Item>
      </Menu>
    )
  }
}

export default withRouter(RightMenu);