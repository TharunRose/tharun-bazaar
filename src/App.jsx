import React from 'react';
import './App.css'
import Login from './login/Login';
import List from './List';
import Board from './Board';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import TaskDashboard from './TaskDashboard';



const App = () => {
  return (
    <div  className='app-box'>
     
     
      
        <BrowserRouter>

          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/list' element={<List />} />
            {/* <Route path='/board' element={<Board />} /> */}
            <Route path='/task' element={<TaskDashboard />} />
          </Routes>



        </BrowserRouter>
      
    </div>
  );
};

export default App;
