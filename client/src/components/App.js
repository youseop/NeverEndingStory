import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import Auth from "../hoc/auth";
// pages for this product
import LandingPage from "./views/LandingPage/LandingPage.js";
import LoginPage from "./views/LoginPage/LoginPage.js";
import RegisterPage from "./views/RegisterPage/RegisterPage.js";
import GameDetailPage from './views/GameDetailPage/GameDetailPage.js';
import GameUploadPage from "./views/GameUploadPage/GameUploadPage.js";
import GameUploadPage2 from "./views/GameUploadPage/GameUploadPage2.js";
import GamePlayPage from "./views/GamePlayPage/GamePlayPage.js";
import NavBar from "./views/NavBar/NavBar";
import Footer from "./views/Footer/Footer"

//null   Anyone Can go inside
//true   only logged in user can go inside
//false  logged in user can't go inside

function App() {
  return (
    <Suspense fallback={(<div>Loading...</div>)}>
      <NavBar />
      <div style={{ paddingTop: '69px', minHeight: 'calc(100vh - 80px)' }}>
        <Switch>
          <Route exact path="/" component={Auth(LandingPage, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/game/upload" component={Auth(GameUploadPage, true)} />
          <Route exact path="/game/upload2" component={Auth(GameUploadPage2, true)} />
          <Route path="/game/:gameId" component={Auth(GameDetailPage, null)} />
          <Route path="/gameplay/:gameId" component={Auth(GamePlayPage, null)} />
        </Switch>
      </div>
      <Footer />
    </Suspense>
  );
}

export default App;
