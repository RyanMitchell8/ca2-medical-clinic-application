import { useState, useEffect} from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router";
import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';

import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const onLogin = (auth, token) => {
    setLoggedIn(auth);

    if (auth) {
      localStorage.setItem('token', token)
    }
    else {
      localStorage.removeItem('token');
    }
  };

  return (
    <>
      <Router>
        <Navbar onLogin={onLogin} loggedIn={loggedIn} />
        <Routes>
          <Route path='/' element={<Home onLogin={onLogin} loggedIn={loggedIn} />} />

          <Route path="/doctors" element={<DoctorsIndex />} />
          <Route path="/doctors/:id" element={<DoctorsShow loggedIn={loggedIn} />} />

        </Routes>
      </Router>
    </>
  )
}
