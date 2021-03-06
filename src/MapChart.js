import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize, scaleQuantile, scaleLinear, scaleLog, scaleThreshold } from "d3-scale";
import { csv } from "d3-fetch";
import Stats from "./Stats";
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
  .base(1.2)
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

const MapChart = () => {
  const [data, setData] = useState([]);

  const generateData = () => {
    for (let i = 0; i < 500; i++) {
      const item = getRandomItem();
      dataMap[item.id] = item.visited + (dataMap[item.id] || 0);
    }

    const dataArray = [];
    for (const id in dataMap) {
      dataArray.push({
        id,
        visited: dataMap[id],
      });
    }
    console.log('generateData', dataArray);
    // setData(dataArray);
  };

  let hour = 7;
  const genData = m => {
    console.log('hour', hour);
    if (!m[hour]) {
      hour++;
      return;
    }
    m[hour].forEach(item => {
      dataMap[item.zipCode] = (dataMap[item.zipCode] || 0) + 1;
    });

    const dataArray = [];
    for (const id in dataMap) {
      dataArray.push({
        id,
        visited: dataMap[id],
      });
    }
    console.log('genData', dataArray);
    setData(dataArray);
    hour++;
  };

  const convertDatetimeToHour = item => {
    const time = item.visitDatetime.split(' ').pop();
    const hour = time.split(':')[0];
    item.visitDatetime = hour;

    /*
    const roundedDownDatetime = item.visitDatetime.split('-');
    roundedDownDatetime.pop();
    roundedDownDatetime.pop();
    // item.visitDatetime = roundedDownDatetime.join('-');
    item.visitDatetime = roundedDownDatetime.pop().split(' ').pop();
    */
  };

  useEffect(() => {
    // generateData();
    csv("/patient-map-hack/patientids_converted.txt").then(res => {
      console.log(res);
      let m = {};
      res.forEach(row => {
        convertDatetimeToHour(row);
        m[row.visitDatetime] = m[row.visitDatetime] || [];
        m[row.visitDatetime].push(row);
        // m[row.zipCode] = (m[row.zipCode] || 0) + 1
      });
      console.log('m', m);

      // hour = 10;
      // genData(m);
      setInterval(() => genData(m), 1000);
    });
  }, []);

  return (
    <>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(s => s.id === geo.properties.ZIP);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.visited : 0)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

    </>
  );
};

export default MapChart;
