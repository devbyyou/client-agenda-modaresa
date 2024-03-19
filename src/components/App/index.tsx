import React from 'react';
import Agenda from '../Agenda';
import Liste from '../Liste';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div>
       <Routes>
        <Route path="/" element={<Agenda />} />
        <Route path="/liste" element={<Liste />} />
      </Routes>
    </div>
  );
}

export default App;
