import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home/Home';
import EditService from './Pages/Home/EditService/EditService';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path= "/" element= {<App/>}/>
      <Route path = "/home" element= {<Home/>}/>
      <Route path = "/edit-service/:serviceId" element = {<EditService/>}/>
    </Routes>
  </BrowserRouter>
);