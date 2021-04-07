import React from "react";
import { Icon } from "antd";
import "./PortraitWarning.css"

function PortraitWarning() {
  return (
    <div className="portraitWarning">
      <p>
        가로 화면으로 즐겨주세요 <Icon type="smile" />
      </p>
    </div>
  );
}

export default PortraitWarning;
