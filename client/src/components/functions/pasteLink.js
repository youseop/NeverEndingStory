import { message } from "antd";

export const pasteLink = (gameId) => {
  const url = window.location.href + "?invitation=true"
  // const url = `http://${}:3000/game/${gameId}?invitation=true`;
  let urlInput = document.createElement("input");
  document.body.appendChild(urlInput);
  urlInput['value'] = url;
  urlInput.select();
  document.execCommand("copy");
  document.body.removeChild(urlInput);
  message.info("링크가 복사되었습니다.")
}