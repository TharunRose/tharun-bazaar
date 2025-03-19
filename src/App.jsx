import React from "react";
import "./App.css";
import Login from "./login/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./home/Home";
import MyOrders from "./MyOrders";
import Navbar from "./components/Navbar";

import Dashboard from "./adminPanel/Dashboard";

const App = () => {
  return (
    <div className="app-box">
      <BrowserRouter>
          <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/myorders" element={<MyOrders />} />
        
          <Route path="/dashboard" element={<Dashboard />} />
          

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
