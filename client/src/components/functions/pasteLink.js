import { message } from "antd";

const config = require("../../config/key");

export const pasteLink = (gameId) => {
  // const url = window.location.href + "?invitation=true"
  const url = `${config.CLIENT}/game/${gameId}`;
  let urlInput = document.createElement("input");
  document.body.appendChild(urlInput);
  urlInput['value'] = url;
  urlInput.select();
  document.execCommand("copy");
  document.body.removeChild(urlInput);
  message.info("링크가 복사되었습니다.")
}