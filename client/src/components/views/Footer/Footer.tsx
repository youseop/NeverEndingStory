import React, { useState } from "react";
import ContactUs from "./ContactUs"
import { useSelector } from "react-redux";
import "./Footer.css";

interface State_controlpage {
  controlpage: {
    footerOn: boolean;
  }
}

function Footer() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const footerOn: boolean = useSelector((state: State_controlpage) => state.controlpage.footerOn);

  const showModal = () => {
    setIsModalVisible(true);
  };
  
  if (footerOn) {
    return (
      <div className="footer-container">
        <div className="footer-info">
          <p>
            본 사이트는 SW정글사관학교에서의 교육적 목적으로 제작되었으며, 어떠한 상업적 이익도 취하지 않습니다.
        </p>
          <p>
            저작권 등 기타 문의는 <a onClick={() => showModal()}>이곳</a>으로 문의 가능합니다.
        </p>
          <ContactUs isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
        </div>
        <div className="footer-icons">
          <div className="jg-icon" onClick={() => { window.open("https://swjungle.net/") }}>
            <img className="jg-img" src="https://swjungle.net/static/image/logo.png" />
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="footer-container-off"/>
    )
  }
}

export default Footer;
