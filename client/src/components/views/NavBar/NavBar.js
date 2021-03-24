import React, { useState } from "react";
import LeftMenu from "./Sections/LeftMenu";
import RightMenu from "./Sections/RightMenu";
import { Drawer, Button, Icon } from "antd";
import "./Sections/Navbar.css";
import { useSelector } from "react-redux";

function NavBar() {
  const [visible, setVisible] = useState(false);
  const navbarOn = useSelector((state) => state.controlpage.navbarOn);
  let style = {};

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
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
        <a href="/">REGANOP</a>
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
          title="REGANOP"
          placement="right"
          className="menu_drawer"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          {/* <LeftMenu mode="inline" /> */}
          <RightMenu mode="inline" />
        </Drawer>
      </div>
    </nav>
  );
}

export default NavBar;
