import React from "react";
import { Icon } from "antd";
import "./PortraitWarning.css"

function PortraitWarning() {
  return (
    <div className="portraitWarning">
    아직 세로 화면은 지원하지 않습니다.<p />
가로 화면으로 즐겨주시면 감사하겠습니다. <Icon type="smile" />
</div>
  );
}

export default PortraitWarning;
