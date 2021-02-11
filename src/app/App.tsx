import React from 'react';
import { Router } from "react-router-dom";
import {history} from "../utilities";
import './App.css';
import {SwitchBetweenRoutes} from "../navigation";

function App() {
  return (
    <div className="App">
        <Router history={history}>
            <SwitchBetweenRoutes />
        </Router>
    </div>
  );
}

export default App;
