//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp'
import Login from './Login'
import SideBar from './SideBar';
import ProfileEditor from './ProfileEditor';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProfileEditor />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/SignUp' element={<SignUp />}/>
        <Route path='/SideBar' element={<SideBar />}/>
        <Route path='/ProfileEditor' element={<ProfileEditor />}/>
      </Routes>
    </Router>
  );
}

export default App