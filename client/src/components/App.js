import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch } from "react-router-dom";
import io from 'socket.io-client';

import Auth from "../hoc/auth";
import Valid from "../hoc/valid";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";

import LoginPage from "./views/LoginPage/LoginPage.tsx";
import RegisterPage from "./views/RegisterPage/RegisterPage.tsx";
import PassportRegisterPage from "./views/RegisterPage/PassportRegisterPage.tsx";
import Profile from './views/Profile/Profile.tsx';

import GameDetailPage from './views/GameDetailPage/GameDetailPage.js';
import GameUploadPage from "./views/GameUploadPage/GameUploadPage.js";
import GameBuildUpPage from "./views/GameUploadPage/GameBuildUpPage.js";
import GamePlayPage from "./views/GamePlayPage/GamePlayPage.js";
import SceneMakePage from "./views/Scene/SceneMakePage/SceneMakePage";

import NavBar from "./views/NavBar/NavBar.tsx";
import Footer from "./views/Footer/Footer.tsx"
import { LOCAL_HOST } from './Config';
import './App.css';
import PortraitWarning from './views/Etc/PortraitWarning';
import { useConstructor } from './functions/useConstructor';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_actions';
import LoadingPage from './views/GamePlayPage/LoadingPage';

const config = require('../config/key');
// export let socket = io(`http://${LOCAL_HOST}:5000`, {transports : ['websocket']});
export let socket = io(config.SOCKET, { transports: ['websocket'] });
export const MS_PER_HR = 360000

window.onpopstate = () => {
  window.location.reload();
};

function App() {
  const [loaded, setloaded] = useState(false);
  const dispatch = useDispatch();
  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);
  const handleResize = () => {
    const newState = window.matchMedia('(orientation: portrait)').matches;
    if (newState !== isPortrait)
      setIsPortrait(window.matchMedia('(orientation: portrait)').matches);
  }

  useConstructor(async () => {
    dispatch(auth()).then(()=>{
      setloaded(true);
    })
  })

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, [isPortrait])
  if (loaded) {
    return (
      <Suspense fallback={(<div>Loading...</div>)}>
        <NavBar />
        <div className="app">
          <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            <Route exact path="/login" component={Auth(LoginPage, false)} />
            <Route exact path="/register" component={Auth(RegisterPage, false)} />
            <Route exact path="/passport/register" component={Auth(PassportRegisterPage, false)} />
            <Route exact path="/profile/:userId" component={Auth(Profile, true)} />
            <Route exact path="/game/upload" component={Auth(GameUploadPage, true)} />
            <Route path="/game/:gameId" component={Auth(GameDetailPage, null)} />
            <Route path="/gameplay" component={isPortrait ? PortraitWarning : Valid(Auth(GamePlayPage, null))} />
            <Route exact path="/scene/make" component={isPortrait ? PortraitWarning : Valid(Auth(SceneMakePage, true))} />
          </Switch>
        </div>
        <Footer />
      </Suspense>
    );
  } else {
    return <LoadingPage />
  }
}

export default App;
