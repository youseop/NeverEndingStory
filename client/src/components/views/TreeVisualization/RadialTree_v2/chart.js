
import React, { PureComponent } from 'react';
import { arc, pie } from 'd3-shape';
import { easeExpOut } from 'd3-ease';
import sortBy from 'lodash/sortBy';


import NodeGroup from 'react-move/NodeGroup';

import test2 from './result_data.json'

const view = [310, 500]; // [width, height]
const trbl = [10, 10, 10, 10]; // [top, right, bottom, left] margins

const dims = [ // Adjusted dimensions [width, height]
  view[0] - trbl[1] - trbl[3],
  view[1] - trbl[0] - trbl[2],
];

let arrayTest = test2.experience.jobs;

const mockData = test2.experience.jobs.map(job => ({ name: job.date_range.value, Duration: job.date_range.duration }));


const radius = (dims[1] / 2) * 0.30;

const pieLayout = pie()
  .value((d) => d.value)
  .sort(null);

const innerArcPath = arc()
  .innerRadius(radius * 0.4)
  .outerRadius(radius * 1.1);

const outerArcPath = arc()
  .innerRadius(radius * 1.2)
  .outerRadius(radius * 1.2);

function mid(d) {
  return Math.PI > (d.startAngle + (d.endAngle - d.startAngle));
}

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function getArcs() {
  const data = mockData.map(({ name }) => ({ name, value: getRandom(50, 100) }));

  return pieLayout(sortBy(data, (d) => d.name));
}

class Example extends PureComponent {
  state = {
    arcs: getArcs(),
  };

  update = (e) => {
    e.preventDefault();
    e.stopPropagation();

    this.setState(() => ({
      arcs: getArcs(),
    }));
  };

  render() {
    const { arcs } = this.state;
    console.log(window.rrr);

    return (
      <div>
        
          <g transform={`translate(${dims[0] / 2}, ${dims[1] / 2})`}>
            <NodeGroup
              data={arcs}
              keyAccessor={(d) => d.data.name}

              start={({ startAngle }) => ({
                startAngle,
                endAngle: startAngle,
              })}

              enter={({ endAngle }) => ({
                endAngle: [endAngle],
                timing: { duration: 500, delay: 350, ease: easeExpOut },
              })}

              update={({ startAngle, endAngle }) => ({
                startAngle: [startAngle],
                endAngle: [endAngle],
                timing: { duration: 350, ease: easeExpOut },
              })}
            >
              {(nodes) => {
                return (
                  <g>
                    {nodes.map(({ key, data, state }) => {
                      const p1 = outerArcPath.centroid(state);
                      const p2 = [
                        mid(state) ? p1[0] + (radius * 0.5) : p1[0] - (radius * 0.5),
                        p1[1],
                      ];
                      return (
                        <g key={key}>
                          <path
                            d={innerArcPath(state)}
                            // fill={colors(data.data.name)}
                            opacity={0.9}
                          />
                          <text
                            dy="4px"
                            fontSize="12px"
                            transform={`translate(${p2.toString()})`}
                            textAnchor={mid(state) ? 'start' : 'end'}
                            fill={'white'}
                          >{data.data.name}</text>

                          <polyline
                            fill="none"
                            stroke="rgba(127,127,127,0.5)"
                            points={`${innerArcPath.centroid(state)},${p1},${p2.toString()}`}
                          />

                        </g>
                      );

                    })}
                  </g>
                );
              }}
            </NodeGroup>
          </g>
        
      </div>
    );
  }
}

export default Example;