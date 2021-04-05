import React from "react";

const svg = {
  arrow_1:
    "M-1.73589e-06 5.2875L16.6883 22.5L-2.31124e-07 39.7125L5.13765 45L27 22.5L5.13765 -2.24574e-07L-1.73589e-06 5.2875Z",
  playIcon_1: "M0.497437 0.796925V17.5524L15.8567 9.17468L0.497437 0.796925Z",
  close_1:
    "M11 0C4.917 0 0 4.917 0 11C0 17.083 4.917 22 11 22C17.083 22 22 17.083 22 11C22 4.917 17.083 0 11 0ZM16.5 14.949L14.949 16.5L11 12.551L7.051 16.5L5.5 14.949L9.449 11L5.5 7.051L7.051 5.5L11 9.449L14.949 5.5L16.5 7.051L12.551 11L16.5 14.949Z",
  close_2:
    "M10 0.600006C4.47 0.600006 0 5.07001 0 10.6C0 16.13 4.47 20.6 10 20.6C15.53 20.6 20 16.13 20 10.6C20 5.07001 15.53 0.600006 10 0.600006ZM15 14.19L13.59 15.6L10 12.01L6.41 15.6L5 14.19L8.59 10.6L5 7.01001L6.41 5.60001L10 9.19001L13.59 5.60001L15 7.01001L11.41 10.6L15 14.19Z",
  search_1:
    "M24.2996 21.3836H22.7639L22.2196 20.8588C24.1246 18.6427 25.2716 15.7656 25.2716 12.6358C25.2716 5.65695 19.6146 0 12.6358 0C5.65695 0 0 5.65695 0 12.6358C0 19.6146 5.65695 25.2716 12.6358 25.2716C15.7656 25.2716 18.6427 24.1246 20.8588 22.2196L21.3836 22.7639V24.2996L31.1035 34L34 31.1035L24.2996 21.3836ZM12.6358 21.3836C7.79531 21.3836 3.88794 17.4763 3.88794 12.6358C3.88794 7.79531 7.79531 3.88794 12.6358 3.88794C17.4763 3.88794 21.3836 7.79531 21.3836 12.6358C21.3836 17.4763 17.4763 21.3836 12.6358 21.3836Z",
};

export function SVG(props) {
  const { src, color, width, height } = props;
  return (
    <svg
      width={width ? width : "auto"}
      height={height ? height : "auto"}
      viewBox="0 0 45 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={svg[src]} fill={color} />
    </svg>
  );
}

export function Relay_Icon() {
  return (
    <svg
      height="270px"
      width="270px"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 96 96"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <circle cx="85" cy="19.6" r="6"></circle>
          <path d="M59,52.4c-0.1-0.2-0.4-0.1-0.5,0.1l-2.9,9.3c-0.1,0.4-0.5,0.8-0.9,0.8L45,63.9c-0.6,0.1-1,0.6-1,1.2v1c0,0.6,0.5,1,1,1.1    l12.2,0.4c0.8,0,1.6-0.4,2-1.1l4.4-7.6c0.1-0.2,0.1-0.5-0.1-0.7L59,52.4z"></path>
          <path d="M84.1,37.8c-0.3-0.3-0.4-0.6-0.4-1l0.2-5.9c0-0.7-0.1-1.4-0.4-2l-0.2-0.5c-0.1-0.1-0.1-0.3-0.2-0.4    c-1.4-1.7-3.4-2.9-5.6-3.4l-0.8-0.2c-0.4-0.1-0.9-0.1-1.3-0.1l-8.7,0.2c-1.2,0-2.3,0.6-3.1,1.5l-5.4,6.9c-0.6,0.8-0.5,1.9,0.3,2.5    l0.1,0.1c0.6,0.4,1.4,0.4,1.9-0.2l4.9-4.8c0.4-0.4,0.9-0.5,1.4-0.4l3.3,0.7c0.3,0.1,0.4,0.4,0.3,0.7L69.5,33c0,0-4.9,6.7-8.1,11.4    c-1.7,2.5-1.5,5.7,0.4,8l3.3,4l4.9,6.4c0.5,0.6,0.6,1.4,0.4,2.2l-2.9,10.7c-0.3,1,0.4,1.9,1.5,2l0.6,0c0.7,0,1.3-0.3,1.5-0.9    l5.8-12.5c0.5-1.1,0.5-2.4-0.1-3.4l-6.2-11.7c-0.5-0.9-0.4-2,0.3-2.8l4.9-6.2l1.1-0.4c0.9-0.3,1.6-0.9,2.1-1.6v1.1    c0,0.8,0.4,1.6,1,2l7.1,5c0.7,0.5,1.6,0.5,2.3,0c1.1-0.9,1.1-2.6,0.1-3.5L84.1,37.8z"></path>
          <circle cx="44.2" cy="19.8" r="6.3"></circle>
          <path d="M45,51.2l1-1.6c0.1-0.2,0.1-0.4-0.1-0.5l-2.4-1.4c-0.2-0.1-0.4,0-0.5,0.1l-0.9,1.4c-0.1,0.2-0.1,0.4,0.1,0.5l2.3,1.5    C44.7,51.4,44.9,51.4,45,51.2z"></path>
          <path d="M47.8,41.1l2.1,1.7c0.2,0.1,0.4,0.1,0.6-0.1l3.1-4.9c0.1-0.2,0.1-0.4-0.1-0.5l-2.3-1.5c-0.2-0.1-0.4-0.1-0.5,0.1l-3,4.7    C47.6,40.8,47.6,41,47.8,41.1z"></path>
          <path d="M28.6,53.7c-0.2-0.2-0.6-0.2-0.7,0.1l-3.5,6.5c-0.2,0.3-0.1,0.7,0.2,0.9l2.5,1.9c0.3,0.3,0.5,0.7,0.4,1.1l-2.9,10.5    c-0.3,1,0.5,2,1.5,2.1l0.7,0c0.7,0,1.3-0.4,1.6-1l5.8-12.4c0.7-1.5,0.4-3.3-0.7-4.5L28.6,53.7z"></path>
          <path d="M48.8,47.8c1.2-0.9,1.2-2.7,0.1-3.6L43.3,39c-0.3-0.3-0.4-0.6-0.4-1l0.2-6.2c0-0.7-0.1-1.5-0.4-2.1L42.5,29    c-0.1-0.1-0.1-0.3-0.2-0.4c-1.5-1.8-3.6-3.1-5.9-3.6l-0.8-0.2c-0.5-0.1-0.9-0.1-1.4-0.1L25,25c-1.3,0-2.5,0.6-3.2,1.6l-5.6,7.2    c-0.6,0.8-0.5,2,0.4,2.6l0.1,0.1c0.6,0.5,1.5,0.4,2-0.2l5.2-5c0.4-0.4,0.9-0.5,1.5-0.4l3.5,0.7c0.3,0.1,0.5,0.4,0.3,0.7l-1.1,1.6    l-7.9,10.4l0,0c-3,3.7-4.9,8.1-5.7,12.7l-1,5.9c-0.1,0.5-0.5,0.8-1,0.9l-10,1.5c-0.6,0.1-1.1,0.6-1.1,1.2v1.1    c0,0.6,0.5,1.1,1.1,1.1l12.8,0.5c0.8,0,1.6-0.4,2-1.1l9.5-16.3l7.1-9.2l0,0l1.6-0.5c1.1-0.4,2-1.2,2.5-2.3l0.1-0.2v0.9    c0,0.8,0.4,1.6,1.1,2.1l7.4,5.3C47.2,48.3,48.2,48.3,48.8,47.8z"></path>
        </g>
      </g>
    </svg>
  );
}

export function Ending_Icon() {
  return (
    <svg
      height="270px"
      width="270px"
      fill="#000000"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      xmlSpace="preserve"
    >
      <g>
        <ellipse fill="#000000" cx="22.3" cy="6.3" rx="4.6" ry="4.3"></ellipse>
        <path
          fill="#000000"
          d="M46.8,23.7c-0.4-0.2-9.3-5.8-25.1-1.4c-14,3.9-18.6-0.7-18.7-0.8c-0.5-0.6-1.4-0.6-2-0.1   c-0.6,0.5-0.7,1.4-0.1,2c0.2,0.2,3,3.3,10.7,3.3c2.9,0,6.5-0.5,10.9-1.7c14.4-4.1,22.7,1,22.7,1c0.7,0.4,1.6,0.2,2-0.4   C47.7,25,47.5,24.1,46.8,23.7z"
        ></path>
        <path
          fill="#000000"
          d="M13,21.7c0.1,0,0.2,0,0.3,0c1.1-0.1,2-1.1,1.9-2.2c0.1-0.3,0.7-1,2.8-1.4V21c0,0,7.4-2.1,10.3-2.3l0-2.3   c5.4-2.3,7.1-8.2,7.5-11.6c0.1-1.1-0.7-2.2-1.9-2.3c-1.2-0.1-2.3,0.7-2.4,1.8c0,0.4-1.2,9.2-8.8,9.2c-0.1,0-0.1,0-0.2,0   c-5-0.1-8.4,0.8-10.3,2.7c-1.5,1.6-1.3,3.2-1.3,3.5C11,20.9,11.9,21.7,13,21.7z"
        ></path>
        <path
          fill="#000000"
          d="M28,25.8L18,28l-0.2,2.3c-0.1,0.9-0.5,2.2-0.8,2.3c0,0-1.1,0.1-3.8-2.7C12.3,29,10.9,29,10,29.7   c-0.9,0.8-1,2.1-0.1,2.9c1,1.1,3.9,4.1,7.1,4.1c0.5,0,1-0.1,1.5-0.2c2.9-1,4.8-5.4,4.9-6.6l4.1,7.1l-2,6.4   c-0.3,1.1,0.3,2.2,1.5,2.6c0.2,0.1,0.4,0.1,0.6,0.1c1,0,1.8-0.6,2.1-1.5l2.2-7.1c0.1-0.5,0.1-0.9-0.1-1.4L28,25.8z"
        ></path>
      </g>
    </svg>
  );
}

export function Logo_Icon() {// 1049 * 536 기본
  return (
    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
      width="70px" height="35px" viewBox="0 0 1049 536" enableBackground="new 0 0 1049 536" xmlSpace="preserve">
      <image id="image0" width="1049" height="536" x="0" y="0"
        xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABBkAAAIYCAQAAACC+vzmAAAABGdBTUEAALGPC/xhBQAAACBjSFJN
                                          AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ
                                          cwAALEoAACxKAXd6dE0AAAAHdElNRQflBAQOHB7mWVwyAAAoI0lEQVR42u3d4XnTyNoG4Bcu/sen
                                          gngrwFsBogJ8KsBUsNkKMBVsqGBNBWsqQKlgnQrWqeDYFXB+AEsCcSJ7Rh5Jvu9zfddCYr1+pQ/w
                                          k9Fo5snnAOAHo5hkrVf3ostVbFrpk4F4VroBgA6axKes9Z70osuXLUUbBuJp6QYAgD4QGQCABkQG
                                          AKABkQEAaEBkAAAaEBkAgAZEBgCgAZEBAGhAZAAAGhAZAIAGRAYAoAGRAQBoQGQAABoQGQCABkQG
                                          AKABkQEAaEBkAAAaEBkAgAZEBgCgAZEBAGhAZAAAGhAZAIAGRAYAoAGRAQBoQGQAABoQGQCABkQG
                                          AKABkQE41Ofs/5uXPiVgN5EBAGhAZAAAGhAZAIAGRAYAoAGRAQBoQGQAABoQGQCABkQGAKCBZ6Ub
                                          4MguY5K54iouSp8UAO0TGU7NJF6UbgFOUNVK1Unp0+K0iAwA7ftUugFIZy4DANCAyAAANCAyAAAN
                                          iAwAQAMiAwDQgMgAADQgMgAADYgMAEADIgMA0IDIAAA0IDIAAA2IDABAAyIDANCAyAAANCAyAAAN
                                          iAwAQAMiAwDQgMgAADQgMgAADYgMAEADIgMA0IDIAAA0IDIAAA2IDABAAyIDANCAyAAANCAyAAAN
                                          iAwAQAMiAwDQwLPSDQBwwsYxzl6zLn1SQyUyAFDOLN5mr/mk9EkNlRsTAEADIgMA0IDIAAA0IDIA
                                          AA2IDABAAyIDANCAhywB2veularjeF36xDglIgNA++atVK1EBo7JjQkAoAGRAQBoQGQAABoQGQCA
                                          BkQGAKABkQEAaEBkAAAaEBkAgAZEBgCgAZEBAGhAZAAAGhAZAIAGRAYAoAGRAQBoQGQAABoQGQCA
                                          BkQGAKABkQEAaEBkAAAaEBkAgAZEBgCgAZEBAGjgWekGihjF5Iev1KVboohJjO78fh3r0i0BdNWp
                                          RIZxTGISkxjFJM52vGYbq1jHOupYxaZ0w7SkikmMYxKjeL7zNdexifrrnwUAvhp6ZBjHNKqodsaE
                                          287iRbyIiLcRcRN11FH7mXMwqpjGJF40eu3ziH9fefX1TwKnZpO5Xt1Kl6OWrwLcMdzIMIlZTOP8
                                          wKPP43W8jojrqGMRq9Inw8FGMY1pw9B4nxfxIt7GNupYxtLo0wlZZa7XLK5Cpw0xMoxiFrMHhp33
                                          8Tyex29xHYtY+LjonSpmMT04LNx2Fq/iVVzGMhZGHIBTNbQnJsaxiP/FH5kCwzfP449YxyLGpU+P
                                          xmaxjk/xOktg+OYsXsenWMes8LlV8bkj/xu269INQNcMKTJUUcc/8bql6mfxOv6JxU/PWtA9s1jH
                                          nwfflHrMefwZm5i7izx4m9INQNcMJTKMYxGfjnC38HX8bbSh09qNC9+cxdsOjDbQrrp0A9A1Q4gM
                                          o5i3OLrws9fxj58xO6mK1RHiwjdn8Wesoyp90rRmVboB6Jr+R4ZprOLt0d/1baxiWvrUuWUUl/Ep
                                          8xyWx53Hp1iIjwO1Kt0AdE2/I8MolvHX0X6qvOs8/vJh0RlVrOO3Qu/9Otbi4yCt46Z0C9AtfY4M
                                          k1jFq6IdvI6V6ZAdcBmfsj4Zsa+z+CsuS18EWrAs3QB0S38jw0X8XWh84bbz+DsuSjdx0saxKja+
                                          cNtvsTItdnDq0g1At/QzMoxiEX+UbuJff8SidAsnaxKro89f2OW5MafBWca2dAvQJX2MDKOoj/h8
                                          RBOvY2VWQwGz+LvoDYkfncXfHrwcmEXpBqBL+hcZRlF35ufK755HLTQc2Sz+LN3CPf4UGgZlUboB
                                          6JK+RYZJrDsYGCKEhmPrZmCIEBqGZRVXpVuA7uhXZJhE3amB6LuEhuPpbmCIEBqGZV66AeiOPkWG
                                          USw6HBgihIZj6XZgiBAahqQ2zgDf9CcydHMOw4+EhvZ1PzBECA1DMi/dAHRFfyLDsgeBISLiuUV9
                                          WjXpRWCIiLj0yOVAGGeAr/oSGS6PsEtlLq8t7tSacY8W1zkz4jQYs9INQDf0IzLMOrG+X3N/2N+w
                                          JcuOz2a568yCwwOxjnelW4Au6ENkGPdwqH/p58sWXPbk5tR3L9wHH4h5XJduAcrrQ2To10+WX5xZ
                                          Aia7qmdjTV+8NeI0EFOLR0P3I8O8dz9ZfvHKhshZjXobwmyRPgxrMxqg65FhHG9Lt3AwHxU5zTuw
                                          b+lhzk2HHYilGQ2cuq5HhkXpBhKc9XAORlf186bEN29tiz0Q8/hQugUoqduRYdqjRyvv89qT+Zlc
                                          lm4g0aJ0A2QyExo4Zd2ODJelG3AGnTDr6XyW716YBDkYQgMnrMuRYdbbu9ff+ajIYV66AefALUID
                                          J6vLkeGydANZzEs30HtDiI7C47DMTITkNHU3Msx6uBrDfXxUpJqXbsB58JN5/Nc6DZye7kaGeekG
                                          srko3UCvDWOMIUJ4HJplTKwIyanpamSYDuaDIuKVR+wSzEo34FzYYR2TeGesgVPS1cgwK92As+mE
                                          Sc8fs73rtcW9Bmcek/hYugk4lm5GhnG8Kt1CVrPSDfTWrHQDzodHrGMaL+OqdBtwDN2MDNPSDWR2
                                          PrgzOpZZ6QacDw3UUcVLow0MXzcjw6x0A9lNSzfQS9OBPDXz3XPzWgarjmn8Eu/jpnQj0J4uRoZx
                                          79f6+1lVuoFempZuwDmxl3VcxDh+jXeepWCYnpVu4B7T1t/hOpZRxyZWETGJUVQxaXn2xHlMYtX6
                                          eQ1N1XL9bSyjjnWsYhOjmMQ4Jq0/qzMdyBJl7LaKVcxjFJOoYhzjmAxutIyT1cXIULVa/UPMY33r
                                          96uIqCNiFBdx0eJf7anIsKdJqx/eNzG/s1nUJuqIiLiIKuYtPqcxpCdAeMgm6q9/pr4YxSQ+ZX+X
                                          l5nrrVq8IgzAaUWG65jt/CuxiXlcxry1TZbbO6uhqlqs/e6BpcLqqKKKy9Zuj1V3Pkg4FZtW/v/e
                                          Rk3YqXtzGdobxPvw6M2BTVzEy5aWZvHT5b6qlupu49dH1xato2pt66G2zgugZd2LDFVLdd80fA6j
                                          jqql0DBp6cyGatJK1ZuoGg2+blrbr7BqpSpA67oXGSatVH1/5771w1YthYZ2zmyoRq3MZNjuNaek
                                          ndAwSa5Qx5OO/A84Kd2byzBuoebVnltDrWIWf/XizIZr0krVfSehzmKSfU7DWYxi08rZAV9UR3yv
                                          zSlNGu1eZMh/z397wGOby/gQrzP3UWU/syGrWqj5/oDJYtNYZZ9dMzFpDVqV/9mU3a5O6d/2rt2Y
                                          GLdQc37Qz3QX2W9OjFo4t+EaZa+4PWhD9XUL6yiMs1cEOILhR4abA//J32T/qBjempZtmmSveHHg
                                          7YDL7OFxnP3cAI6ga5FhlL3i5cFHLopdBfLbxvLAIzfZ/ySMi14JgAN1LTJMsldcHnzkOvuGtlX2
                                          sxuu3HNalglTDheZexlnrgdwFF2LDLld31kcel/L0u2TzTLh2FVLK3UA9MrQI8My6ehV6fbJpk46
                                          elW6fYDyhh4Z1klHr0q3TybbxJUQ6tInAFCeyPCQTen2yWRVuoE7JqUbADjE0CMDdE97W6wDtEhk
                                          4BSMSjdwx3XpBgAOMfTIUCUdPSndPpmkLqM1ztrNptRlAEgx9MgwKXg0XTIpeDTAIAw9MlQFj6ZL
                                          qoRjRxb7BuheZFhnrnd2wC6W36Uce4yzG7LcK2/OEo6dZu5lnbkewFEMPTKkfFTMss9sz392NPU8
                                          YZzhInMv64LXAeBgw48Mrw6+Dz0reB1YZa84P/C4KvttiXX2cwM4guFHhkP3spxl3xgp91D7sG2y
                                          V3xx4DjDZfZO1tkrAhxB1yJDG8+svzhgYHnUwgfFJnvFIatbqLk4YH2GeQtTH9s4N4DWdS8yrFqo
                                          Od/75sSyhRX62jiz4Vq3UPN8722sJ/E2exc3LZwZwBGcRmQ4i3qv0LDIflOirTMbrnUrG06/2is0
                                          TFoZD2ijJsARdC8y1K1U3Sc0LOJ1Kz2sWqk6XHUrVV83Dg2TqFvZDWLVynkBtK57kWHVyk+XX0LD
                                          7NFXTWLVUmDYmvS2p7qluq+jbrAA9EX83dL2UW2dF0DLuhcZ2vsn9Sz+fPDDYhTz+Lu1df7aOqvh
                                          qlur/CJWDz5yWcUq/mjpvW+MMgB91cXIsGyx9ov4J+qY/TBzfhTTWMS6halu361arD1MqxYnCp7F
                                          29jE5U83q8ZxEav41OIC0XVrlQFa9qx0A/eoW67/Il7En3H970OPx9lBYHmE9xiaZfzWYvWz+C1+
                                          i+2tMDdp6VbE3XMC6KkuRoZ1XB/hQ/y4Gw1tjTIcYNFqZPjirJWnY3bZigxAf3XxxkQb6+2VVpdu
                                          oJfavDVRxrJ0AwCH62ZkWLb01ETJM+IQi9INZHZZugGAw3UzMmwG9xE7tPM5lkXpBrK6dnvqUavS
                                          DQC7dTMyDO2nsY/2lzjQOj6UbiGjy9IN9MCmdAPAbl2NDKtB7fu4LN1Ajy1KN5DNzYDOpT3r0g0A
                                          u3U1MsSDS+30i1nyKerBhMd56QZ6YV26AWC37kaG4XxULA22JpmXbiALYwxNDOXvPAxUdyPDUD4q
                                          3MFOVcfH0i1kMC/dQC+sSjcAPKSLSzl9U8eHlraIOiaz5NNdxKvSLSS6NsbQyCprtckJxPW6dAM7
                                          VKUboB1djgwR85geYQnfdl2WbmAA1vGu1f0/2ndRuoGeWGatNjrqyp5lDP8M6ZQu35iIWPd+ONcd
                                          7Dwue70O5IfO/izYLddm/UC3dTsyRFzGdekWkixKNzAQm5iVbuFgW2MMDS1KNwA8rNs3JiIiprHq
                                          7c2JrdsS2dTx/gibVLVh5mfnhpalG2Awjvnszar0yR5T9yPDOi7iz9JNHOjSh0VG86iOvP9oDu99
                                          EDZ0bU0GsqlKNzBUXb8xERGx6OmiwTfGGLLaxKx325Vd9342zvFclm4AeEwfIkPERS9nNBiQzm3V
                                          sxkN25j6M9DQ1kwG6L5+RIZNVL37+fKNWfItWMa70i3sYWqovbHL0g0Aj+tHZOhfaHjjZ6aWzHtz
                                          m0pobM5EYeiFvkSGiFVvQsM2/iswtGjWi9Dwuz8De5i7gQN90J/IELHqxfPt26jMkW9Z90PDBz81
                                          78FEYeiJPkWGiEW87PhIw3WMT+sp3UK6HRo+9GyaZmmz0g0AzfQrMkTUnb498SEqA6xH0t3Q8LuP
                                          wL28N+cD+qJvkeHLnIZu7jfwxmOVRzXr5NMTbwyy7+XGyhVwRFUsYhbjQw/vX2SIWMXkqMuBNnEd
                                          v5rudnTzeNOpMadtvPSnYE9WroBjmsbr+DP+ifVh0aGPkeHLI5fvSzdxy/uozGAoYtGhMafrmBhi
                                          39Mbf2/gqKqv/z2/FR2mMWp6eD8jQ0TERfy3Ez9h3sTLuPCTUjGrmHRiVsP7qCzctKcPxmTgqEY/
                                          7dNzHq/jr/hfrOKySXTob2SIWMY4Phbu4Z2fLIvbxKxwfNzGf8XGvXmuBI6t2vmd5/HbreiwU58j
                                          Q8QmpgU/LK7iF0vQdMQyxsXGGj7E2EocexMY4PiqR1/xJTp8jjrm972635Eh4suHxfFnzl/FSwPR
                                          nbKJWbw8+vZl1/HSczIHEBighKrxK1/E2/j0c3Tof2SI2MQ8fjniz5g38SYqtyM6qI5JvDnadMib
                                          eOO21EEEBijh55kMj/sSHTaxjIuYDCMyRESsY3aU2HAVL2Ns0laHLWJ8hNhwE2/8OTiQpa6gjOnB
                                          R57Fq/gj/o56KJEh4ltseN/S3IZtfIhfjS70wiLG8d/W1u64EhcOto2XlrqCQqrkCoOKDBER67iI
                                          UbzJ/CTFx3gT45h5hrxHllHFL/E+63jDTbyPX6ISFw50FWORG4qpkivUz0qfQysWsYhRTGMar5Lq
                                          bKOOZSxNb+updVzERUxiFtM4T6p0HXUsRMYE25gbX4CCxon/CkYMNjJERGxiEYuIqKKKKl7sdew2
                                          VlFH7SeiQVjFRVzEOKqoYrLn9J/rr38S1qVPouc+WLcCCquSK3yMGG5k+ObbB/84JjGJcYwj7gkQ
                                          21hFxCo2UcfaB8QArb9GyIgqJjGKKu5P3dexiU2sYh1rkTGLDzH3NwqKq5Ir1KcQGb5Zx9qCO0QY
                                          PTqabSziUlyATqiSK9SnFBmA4/kYS9NEoTPSZzJsYyUyADldxyqWUZu5AJ1SJVeoI0SG07PqQUX6
                                          4tvaF5tYxSZWsRIVoJOmyRXqCJHh9FyUboABqUo3ADRSJVeoI4azYDQAcJ9JnCVW+PJUocgAAINW
                                          JVeov/xHZACAIauSKyy//EdkAIAhq5Ir1F/+IzIAwHClz2S4+bYkm8gAAMNVJVeov/1CZACA4aqS
                                          K9TffmFdBmCY6nhSugXogFfJFepvvzDKAABDVSVXuPm+uZzIAABDVSVXqL//UmQAgKGqkivU338p
                                          MgDAUL1IrrD8/kuRAQCGqUqucH17f1qRAQCGqUquUN/+jcgAAMNUJVeob/9GZACAIRplmMlQ3/6N
                                          yAAAQ1QlV7gzk0FkAIBhqpIr1Hd/KzIAwBBVyRXqu78VGQBgeEbxPLlGffe3IgMADE+VXOHq7kwG
                                          kQEAhqhKrlD/+AWRAQCGp0quUP/4BZEBAIamhZkMIgMADM80ucLVz18SGQBgaKrkCvXPXxIZAGBo
                                          quQK9c9fEhkAYFjGcZ5co/75SyIDAAxLlVzh431fFBkAYFiq5Ar1fV8UGQBgWKrkCvV9XxQZAGBI
                                          0mcybGN135dFBgAYkiq5Qn3/l0UGABiSaXKF+v4viwwAMCRVcoX6/i+LDAAwHJM4S6ywYyaDyAAA
                                          Q1IlV6h3fUNkAIDhqJIrLHd9Q2QAgOGokivUu74hMgDAUKTPZLiJ9a5vPSt9dgCcsHVclW5hUKrk
                                          CvXub4kMAJSziEXpFgalSq5Q7/7Wk8+lTw8AyCP9Q/2X3TcmzGUAgGGokis8MJNBZACAoaiSK9QP
                                          fVNkAIBhqJIr1A9901wGABiG9I/0/8Rm9zeNMgDAEFTJFa4fCgwiAwAMQ5VcoX7427vXZZjHLNb/
                                          /m/1cPIAAIqqkivUD39791yGZbz64SvXsYlVbKJ+vCwAcESj+F9yjf88PDywe5Rh9NNXnkfEi4h4
                                          +/X3V18jxJf/AwBKqZIrXD92P2F3ZHjxaPEXEbdGIm7cxgCAQqrkCvVjL8i3x8R5nN+JGS/dvACA
                                          I6mSK9SPvWDXExPpb73OeikAgF1G8Ty5Rv3YC9p7yHLdWmUA4LYqucLV41MK2hpluM59NQCAHark
                                          CvXjL9kVGUaJb73JeikAgN2q5Ar14y/ZFRkmiW+9ynopAIBdjjKTwSgDAPTdNLnCVZMX7YoMqXll
                                          lfViAAC7VMkV6iYvuj8yjJLffJPxUgAAu1XJFeomL7p/j4kqPiW++ZPc1wMAuMc4/kmu0ehT+/5R
                                          hnHp8wcAGqmSK3xs9rJ2IkOjaRQAQLIquULd7GVGGQCgz6rkCnWzl7UTGRq+OQCQZBzniRW2TZ9y
                                          bCcybPJeDwDgXlVyhbrpC++PDKmJZZXvWgAAO02TK9RNX3hfZJgkv/0m26UAAHarkivUTV94X2QY
                                          Jb/9KtulAAB2mcRZYoXGMxnaGWXYZr4gAMB9quQKdfOXtjHKsMp2KQCA3arkCsvmL21jlGGd7VIA
                                          ALtVyRXq5i9tY5Rhne1SAAC7pM9kuNnnM/u+yPAisYE93h4AOFCVXKHe58VP93lxQ+sWagIAd1XJ
                                          Fep9XvxzZEhvYJ3pUgAAu71KrlDv82KjDADQR1Vyhb1mMrQxynCd72oAADtUyRXq/V7+c2QYJTaw
                                          yXQpAIDdquQK9X4v/zkyTBIbWGW6FADAbqnPN+61jFOEUQYA6KMqucL1vp/YP0eG54ktrHJdDQBg
                                          hyq5Qr3vAT9GhlFyC5sslwIA2K1KrlDve8CTzz+28CmxhSf5rgcAcI9R/C+5xn9Sb0yMS18FAOAR
                                          VXKFvWcy5I8MV7muBgCwQ5Vcod7/EKMMANA3VXKFev9DckeGA1oAAPYwSn66sRORYZPnagAAO1TJ
                                          Fa4O+bz+MTKcJzaxynM1AIAdquQK9SEH3Y0Mk+QmNhkuBQCwW5VcoT7koLvrMliVAQC6LceaDAd9
                                          WucdZdjmuh4AwL2myRUOXBDhbmQYJTaxynEtAICdquQK9WGH5R1lWGe4FADAblVyhfqww/KOMqwz
                                          XAoAYJdx8rONmSLDi8Qm1lkuBwBwvyq5wsdDD3x66IH3WmetBgDcVSVXqA898HZkSG9jnVwBANit
                                          Sq5QH3qgUQYA6Iv0mQzbw59uzDnKcJ3pggAA96mSK9SHH3o7MowS29gknwgAsNs0uUJ9+KG3I8Mk
                                          sY1V8okAALtVyRXqww81ygAA/TCJs8QKCTMZ7kaG54mNJLQBADyiSq5Qpxz8PTKMkhvZJFcAAHap
                                          kissUw7+vvm1ja8BoMs2yTcmfklZDuH7KMO49JUAAHZKn8lwk7Z+Ur7IcODu2wBAA1VyhTrtcKMM
                                          ANAHVXKFOu3wfJEhsREA4AGvkivUaYc/+/dX48RGNsmnAgDDNT7gk7a6dXSqxJkMtyND6kYXq+ST
                                          AYC70j5m23yXF8e/GInq1ALfIsMkuZVN0QsBwDc+ZrlPnVrgW2QYJbeyKnohANKMDvjRabL3v52H
                                          vUvqo3UQkbiMU0S+UYZt6SsB9Eq1x4enj1lId51+NyDXKMOq8KUA+mEUs5gl72gD7KtOL5FrlGFd
                                          9EIAfTCKi7jw0z8UUaeXyDXKsC56IYDuq2KR/GQWcKg6vcS3pZxSZ7Guy14JoONm8UlggGIyzGS4
                                          vfpjmnXBCwF03Sz+LN0CnLQ6R5EvkaFKrrMueCGAbhMYoLQ6RxGjDEC7JnFZugU4eXWOInlGGa7L
                                          XgmgwxaekYDCrvKs0PwlMowSq2RpBRigS2swQHF1njJfIsMkscqq4IUAumsav5VuAcgbGUaJVTYF
                                          LwTQVeNYlG4BiMyRIXXgcFXySgAdZRYDdMFVrkLPIsculn/FzZ7PTKz2HJmo93r1RoiB4uY2OoZO
                                          qHMVevI5oopPpc+nMIEHcvPvCnTFy1yh4clny6z0ncBD94xi7aYEdMSTXIWeRcS49NmQ5HzPlfv3
                                          HSx+22r3As8wmcUAXfExXymRgbL6F3iuYhN1LK14+oCLeFW6BeCrOl+pJ58japOUYG9XMc/5V3FA
                                          JvF36RaAf/0n30IIT8MoAxziRXyK2t+en4ysxQAd8iHnyklPPkd8Ln1G0FvbuPARecciXpduAfhq
                                          G5OcN1GfJi8WDafsLP6MWekmOmQmMECHXOaddfU0w0JOcNqEhm/GtrmGDrmKed6CRhkg3Z/+HkVE
                                          xNKjldAZ1zHNXdIoA+SwLN1AB9jmGrrjKqr8W0YaZYAcznMPAPaOba6hO963ERiMMkAus9INFOXR
                                          SuiKq/g1LtopbZQB8jg/6dBgFgOUdxMf4teo2lv4/pm/6JBJdbI/advmGpq52vuIdaPHJDexavjK
                                          JE8+W8gJ8tie6G0+C0TTrrY+Zu+qj/IuPffk88Y4A2SSbVf6HhnFas+txTgGH7O04FmsDClCJtMT
                                          jAyLAQUGH7PwIJEB8pm2NU+5s3Jvc/1+x4Nh9d6VfMxCdk8+T+Ov0k3AYPxyUh9Uk6iz3tj8cNJP
                                          nUDnPY06tqWbgMGYlm7giEaxyBoYbk5ujAZ65mlsLHUL2UxLN3BEuReInraxWh2Qz5PPEeP4p3Qb
                                          MBj/OZEPvty3NH+3CyZ03dOIWMe70m3AYFSlGziKceZlqz4KDNB9T76u5LSyBx1kcRpT+PL+i7GN
                                          8YmMzUCvPf3636lJkJDFtHQDRzA3iwFO0bfIsI5KaIAMzga/1VsVb7PWe3eCC2BBLz3991ermMR1
                                          6XZgAGalG2jVKPMzVlcxL31KQDNPb/16HRMTISFZVbqBVuXd5no78IAFg/L0h9/P45d47xYFJHge
                                          49IttOYi8wLzs5NaLRN67smOva+nUcUkRp6jgAMMdY2B3Ntcv7feI/TJrsiwr2qvV4/2nCA23vOn
                                          tokNvSnq4yCfm8i9zfV1VJ6UgD7JFRn6rdrr1QIPj3tSuoEWLLPuWrmNKlalTwnYh8jQf9VerxZ4
                                          juO/g9u7ZRZ/Zq33JvP6kUDrRAbKqvZ6dX8Cz9DWgMy9zfUwb93AwIkM8LPL+C2xws3AnprIu0D0
                                          TUzMYoD+eZpeAgZnmVzhfFBrQNrmGgiRAe5TZ1ibZFr6JLKZJo+53PW7aY/QTyID3GeZXGFa+hQy
                                          yb3N9dVA16yAEyAywH3q5ApDWQNykXmB6GnpEwIOJTLAfZYZalSlTyKDeeYFos1igB4TGeA+mwz7
                                          uk5Ln0Sy3Ntcv7fNNfSZhyzhfhfxR2KFbYxKn0SSUayz3pS4HtRTJHCCjDLA/erkCmc9H2cwiwG4
                                          Q2SA+63iJrlGVfokElxk3VHCNtcwACID7LJMrjAtfQoHmyTflrnrw+D23IATJDLALnVyhb6uATnK
                                          vBbDdVyUPiUgncgAuywzrAFZlT6Jg+RdIHobM49WwhCIDLBbnVxhVvoUDur5ddZ6cwtEwzCIDLDb
                                          MrnC8949aDnOvKDzRwtEw1CIDLBbnaHGtPRJ7GmZ9dHKm16OswD3Ehlgt3WGNSCr0iexl9zbXJvF
                                          AAMiMsBDlskVpqVPYa9e825z/c4C0TAkFoyGh0zi7+QaL3vywZl7geirno2wAI8wygAPybEG5LT0
                                          STSUdxaDBaJhcEQGeFidXGFa+hQayb3NtVkMMDgiAzxsmVzhPMalT+JRk+zbXC9LnxKQm8gAD1tm
                                          qDEtfRKPGGX+gLdANAySyACP+ZhcYVr6FB6xiPOM1cxigIESGeAxdXKFF51eAzL3NtcXtrmGYRIZ
                                          4DHLDDWq0iex0yTmWet9yLwLJtAZIgM8JscakNPSJ7HDKBaZF4i+KH1KQFtEBnhcnVxhWvoUdsi9
                                          QPTUo5UwXCIDPG6RXOEsJqVP4h7TzNtc/26baxgykQEet4ptco1Z6ZP4yTjzrAPbXMPAiQzQxDK5
                                          QlX6FO45p7wLRM9KnxDQLpEBmlgmV3jesTUg52YxAPsRGaCJOkONaemTuKXKvEC0ba7hBIgM0MQm
                                          rpJrVKVP4l+5F4i+yry2A9BJIgM0s0yukHeNxbRzMYsB2JvIAM0sM9SYlj6JiIi4yL7N9br0KQHH
                                          IDJAM+u4Sa4xLX0SETGJP7LWs801nAyRAZpaJleoSp9CC9tcz0ufEnAsIgM0tUyucF58Dcjc21zP
                                          PFoJp0NkgKbqDGtATouewSz7NteroucDHJXIAM0tkytMC3Y/ybyg80fbXMNpERmguTq5Qsk1IHNv
                                          cz0rdiZAESIDNLfMUKMq1LttroFEIgM0l2MNyGmRzqfxW9Z6trmGEyQywD6WyRWqAl3n3ub6yjbX
                                          cIpEBthHnVzhrMA4Q95ZDNtOLEkFHJ3IAPtYZVgDsjpyz/PMC0SbxQAnSmSA/SyTK0yP2m/uba7f
                                          2+YaTpXIAPupkysccw3I/AtEXxytd6BjRAbYzzLDGpDV0bo1iwHIRmSAfdXJFWZH6vQi8wLRtrmG
                                          kyYywL6WyRWex+gIfebe5vqDba7htIkMsK9lhhrT1rscZV6LwSwGOHkiA+xrE9fJNarWu8y7QLRt
                                          rgGRAQ6wTK4wbbnDWbzOWm9ugWjgyefSHUD/TOLv5BovW1zfYByrrE9KfPSkBGCUAQ6RYw3IaYv9
                                          LW1zDeQnMsAh6uQK09Z6y73NtVkMQESIDHCYZXKF8xi30lnuba7fWSAa+MJcBjhM+l+d31vYQnoU
                                          66w3Ja6KbNYNdJJRBjjMx+QK0xa6yjuLwQLRwC0iAxxmmVzhRfY1IHNvc20WA3CLyACHqTPUqLJ2
                                          NMm+zfUyaz2g50QGOMw6wxqQ04z92OYaaJnIAIeqkytMM3aziPOM1cxiAH4iMsChFskVzmKSqZfc
                                          21xf2OYa+JHIAIdaxTa5xixLJ5OYZz2zD5l3wQQGQWSAwy2TK1QZuhjFIvMC0RcZqwGDITLA4ZbJ
                                          FZ5nWAMy9wLRU49WAvcRGeBwdYYa0+Tj825z/bttroH7iQxwuE2GNSCrpKPHmWcdfGxhEWtgIEQG
                                          SFEnV0h70iH3AtGzjNWAgREZIMUyQ43pwUfOzWIAjkdkgBTruEmuMT3wuCrzAtG2uQYeJDJAmmVy
                                          heqgo3IvEH2VeW0HYHBEBkizTK5wftAakGYxAEcmMkCaOsMakNO9j7jIvs31Oms9YIBEBki1TK4w
                                          3fP1k/gj6xnY5hpoQGSAVHVyhf3WgMy/zfU8az1goEQGSLXMUKPa47W5t7meebQSaEJkgFSbuEqu
                                          MW38yln2ba5Xma8HMFAiA6RbJleoGr5uknlB54+2uQaaEhkgXZ1c4azhOEPuba5nbVwOYJhEBki3
                                          yrAGZNXgNba5BgoSGSCHZXKFaYNX/Ja1Z9tcA3sRGSCHOrnCY2tA5t7m+so218B+RAbIYZlhDcjq
                                          we/mncWwTdg/EzhRIgPkUSdXmD3wvXnmBaLNYgD2JjJAHsvkCs9jtOM7ube5fm+ba2B/Tz6X7gCG
                                          YRT/S67x5t75CqNYZ70pcX3QzpnAyTPKAHls4jq5RnXvV81iADpBZIBclskVpvd87SLzAtG2uQYO
                                          JDJALsvkCmc/jTPk3ub6g22ugUOJDJBLjjUgp3d+N8q8FsN1XBzvcgBDIzJAPnVyhemd3+VdINo2
                                          10ASkQHyWSZXOI/xv7+exeus3c0tEA2k8JAl5JT+F+r3rws5j2OV9UmJj56UANIYZYCcPiZXmH79
                                          79I210C3iAyQ0zK5wosYRf5trs1iAJI9K90ADEqdoUYVkXmb63cWiAbSmcsAea2Sxwc+RpX1psTV
                                          I3tkAjTixgTkVSdXeGWBaKCLRAbIa1G6gR+YxQBkIjJAXqvYlm7hlvcWiAZyERkgt2XpBv5lgWgg
                                          I5EBcluWbuArsxiArEQGyK0u3cBXF7a5BnISGSC3TYY1INN96NxETKDnRAbIry7dQNyYxQDkZikn
                                          yG8c/xTu4Fe7VgK5GWWA/NZxU/T9fxcYgPxEBmjDsuB7f/y6fTZAViIDtGFZ7J23trkG2mEuA7Rj
                                          k3WniOZedmDyJTBIRhmgHcsi72qba6A1IgO0oy7wnlcxL33awHC5MQHtGMX/jvyO25hY7xFoj1EG
                                          aMcmro78jjOBAWiTyABtWR713WxzDbTMjQloyyT+Ptp7XUcVm9InDAybyADtWcf5Ud5nG5X1HoG2
                                          uTEB7Vke6X0uBAagfSIDtKc+yrt8tM01cAxuTECb2l8D8iYmZjEAx2CUAdpUt/4OU4EBOA6RAdq0
                                          bLm+ba6Bo3FjAtrU7hqQV1GVPkHgdBhlgDZt4rq12tuYlj494JSIDNCuZWuVzWIAjkpkgHYtW6r7
                                          3jbXwHGZywBta2MNyOuYlD4t4NQYZYC21dkrmsUAFCAyQNuW2Sva5hoowI0JaF/ev2YfYlb6hIBT
                                          ZJQB2vcxY63ruCh9OsBpEhmgfctslbYx82glUIbIAO2rs1WaWyAaKMVcBjiGVTzPUOWjJyWAcowy
                                          wDHUGWrcmPYIlCQywDEsMtQwiwEoSmSAY1jFNrHCOwtEA2WJDHAcy6Sjr2Je+gSAUycywHEsEo61
                                          QDTQASIDHEcdVwcfaxYD0AEiAxzL/MDj3re2gTbAHqzLAMezjFd7H2Oba6AjRAY4nlHUey7ptI2J
                                          XSuBbnBjAo5nE9O9HrbcRiUwAF0hMsAxrWMS1w1fu43KjhJAd4gMcFzrqBpthn0VE4EB6BKRAY5t
                                          E9N4+eAjlzfxxi0JoGtMf4RSqpjFNM7ufG0bdSw8VAl0kcgAZY1jHJMYRUQdG7cigO76Pw4YZ/4a
                                          Df19AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIxLTA0LTA0VDE0OjI4OjMwKzAzOjAwrNqZjwAAACV0
                                          RVh0ZGF0ZTptb2RpZnkAMjAyMS0wNC0wNFQxNDoyODozMCswMzowMN2HITMAAAAASUVORK5CYII=" />
    </svg>

  )
}

export function BAR(props) {
  return (
    <svg
      width="15"
      height="3"
      viewBox="0 0 15 3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="15" height="3" fill="white" />
    </svg>
  );
}

export function SCENE_ICON(props) {
  return (
    <svg
      width="15"
      height="15"
      id="fi_93839"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 348.462 348.462"
    >
      <g>
        <path
          fill={"white"}
          d="M330.725,112.541H83.178l238.875-64.006c0.038-0.01,0.074-0.025,0.111-0.036c0.035-0.009,0.07-0.013,0.105-0.023
		c4.001-1.072,6.375-5.185,5.304-9.186l-9.038-33.731c-0.515-1.921-1.772-3.559-3.495-4.554c-1.723-0.995-3.771-1.264-5.691-0.749
		L15.798,78.913c-4.001,1.072-6.375,5.185-5.304,9.185l8.824,32.931v219.932c0,4.142,3.358,7.5,7.5,7.5h303.907
		c4.142,0,7.5-3.358,7.5-7.5V120.041C338.225,115.898,334.867,112.541,330.725,112.541z M323.225,147.305h-31.319l19.764-19.764
		h11.555V147.305z M34.318,147.305v-19.764h33.354l-19.764,19.764H34.318z M88.885,127.541h33.858l-19.616,19.616
		c-0.048,0.048-0.088,0.099-0.134,0.148H69.121L88.885,127.541z M143.956,127.541h35.859l-19.764,19.764h-35.859L143.956,127.541z
		 M201.028,127.541h34.359l-19.764,19.764h-34.359L201.028,127.541z M256.305,127.835c0.095-0.095,0.178-0.196,0.266-0.294h33.886
		l-19.764,19.764h-33.858L256.305,127.835z M93.614,73.591c0.111,0.072,0.218,0.149,0.334,0.216l24.038,13.878l-33.67,9.022
		L59.917,82.62L93.614,73.591z M147.748,59.086l24.399,14.087l-33.67,9.022l-24.4-14.087L147.748,59.086z M201.91,44.573
		l24.399,14.087l-33.671,9.022l-24.399-14.087L201.91,44.573z M256.069,30.061l24.399,14.087l-33.698,9.029
		c-0.115-0.075-0.225-0.154-0.345-0.223L222.4,39.083L256.069,30.061z M311.143,35.929l-10.185,2.729l-24.399-14.087l29.428-7.885
		L311.143,35.929z M39.427,88.111l24.399,14.087l-31.745,8.506L26.924,91.46L39.427,88.111z M34.318,333.462V162.305h288.907
		v171.157H34.318z"
        ></path>
        <path
          fill={"white"}
          d="M290.354,207.162c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.358-7.5-7.5-7.5H63.825c-4.142,0-7.5,3.358-7.5,7.5
		c0,4.142,3.358,7.5,7.5,7.5h56.421v53.321H63.825c-4.142,0-7.5,3.358-7.5,7.5c0,4.142,3.358,7.5,7.5,7.5h226.528
		c4.142,0,7.5-3.358,7.5-7.5c0-4.142-3.358-7.5-7.5-7.5H239.54v-53.321H290.354z M224.54,260.483h-89.293v-53.321h89.293V260.483z"
        ></path>
      </g>
    </svg>
  );
}
