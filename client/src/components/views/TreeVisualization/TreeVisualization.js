import React, { useState } from 'react';
import Tree from 'react-d3-tree';
import './TreeVisualization.css';

const orgChart = {
  name: 'CEO',
  children: [
    {
      name: 'Manager',
      children: [
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker1',
              children: [
                {
                  name: 'Worker1',
                  children: [
                    {
                      name: 'Worker1',
                    },
                    {
                      name: 'Worker2',
                      children: [
                        {
                          name: 'Worker1',
                        },
                        {
                          name: 'Worker2',
                          children: [
                            {
                              name: 'Worker1',
                              children: [
                                {
                                  name: 'Worker1',
                                  children: [
                                    {
                                      name: 'Worker1',
                                      children: [
                                        {
                                          name: 'Worker1',
                                        },
                                        {
                                          name: 'Worker2',
                                        },
                                        {
                                          name: 'Worker',
                                        },
                                      ],
                                    },
                                    {
                                      name: 'Worker2',
                                    },
                                    {
                                      name: 'Worker',
                                    },
                                  ],
                                },
                                {
                                  name: 'Worker2',
                                  children: [
                                    {
                                      name: 'Worker1',
                                    },
                                    {
                                      name: 'Worker2',
                                    },
                                    {
                                      name: 'Worker',
                                    },
                                  ],
                                },
                                {
                                  name: 'Worker',
                                },
                              ],
                            },
                            {
                              name: 'Worker2',
                            },
                            {
                              name: 'Worker',
                            },
                          ],
                        },
                        {
                          name: 'Worker',
                          children: [
                            {
                              name: 'Worker1',
                            },
                            {
                              name: 'Worker2',
                            },
                            {
                              name: 'Worker',
                            },
                          ],
                        },
                      ],
                    },
                    {
                      name: 'Worker',
                      children: [
                        {
                          name: 'Worker1',
                        },
                        {
                          name: 'Worker2',
                        },
                        {
                          name: 'Worker',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'Worker2',
                  children: [
                    {
                      name: 'Worker1',
                    },
                    {
                      name: 'Worker2',
                    },
                    {
                      name: 'Worker',
                    },
                  ],
                },
                {
                  name: 'Worker',
                },
              ],
            },
            {
              name: 'Worker2',
            },
            {
              name: 'Worker',
            },
          ],
        },
        {
          name: 'Foreman',
          children: [
            {
              name: 'Worker',
            },
          ],
        },
      ],
    },
  ],
};

function TreeVisualization() {
  return (
    // `<Tree />` will fill width/height of its container; in this case `#treeWrapper`.
    <div id="treeWrapper" className="treevisualization">
      <Tree 
        data={orgChart}
        orientation="vertical"
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf" />
    </div>
  );
}

export default TreeVisualization
