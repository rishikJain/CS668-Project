import './App.css';
import React, { useState } from 'react';
import Risk from './components/riskform';
import './styles.css';
import Vulnerability from './components/Vulnerablities';
import RiskScore from './components/riskscore';
import {Routes, Route} from 'react-router-dom';
import Context from './components/context';
import Threat from './components/threats';

function App() {

  const [value,setValue] = useState(null)
  const [valueForRisk,setValueForRisk] = useState(null)
  const [valueForThreat,setValueForThreat] = useState(null)

  return (
    <Context.Provider  value={{ value, setValue, 
                               valueForRisk, setValueForRisk,
                               valueForThreat,setValueForThreat }}>
       <div className="App">
      <Routes>
          <Route path="/" element={<Risk />} />
          <Route exact path="/Vulnerablities" element={<Vulnerability />} />
          <Route exact path="/threats" element={<Threat />} />
          <Route exact path="/riskscore" element={<RiskScore />} />
      </Routes>
    </div>
    </Context.Provider>

  );
}

export default App;
