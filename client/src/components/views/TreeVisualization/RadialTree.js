import React from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { LinkRadial } from "@vx/shape";
import { hierarchy } from "d3-hierarchy";
import { pointRadial } from "d3-shape";
import NodeGroup from "react-move/NodeGroup";
import { message } from "antd";
import Axios from "axios";

function findCollapsedParent(node) {
  if (node.data.isExpanded) {
    return node;
  } else if (node.parent) {
    return findCollapsedParent(node.parent);
  } else {
    return null;
  }
}

function radialPoint(angle, radius) {
  const [x, y] = pointRadial(angle, radius);
  return { x, y };
}

export default class extends React.Component {
  render() {
    const {
      data,
      width,
      height,
      events = false,
      margin = {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      },
      isDelete,
      userId,
      isAdmin,
      updateTree
    } = this.props;

    if (width < 10) return null;

    async function onClick_node (node) {
      if(isDelete){
        const confirmComment= `${node.data.name} 과 ${node.data.name} 에서 이어지는 스토리들을 모두 삭제하시겠습니까?`;
        if(window.confirm(confirmComment)){
          const {sceneId, gameId} = node.data;
          message
            .loading("삭제 중 입니다...", 1.5)
            .then(async () => {
              const response = await Axios.delete(`/api/treedata/${sceneId}/${gameId}`);
              if(response.data.success){
                message.success(`${response.data.messege}`,1.5);
              } else{
                message.info("삭제 실패 했습니다.");
              }
            })
        } else {
          message.info("취소되었습니다.")
        }
        return;
      } else if(isAdmin) {
        const confirmComment='더미 Scene 생성 by 유섭_ 씬만들고 지우기 너무 힘들어서 만들었습니다...(배포시 이 버튼과 scene.js /makedummy router삭제부탁드려요)'
        if(window.confirm(confirmComment)){
          const resource = {
            prevSceneId: node.data.sceneId,
            userId: node.data.userId,
            gameId: node.data.gameId,
          }
          await Axios.post('/api/scene/makedummy', resource);
          // updateTree();
          message.info("더미 생성(새로고침하면 반영됩니다. 빡세네요 고치기...)");
        }
        return;
      }
      console.log(node,"1!!")
      if (!node.data.isExpanded) {
        console.log("here?!")
        node.data.x0 = node.x;
        node.data.y0 = node.y;
      }
      node.data.isExpanded = !node.data.isExpanded;
    }

    return (
      <svg width={width} height={height}>
        {/* 그라데이션 효과 */}
        {/* <LinearGradient id="lg" from="#000" to="#000" /> */} 
        <rect width={width} height={height} rx={14} fill="#222831" />
        <Tree
          top={margin.top}
          left={margin.left}
          // root={hierarchy(data, (d) => (d.isExpanded ? d.children : null ))}
          root={hierarchy(data, (d) => (d.isExpanded ? null : d.children ))}
          // 각도 조절 Math.PI*2
          size={[Math.PI, 350]}
          separation={(a, b) => (a.parent === b.parent ? 1 : 1) / a.depth}
        >
          {({ links, descendants }) => {
            console.log(links)
            return (
            <Group top={width / 2} left={height / 2}>
              <NodeGroup
                data={links}
                // 여기서 unique한 키를 만들어준다.
                keyAccessor={(d, i) =>
                  `${d.source.data.sceneId}_${d.target.data.sceneId}`
                }
                start={({ source, target }) => {
                  return {
                    source: {
                      x: source.data.x0,
                      y: source.data.y0
                    },
                    target: {
                      x: source.data.x0,
                      y: source.data.y0
                    }
                  };
                }}
                enter={({ source, target }) => {
                  return {
                    source: {
                      x: [source.x],
                      y: [source.y]
                    },
                    target: {
                      x: [target.x],
                      y: [target.y]
                    }
                  };
                }}
                update={({ source, target }) => {
                  return {
                    source: {
                      x: [source.x],
                      y: [source.y]
                    },
                    target: {
                      x: [target.x],
                      y: [target.y]
                    }
                  };
                }}
                leave={({ source, target }) => {
                  const collapsedParent = findCollapsedParent(source);
                  return {
                    source: {
                      x: [collapsedParent.data.x0],
                      y: [collapsedParent.data.y0]
                    },
                    target: {
                      x: [collapsedParent.data.x0],
                      y: [collapsedParent.data.y0]
                    }
                  };
                }}
              >
                {(nodes) => {
                  return(<Group>
                    {nodes.map(({ key, data, state }) => {
                      state.source.x = data.source.x;
                      state.source.y = data.source.y;
                      state.target.x = data.target.x;
                      state.target.y = data.target.y;
                      return (
                        <LinkRadial
                          data={state}
                          stroke="#374469"
                          strokeWidth="2"
                          fill="none"
                          key={key}
                        />
                      );
                    })}
                  </Group>
                  )
                }}
              </NodeGroup>

              <NodeGroup
                data={descendants}
                keyAccessor={(d) => d.data.sceneId}
                start={({ parent }) => {
                  const radialParent = radialPoint(
                    parent ? parent.x : 0,
                    parent ? parent.y : 0
                  );
                  return {
                    x: radialParent.x,
                    y: radialParent.y,
                    opacity: 0
                  };
                }}
                enter={({ x, y }) => {
                  const point = radialPoint(x, y);
                  return {
                    x: [point.x],
                    y: [point.y],
                    opacity: [1]
                  };
                }}
                update={({ x, y }) => {
                  const point = radialPoint(x, y);
                  return {
                    x: [point.x],
                    y: [point.y],
                    opacity: [1]
                  };
                }}
                leave={({ parent }) => {
                  const collapsedParent = findCollapsedParent(parent);
                  const radialParent = radialPoint(
                    collapsedParent.data.x0,
                    collapsedParent.data.y0
                  );
                  return {
                    x: [radialParent.x],
                    y: [radialParent.y],
                    opacity: [0]
                  };
                }}
              >
                {(nodes) => (
                  <Group>
                    {nodes.map(({ key, data: node, state }) => {
                      const width = 40;
                      const height = 20;
                      return (
                        <Group
                          top={state.y}
                          left={state.x}
                          key={key}
                          opacity={state.opacity}
                        >
                          <circle
                            r={10}
                            fill={
                              isAdmin && node.data.complaintCnt > 19
                                ? "#ff0000"
                                : isAdmin &&node.data.complaintCnt > 9
                                ? "#dd521b"
                                : !isAdmin && node.data.userId === userId ?
                                "#ae00ff"
                                : 
                                "#f68031"
                            }
                            onClick={() => {
                              onClick_node(node, isDelete, isAdmin);
                              this.forceUpdate();
                            }}
                          />
                          <text
                            dy={".33em"}
                            fontSize={9}
                            fontFamily="Arial"
                            textAnchor={"middle"}
                            style={{ pointerEvents: "none" }}
                            fill={
                               (node.data?.children && node.data.children.length > 0)
                                ? "bisque"
                                : "#000"
                            }
                          >
                            {isAdmin ?
                            `신고: ${node.data.complaintCnt}회`
                            : node.data?.children ? 
                            "O"
                            :
                            " "
                            }
                          </text>
                        </Group>
                      );
                    })}
                  </Group>
                )}
              </NodeGroup>
            </Group>
          )}}
        </Tree>
      </svg>
    );
  }
}
