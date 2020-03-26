import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleQuantize } from "d3-scale";
import { csv } from "d3-fetch";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json";

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

const MapChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // https://www.bls.gov/lau/
    /*
    csv("/unemployment-by-county-2017.csv").then(counties => {
      setData(counties);
    });
    */

    csv("/patient-map-hack/patientids.txt").then(res => {
      console.log(res);
    });
  }, []);

  return (
    <>
      <ComposableMap projection="geoAlbersUsa">
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map(geo => {
              const cur = data.find(s => s.id === geo.id);
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={colorScale(cur ? cur.unemployment_rate : "#EEE")}
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
