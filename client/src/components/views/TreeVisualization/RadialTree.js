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
      node: null
    };
    this.handleVisible = this.handleVisible.bind(this);
    this.handleNode = this.handleNode.bind(this);
  }

  handleVisible() {
    this.setState(state => ({ 
      visible: !state.visible
    }));
  }

  handleNode(node) {
    this.setState(state => ({
      node: node
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
      dummy,
      isDelete,
      updateTree,
      selectedUser,
      threshold
    } = this.props;

    if (width < 10) return null;

    const onCancel = (node) => {
      this.handleVisible();
      if(!this.state.visible){
        this.handleNode(node);
      } else {
        this.handleNode(null);
      }
    }

    async function onClick_node (node, that) {
      //? 더미 생성 코드
      if(dummy) {
        const confirmComment='더미 Scene 생성 by 유섭_ 씬만들고 지우기 너무 힘들어서 만들었습니다...(배포시 이 버튼과 scene.js /makedummy router삭제부탁드려요)'
        if(window.confirm(confirmComment)){
          const resource = {
            prevSceneId: node.data.sceneId,
            userId: node.data.userId,
            gameId: node.data.gameId,
          }
          await Axios.post('/api/scene/makedummy', resource);
          updateTree();
          message.info("더미 생성(새로고침하면 반영됩니다. 빡세네요 고치기...)");
          that.forceUpdate();
        }
        return;
      }

      if (isDelete){
        const confirmComment= `클릭하신 스토리와 이어지는 스토리들을 모두 삭제하시겠습니까?\n한 번 삭제하면 되돌릴 수 없습니다.\n"삭제하겠습니다."를 입력창에 입력해주세요.`;
        if(window.prompt(confirmComment) === "삭제하겠습니다."){
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
      } else {
        onCancel(node);
      }
      //? 자식 toggle 코드
      // else if(isHide){
      //   if (!node.data.isExpanded) {
      //     node.data.x0 = node.x;
      //     node.data.y0 = node.y;
      //   }
      //   node.data.isExpanded = !node.data.isExpanded;
      //   that.forceUpdate();
      // } else {
      //   onCancel();
      // }
    }

    return (
      <>
        <AdminModalForm 
            visible={this.state.visible}
            onCancel={onCancel}
            node={this.state.node}
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
                        return (
                          <Group
                            top={state.y}
                            left={state.x}
                            key={key}
                            opacity={state.opacity}
                          >
                            <circle
                              r={node.data.parentSceneId === "rootNode"? 20 : 10 }
                              fill={
                                selectedUser === node.data.userId ?
                                "#026cc3"
                                :
                                node.data.complaintCnt > threshold ? 
                                "#ca0011"
                                : 
                                "#d65d16"
                              }
                              onClick={() => {
                                  onClick_node(node, this);
                              }}
                            />
                            <text
                              dy={"0.4em"}
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
                              {
                              node.data.parentSceneId === "rootNode"?
                              "시작"
                              :
                              ""
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
