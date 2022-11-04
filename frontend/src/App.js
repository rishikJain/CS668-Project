import './App.css';
import React from 'react';
import Risk from './components/riskform';
import './styles.css';
import Vulnerability from './components/Vulnerablities';
import {Routes, Route, useNavigate} from 'react-router-dom';

function App() {

  return (
    <div className="App">
      <Routes>
          <Route path="/" element={<Risk />} />
          <Route exact path="/Vulnerablities" element={<Vulnerability />} />
      </Routes>
    </div>
  );
}

export default App;
