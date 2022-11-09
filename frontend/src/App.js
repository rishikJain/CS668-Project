import './App.css';
import React, { useState } from 'react';
import Risk from './components/riskform';
import './styles.css';
import Vulnerability from './components/Vulnerablities';
import RiskScore from './components/riskscore';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Context from './components/context';

function App() {

  const [value,setValue] = useState(null)
  const [valueForRisk,setValueForRisk] = useState(null)

  return (
    <Context.Provider  value={{ value, setValue, valueForRisk, setValueForRisk }}>
       <div className="App">
      <Routes>
          <Route path="/" element={<Risk />} />
          <Route exact path="/Vulnerablities" element={<Vulnerability />} />
          <Route exact path="/riskscore" element={<RiskScore />} />
      </Routes>
    </div>
    </Context.Provider>

  );
}

export default App;
