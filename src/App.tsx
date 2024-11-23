//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp'
import Login from './Login'
import Galleries from './components__galleries/galleries';
import SideBar from './SideBar';
import ProfileEditor from './ProfileEditor';
import LandingPage from './landingpage/landingpage';
import MainPage from './mainpage/mainpage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<ProfileEditor />}/>
        <Route path='/Landingpage' element={<LandingPage />}/>
        <Route path='/mainpage' element={<MainPage />}/>
        <Route path='/Login' element={<Login />}/>
        <Route path='/SignUp' element={<SignUp />}/>
        <Route path='/galleries' element={<Galleries />}/>
        <Route path='/SideBar' element={<SideBar />}/>
        <Route path='/ProfileEditor' element={<ProfileEditor />}/>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
