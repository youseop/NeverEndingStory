import React, { useState } from "react";
import { Group } from "@vx/group";
import { Tree } from "@vx/hierarchy";
import { LinearGradient } from "@vx/gradient";
import { LinkRadial, LinkRadialLine } from "@vx/shape";
import { hierarchy } from "d3-hierarchy";
import { pointRadial } from "d3-shape";
import NodeGroup from "react-move/NodeGroup";
import { message } from "antd";
import Axios from "axios";
import { socket } from "../../App";
import { AdminModalForm } from "../GameDetailPage/AdminModalForm";

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
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
    this.handleVisible = this.handleVisible.bind(this);
  }

  handleVisible() {
    this.setState(state => ({ 
      visible: !state.visible
    }));
  }

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
      userId,
      isAdmin,
      isDelete,
      isHide,
      updateTree,
      clickable,
    } = this.props;

    if (width < 10) return null;

    const onCancel = () => {
      this.handleVisible();
    }

    async function onClick_node (node, that) {
      if (isDelete){
        const confirmComment= `${node.data.name} 과 ${node.data.name} 에서 이어지는 스토리들을 모두 삭제하시겠습니까?`;
        if(window.confirm(confirmComment)){
          const {sceneId, gameId} = node.data;
          message
            .loading("삭제 중 입니다...", 1.5)
            .then(async () => {
              const response = await Axios.delete(`/api/treedata/${sceneId}/${gameId}`);
              if(response.data.success){
                message.success(`${response.data.messege}`,1.5);
                updateTree();
                socket.emit("scene_deleted", {prevScene_id: node.data.parentSceneId});
                that.forceUpdate();
              } else{
                message.info("삭제 실패 했습니다.");
              }
            })
        } else {
          message.info("취소되었습니다.")
        }
      } else if(isHide){
        if (!node.data.isExpanded) {
          node.data.x0 = node.x;
          node.data.y0 = node.y;
        }
        node.data.isExpanded = !node.data.isExpanded;
        that.forceUpdate();
      } else {
        onCancel();
      }
    }

    return (
      <>
        <AdminModalForm 
            visible={this.state.visible}
            onCancel={onCancel}
        />
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
            size={[Math.PI*2, width*0.45 ]}
            separation={(a, b) => (a.parent === b.parent ? 1 : 1) / a.depth}
          >
            {({ links, descendants }) => {
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
                    if(!collapsedParent){
                      return;
                    }
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
                    if(!collapsedParent){
                      return;
                    }
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
                                  "#fd4213"
                                  : 
                                  "#b32704"
                              }
                              onClick={() => {
                                if(clickable)
                                  onClick_node(node, this);
                              }}
                            />
                            <text
                              dy={".33em"}
                              fontSize={12}
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
                              `${node.data.complaintCnt}회`
                              : 
                              node.data.parentSceneId === "rootNode"?
                              "첫 번째 스토리"
                              :
                              !isHide?
                              ""
                              :
                              node.data?.children.length === 0 ? 
                              ""
                              :
                              "click"
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
      </>
    );
  }
}
