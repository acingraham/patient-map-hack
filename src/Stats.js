import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize, scaleQuantile, scaleLinear, scaleLog, scaleThreshold } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "/patient-map-hack/zip3.topo.json";
/*
const colorScale = scaleThreshold()
  .domain([
    0,
    1,
    2,
    3,
    4,
    10,
    20,
    40,
    80,
    160,
    100 
  ])
  .range([
    "#ffffff",
    "#ffffff",
    "#eeeefb",
    "#dcdcf8",
    "#cbcbf4",
    "#b9b9f1",
    "#a8a8ed",
    "#9697e9",
    "#8585e6",
    "#7374e2",
    "#6262df",
    "#5051db"
  ]);
*/

const colorScale = scaleLog()
  .domain([1, 2])
  .base(2)
  .range([
    "#ffffff",
    "#eeeefb",
    "#dcdcf8",
    "#cbcbf4",
    "#b9b9f1",
    "#a8a8ed",
    "#9697e9",
    "#8585e6",
    "#7374e2",
    "#6262df",
    "#5051db"
  ]);

const getRandomItem = () => {
  return {
    id: `${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
    visited: Math.floor(Math.random() * 5),
  };
};

const dataMap = {}

for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    for (let k = 0; k < 10; k++) {
      dataMap[`${i}${j}${k}`] = 0;
    }
  }
}

const Stats = () => {
  // const [data, setData] = useState([]);

  return (
    <div>
      <h3>12,340</h3>
      <h4>Patients Treated</h4>
      <h3>11:00 AM EST</h3>
      <h4>Time</h4>
    </div>
  );
};

export default Stats;
