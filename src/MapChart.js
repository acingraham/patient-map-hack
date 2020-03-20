import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";

const geoUrl = "./zip3.topo.json";

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

  useEffect(() => {
    // https://www.bls.gov/lau/
    /*
    csv("/unemployment-by-county-2017.csv").then(counties => {
      setData(counties);
    });
    */

    generateData();
    setInterval(generateData, 3000);

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
