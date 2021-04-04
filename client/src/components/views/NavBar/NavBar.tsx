import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import { Logo_Icon } from "../../svg/icon"
import "./Sections/Navbar.css";
import { useSelector } from "react-redux";

interface State_controlpage {
  controlpage: {
    navbarOn: boolean;
  }
}

function NavBar() {
  const [visible, setVisible] = useState<boolean>(false);
  const navbarOn: boolean = useSelector((state: State_controlpage) => state.controlpage.navbarOn);
  let style = {};

  const showDrawer = ():void => {
    setVisible(true);
  };

  const onClose = ():void => {
    setVisible(false);
  };
  
  if (navbarOn) {
    style = { position: "fixed", zIndex: 5, width: "100%" };
  } else {
    style = {
      position: "fixed",
      zIndex: 5,
      width: "100%",
      // transform: "translate(0,-69px)",
      opacity: 0,
      animation: "0.8s ease-out 0s 1 hide",
    };
  }
  
  return (
    <nav className="menu" style={style}>
      <div className="menu__logo">
        <Link to="/"><Logo_Icon/></Link>
      </div>
      <div className="menu__container">
        <div className="menu_rigth">
          <RightMenu mode="horizontal" />
        </div>
        <Button
          className="menu__mobile-button"
          type="primary"
          onClick={showDrawer}
        >
          <Icon type="align-right" />
        </Button>
        <Drawer
          title="이어봐"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default memo(NavBar);
