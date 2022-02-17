//원하는 페이지로 이동시켜주는 곳

import React from "react";
import { Suspense } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth'
import NavBar from "./components/views/NavBar/NavBar";
import Footer from "./components/views/Footer/Footer";
import VideoUploadPage from "./components/views/VideoUploadPage/VideoUploadPage";

function App() {
  return (
    <Router>
      <Suspense>
        <NavBar />
        <div style ={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px'}}>
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)}/>
            <Route exact path="/login" component={Auth(LoginPage, false)}/>
            <Route exact path="/register" component={Auth(RegisterPage, false)}/>
            <Route exact path="/video/upload" component={Auth(VideoUploadPage, true)}/>
          </Switch>
        </div>
        <Footer />
      </Suspense>
    </Router>
  );
}

export default App;