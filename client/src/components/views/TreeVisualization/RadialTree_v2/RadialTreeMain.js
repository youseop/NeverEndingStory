import React from 'react';
import RadialTreeRander from './RadialTreeRander';
import './Styles.css';

import test2 from './result_data.json'
import Chart from './chart';

let obj = test2;

let getProperty = function (propertyName) {
  return obj[propertyName];
};

const data = {
  name: obj.personal.names["0"].value,
  children_root: [
    {
      name: 'Skills',
      children: obj.skills.extracted.map(skill => ({ name: skill.value }))
    },
    {
      name: 'Experience',
      children: obj.experience.jobs.map(job => ({ name: job.company.value, DateRange: job.date_range.value, Duration: job.date_range.duration }))
    },
    {
      name: 'Education',
      children: obj.education.institutions.map(edu => ({ name: edu.name.value, children: [{ name: edu.date_range.value }] }))
    },
  ]
};

function RadialTreeMain() {
  return (
    <RadialTreeRander data={data} data2={obj} chart={(<Chart />)} />
  )
}

export default RadialTreeMain