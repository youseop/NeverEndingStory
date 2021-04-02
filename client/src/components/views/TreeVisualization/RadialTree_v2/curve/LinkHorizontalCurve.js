import React from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { pointRadial } from "d3-shape";

LinkHorizontalCurve.propTypes = {
  innerRef: PropTypes.func
};

export default function LinkHorizontalCurve({
  className,
  innerRef,
  data,
  x = d => d.y,
  y = d => d.x,
  ...restProps
}) {
  const curve = (source, target) => {
    const sx = x(source);
    const sy = y(source);
    const tx = x(target);
    const ty = y(target);

    const dx = tx - sx;
    const dy = ty - sy;
    const ix = 0.2 * (dx + dy);
    const iy = 0.2 * (dy - dx);

    return `M${sx},${sy}
      C${sx + ix},${sy + iy}
      ${tx + iy},${ty - ix}
      ${tx},${ty}
    `;
  };

  const sx = x(data.source);
  const sy = y(data.source);
  const tx = x(data.target);
  const ty = y(data.target);

  const dx = tx - sx;
  const dy = ty - sy;
  const ix = 0.2 * (dx + dy);
  const iy = 0.3 * (dy - dx);

  return (
    <g>
      <path
        ref={innerRef}
        className={cx("vx-link", className)}
        d={curve(data.source, data.target)}
        {...restProps}
      />
      {/*
      <line x1={sx} y1={sy} x2={sx + ix} y2={sy + iy} stroke="white" />
      <line x1={tx + iy} y1={ty - ix} x2={tx} y2={ty} stroke="white" />
      */}
    </g>
  );
}

// export default function LinkHorizontalCurve({
//   className,
//   innerRef,
//   data,
//   x = d => d.y,
//   y = d => d.x,
//   ...restProps
// }) {

//   const curve = (source, target) => {
//     const sx = x(source);
//     const sy = y(source);
//     const tx = x(target);
//     const ty = y(target);

//     // const dx = tx - sx;
//     // const dy = ty - sy;
//     // const ix = 0.4 * (dx + dy);
//     // const iy = 0.4 * (dy - dx);
//     const mx = (tx + sx) * 0.5
//     const my = ty - 100//(ty + sy) * 0.5;

//     return `M${sx},${sy}
//       Q${mx},${my}
//       ${tx},${ty}
//     `;
//   };

//   const sx = x(data.source);
//   const sy = y(data.source);
//   const tx = x(data.target);
//   const ty = y(data.target);

//   const dx = tx - sx;
//   const dy = ty - sy;
//   const ix = 0.3 * (dx + dy);
//   const iy = 0.3 * (dy - dx);

//   return (
//     <g>

//       <path
//         ref={innerRef}
//         className={cx('vx-link', className)}
//         d={curve(data.source, data.target)}
//         {...restProps}
//       />
//       {/*
//       <line x1={sx} y1={sy} x2={sx + ix} y2={sy + iy} stroke="white" />
//       <line x1={tx + iy} y1={ty - ix} x2={tx} y2={ty} stroke="white" />
//       */}
//     </g>
//   );
// }
