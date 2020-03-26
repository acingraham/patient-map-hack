import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "/zip3.topo.json";

const colorScale = scaleQuantize()
  .domain([1, 10])
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
    setData(dataArray);
  };

  let hour = 0;
  const genData = m => {
    if (!m[hour]) {
      return;
    }
    m[hour].forEach(item => {
      dataMap[item.id] = (dataMap[item.id] || 0) + 1;
    });

    const dataArray = [];
    for (const id in dataMap) {
      dataArray.push({
        id,
        visited: dataMap[id],
      });
    }
    setData(dataArray);
    hour++;
  };

  const convertDatetimeToHour = item => {
    console.log('item', item);
    const roundedDownDatetime = item.visitdatetime.split('-');
    roundedDownDatetime.pop();
    roundedDownDatetime.pop();
    // item.visitDatetime = roundedDownDatetime.join('-');
    item.visitDatetime = roundedDownDatetime.pop().split(' ').pop();
  };

  useEffect(() => {
    //generateData();
    csv("/patientids.txt").then(res => {
      console.log(res);
      let m = {};
      res.forEach(row => {
        convertDatetimeToHour(row);
        m[row.visitDatetime] = m[row.visitDatetime] || [];
        m[row.visitDatetime].push(row);
        // m[row.zipCode] = (m[row.zipCode] || 0) + 1
      });
      console.log(m);
      //setInterval(() => genData(m), 3000);
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
