import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

import MapChart from "./MapChart";

function App() {
  return (
    <div>
      <h2>The Flatiron Network</h2>
      <div className="body-wrapper">
        <MapChart />
      </div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
