import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import Home from './Pages/Home/Home';
import CreateService from './Pages/Home/CreateService/CreateService';
import EditService from './Pages/Home/EditService/EditService';
import EditUser from './Pages/User/EditUser/EditUser';
import User from './Pages/User/User';
import Category from './Pages/Category/Category';
import EditCategory from './Pages/Category/EditCategory/EditCategory';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path= "/" element= {<App/>}/>
      <Route path = "/home" element= {<Home/>}/>
      {/*Services*/}
      <Route path="/create-service" element={<CreateService />} />
      <Route path = "/edit-service/:serviceId" element = {<EditService/>}/>
      {/*Users*/}
      <Route path = "/users" element = {<User/>}/>
      <Route path = "/edit-user/:clientId" element = {<EditUser/>}/>
      {/*Category*/}
      <Route path="/category" element={<Category/>} />
      <Route path="/edit-category/:categoryId" element={<EditCategory/>} />
    </Routes>
  </BrowserRouter>
);