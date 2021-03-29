import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
import Valid from "../hoc/valid";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import TestPage from "./views/LandingPage/TestPage.js";

import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import Profile from './views/Profile/Profile';

import GameDetailPage from './views/GameDetailPage/GameDetailPage.js';
import GameUploadPage from "./views/GameUploadPage/GameUploadPage.js";
import GameBuildUpPage from "./views/GameUploadPage/GameBuildUpPage.js";
import GamePlayPage from "./views/GamePlayPage/GamePlayPage.js";
import SceneMakePage from "./views/Scene/SceneMakePage/SceneMakePage";
import SceneMakePage2 from "./views/Scene/SceneMakePage/SceneMakePage2";

import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"
import { LOCAL_HOST } from './Config';

import './App.css';

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

const io = require('socket.io-client');
export let socket = io(`http://${LOCAL_HOST}:5000`);

window.onpopstate = () => {
  window.location.reload();
};
function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div className="app">
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/profile" component={Auth(Profile, true)} />
          <Route exact path="/game/upload" component={Auth(GameUploadPage, true)} />
          <Route path="/game/:gameId" component={Auth(GameDetailPage, null)} />
          <Route path="/gameplay" component={Valid(Auth(GamePlayPage, null))} />
          <Route exact path="/scene/make2" component={Valid(Auth(SceneMakePage, true))} />
          <Route exact path="/scene/make" component={Valid(Auth(SceneMakePage2, true))} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
