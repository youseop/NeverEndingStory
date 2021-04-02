import React from 'react';
import { Group } from '@vx/group';
import { Tree } from '@vx/hierarchy';
import { LinearGradient } from '@vx/gradient';
import { hierarchy } from 'd3-hierarchy';
import { pointRadial } from 'd3-shape';
import NodeGroup from 'react-move/NodeGroup';
import Surface from './components/Surface';

import { LinkRadialCurve, LinkHorizontalCurve } from './curve';

const view = [1200, 750]; // [width, height]
const trbl = [10, 10, 30, 10]; // [top, right, bottom, left] margins

function findCollapsedParent(node) {
  if (!node.data.isExpanded) {
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
            width = view[0],
      height = view[1] - 30,
      data,
      chart,
      data2,
      margin = {
        top: 10,
        left: 10,
        right: 10,
        bottom: 30
      }
        } = this.props;

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    let sizeWidth = 2 * Math.PI;
    let sizeHeight = Math.min(innerWidth, innerHeight) / 2;
    let origin;


    origin = {
      x: innerWidth / 2,
      y: innerHeight / 2
    };

    if (width < 10) return null;
    return (
      <div>
        <div id='test' >
          <h2> {data2.personal.names["0"].value} </h2>
          <p>{data2.personal.locations["0"].value}<br />
            {data2.personal.emails["0"].value}
            <br /> {data2.personal.phones["0"].value} | {data2.personal.phones["1"].value}
          </p>
        </div>

        <div id={"chart"}>
          {this.chart}
        </div>

        <Surface view={view} trbl={trbl}>

          <LinearGradient id="lg" from="#fd9b93" to="#fe6e9e" />
          {/*<rect width={width} height={height} rx={0} fill="#232323"/>*/}

          <Tree
            top={margin.top}
            left={margin.left}
            root={hierarchy(data, d => (d.isExpanded ? d.children_root || d.children : null))}
            size={[sizeWidth, sizeHeight]} //***********Polar*********
            separation={(a, b) => ((a.children === b.children) && (a.parent === b.parent) ? 1 : 7) / a.depth}
          >

            {({ links, descendants }) => (
              <Group top={origin.y} left={origin.x}>
                <NodeGroup
                  data={links}
                  keyAccessor={(d, i) =>
                    `${d.source.data}_${d.target.data.name}`}

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
                      },

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
                  {nodes => (
                    <Group>
                      {nodes.map(({ key, data, state }) => {
                        return (
                          <LinkRadialCurve
                            data={state}
                            stroke="#2996D9"
                            strokeWidth="1"
                            strokeDasharray="4"
                            fill="none"
                            key={key}
                          />
                        );
                      })}
                    </Group>
                  )}
                </NodeGroup>

                <NodeGroup
                  data={descendants}
                  keyAccessor={d => d.data.name}
                  start={({ parent }) => {
                    const radialParent = radialPoint(parent ? parent.x : 0, parent ? parent.y : 0);
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
                      opacity: [1],
                      timing: { duration: 600, delay: 200 }
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
                    const radialParent = radialPoint(collapsedParent.data.x0, collapsedParent.data.y0);
                    return {
                      x: [radialParent.x],
                      y: [radialParent.y],
                      opacity: [0]
                    };
                  }}
                >
                  {nodes => (
                    <Group>
                      {nodes.map(({ key, data: node, state }) => {
                        const width = 50;
                        const height = 30;
                        const textLength = node.data.name;

                        return (
                          <Group
                            top={state.y}
                            left={state.x}
                            key={key}
                            opacity={state.opacity}
                          >
                            {node.data.isExpanded && node.depth !== 0 && (
                              <circle
                                r={'28'}
                                fill={'transparent'}
                                stroke={'#2996D9'}
                                strokeWidth={2.5}
                                strokeOpacity={0.9}
                              />
                            )}

                            {node.depth === 0 && (
                              <circle
                                r={(textLength > 15) ? ('32') : ('39')}
                                height={height}
                                width={width}
                                y={-height / 2} //--FOR RECT ****
                                x={-width / 2}
                                fill={'#2996D9'}
                                stroke='#03c0dc'
                                strokeDasharray={"3"}
                                strokeWidth={3}

                                onClick={() => {
                                  console.log('node.onClick', node);
                                  if (!node.data.isExpanded) {
                                    node.data.x0 = node.x;
                                    node.data.y0 = node.y;
                                  }
                                  node.data.isExpanded = !node.data.isExpanded;
                                  this.forceUpdate();
                                }}
                              />
                            )}

                            {node.data.children && (
                              <circle
                                r={'22'}
                                height={height}
                                width={width}
                                y={-height / 2} //--FOR RECT
                                x={-width / 2}  //--FOR RECT
                                fill={
                                  node.data.name === 'Skills' ? ('#DA244D') : node.data.name === 'Experience' ?
                                    ('#F3B63C') : node.data.name === 'Education' ? ('#64B86C') : ('#F3B63C')
                                }
                                //node.children ? ('white') : ('#272b4d')
                                // stroke={
                                //     node.data.children ? '#03c0dc' : '#26deb0'
                                // }
                                // strokeWidth={1}
                                // strokeDasharray={
                                //     !node.data.children ? '2,2' : '0'
                                // }
                                strokeOpacity={!node.data.children ? 0.6 : 1}
                                rx={!node.data.children ? 10 : 0} //--FOR RECT
                                onClick={() => {

                                  if (node.data.name === 'Experience') {

                                    this.chart = !chart;
                                  }
                                  console.log(node);
                                  if (!node.data.isExpanded) {
                                    node.data.x0 = node.x;
                                    node.data.y0 = node.y;
                                  }
                                  node.data.isExpanded = !node.data.isExpanded;

                                  this.forceUpdate();

                                }}
                              />
                            )}

                            {!node.data.children && !node.data.children_root && (
                              <a>
                                <rect
                                  height={height}
                                  width={width}
                                  y={-height / 2} //--FOR RECT
                                  x={-width / 2}  //--FOR RECT
                                  fill={node.data.children ? '#232323' : '#232323'}
                                  stroke={'#2996D9'}
                                  strokeWidth={2}
                                  strokeDasharray={!node.data.children_root ? '2,2' : '0'}
                                  // strokeOpacity={!node.data.children ? 0.6 : 1}
                                  rx={!node.data.children_root ? 8 : 0}

                                  onClick={() => {
                                    window.rrr = node.data.name;

                                    this.chart = chart;

                                    this.forceUpdate();

                                    console.log(node);
                                  }}
                                />          
                              </a>
                            )}

                            <title> {node.data.name} </title>

                            {node.data.isExpanded || !node.data.children || (
                              <text
                                dy={
                                  // (textLength.length > 15) ? ('-5') : ('.33em')
                                  (textLength.length > 5) ? ('-5') : ('.33em')
                                }
                                x={
                                  // (textLength.length > 16) ? ('10') : ('0')
                                  (textLength.length < 5) ? ('0') : (textLength.length < 30) ? ('30') : ('-33')
                                }
                                // dominantBaseline={"hanging"}
                                fontSize={11}
                                fontFamily="Arial"
                                textAnchor={(textLength.length < 5) ? ('middle') : (textLength.length < 30) ? ('start') : ('end')}
                                style={{ pointerEvents: 'none' }}
                                fill={
                                  node.depth === 0 ? ('white') : node.children_root ? ('white') : ('white')
                                }
                              >
                                <tspan> {node.data.name}</tspan>
                              </text>

                            )}

                            {!node.data.children && !node.data.children_root}
                            {/*<img*/}
                            {/*src={logo}*/}
                            {/*className="logo"*/}
                            {/*alt="logo"*/}
                            {/*/>*/}

                          </Group>
                        );
                      })}
                    </Group>
                  )}
                </NodeGroup>
              </Group>
            )}
          </Tree>
        </Surface>
      </div>
    );
  }
}
