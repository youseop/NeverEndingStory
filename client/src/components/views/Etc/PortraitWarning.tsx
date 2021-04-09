import React,{useState} from "react";
import { Icon, message } from "antd";
import "./PortraitWarning.css"

function PortraitWarning() {
  const [reload,setReload]=useState(0);
  const onC =()=>{
    window.screen.orientation.lock('landscape')
    setReload(reload=>reload+1);
    message.info("click")
  }
  return (
    <div className="portraitWarning">
      <p>
        가로 화면으로 즐겨주세요 <Icon type="smile" />
      </p>
      <input type="button" value="Lock - portrait" onClick="lock('portrait')"/>
      <input type="button" value="Lock - landscape" onClick="lock('landscape')"/>

    </div>
  );
}

export default PortraitWarning;
