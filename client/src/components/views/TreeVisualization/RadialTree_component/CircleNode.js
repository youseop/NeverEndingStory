import React from 'react'

function CircleNode({node}) {
  return (
    <div>
      <circle
        r={12}
        fill={
          node.data.complaint > 9
            ? "#ff6435"
            : "#eb994c"
        }
        onClick={() => {
          // console.log('node.onClick', node);
          if (!node.data.isExpanded) {
            node.data.x0 = node.x;
            node.data.y0 = node.y;
          }
          node.data.isExpanded = !node.data.isExpanded;
          this.forceUpdate();
        }}
      />
    </div>
  )
}

export default CircleNode
