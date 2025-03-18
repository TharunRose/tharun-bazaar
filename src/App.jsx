import React from "react";
import "./App.css";
import Login from "./login/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "./home/Home";
import MyOrders from "./MyOrders";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="app-box">
      <BrowserRouter>
          <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
