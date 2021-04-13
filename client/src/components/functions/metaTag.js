export default function setMetaTag({
  title = "이어봐",
  description = "함께 만드는 무한한 이야기",
  imageUrl = "https://i.imgur.com/PPWsg92.png",
}) {
  document
    .querySelector('meta[property="og:title"]')
    .setAttribute("content", `${title}`);

  document
    .querySelector('meta[property="og:description"]')
    .setAttribute("content", description);

  document
    .querySelector('meta[property="og:image"]')
    .setAttribute("content", imageUrl);

  document
    .querySelector('meta[property="og:url"]')
    .setAttribute("content", window.location.href);
}
