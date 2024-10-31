import "./App.css";
import React from "react";
import { AnimatedBackground } from "animated-backgrounds";
import TabelaItems from "./components/TabelaItems";

function App() {
  return (
    <div className="App">
      <AnimatedBackground animationName="gradientWave" />
      <TabelaItems />
    </div>
  );
}

export default App;
