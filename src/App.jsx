import { useState, useEffect } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Navbar from '@/components/Navbar';
import Home from '@/pages/Home';

import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';
import DoctorsEdit from "@/pages/doctors/Edit";


export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("token");

    if (token) {
      setLoggedIn(true);
    }

  }, []);

  const onLogin = (auth, token) => {
    setLoggedIn(auth);

    if (auth) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token');
    }
  };

  return (
    <Router>
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        <AppSidebar variant="inset" loggedIn={loggedIn} onLogin={onLogin} />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-6">
                <Routes>

                  {/* Home */}
                  <Route
                    path="/"
                    element={<Home onLogin={onLogin} loggedIn={loggedIn} />}
                  />
                  {/* Doctors List */}
                  <Route path="/doctors" element={<DoctorsIndex />} />

                  {/* Doctors Create Page */}
                  <Route path="/doctors/create" element={<DoctorsCreate />} />

                  {/* Doctors Edit Page */}
                  <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />

                  {/* Doctors Show Page */}
                  <Route
                    path="/doctors/:id"
                    element={<DoctorsShow loggedIn={loggedIn} />}
                  />

                </Routes>

              </div>
            </div>
          </div>

        </SidebarInset>
      </SidebarProvider>
    </Router>
  );
}
