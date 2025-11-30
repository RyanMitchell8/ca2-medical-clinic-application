import { AuthProvider } from './hooks/useAuth';

import { BrowserRouter as Router, Routes, Route } from "react-router";

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';

import Home from '@/pages/Home';

// Doctors Pages //
import DoctorsIndex from '@/pages/doctors/Index';
import DoctorsShow from '@/pages/doctors/Show';
import DoctorsCreate from '@/pages/doctors/Create';
import DoctorsEdit from "@/pages/doctors/Edit";

// Patients Pages //
import PatientsIndex from "@/pages/patients/Index";
import PatientsShow from "@/pages/patients/Show";
import PatientsCreate from "@/pages/patients/Create";
import PatientsEdit from "@/pages/patients/Edit";

// Appointments Pages //
import AppointmentsIndex from "@/pages/appoinments/Index";
import AppointmentsShow from "@/pages/appoinments/Show";
import AppointmentsCreate from "@/pages/appoinments/Create";
import AppointmentsEdit from "@/pages/appoinments/Edit";

// Diagnoses Pages //
import DiagnosesIndex from "@/pages/diagnoses/Index";
import DiagnosesShow from "@/pages/diagnoses/Show";
import DiagnosesCreate from "@/pages/diagnoses/Create";
import DiagnosesEdit from "@/pages/diagnoses/Edit";

export default function App() {

  return (
    <Router>
      <AuthProvider>
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }}
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />

            <div className="flex flex-1 flex-col">
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-6">

                  <Routes>

                    {/* Home */}
                    <Route path="/" element={<Home />} />

                    {/* Doctors Routes */}
                    <Route path="/doctors" element={<DoctorsIndex />} />
                    <Route path="/doctors/create" element={<DoctorsCreate />} />
                    <Route path="/doctors/:id/edit" element={<DoctorsEdit />} />
                    <Route path="/doctors/:id" element={<DoctorsShow />} />

                    {/* Patients Routes */}
                    <Route path="/patients" element={<PatientsIndex />} />
                    <Route path="/patients/create" element={<PatientsCreate />} />
                    <Route path="/patients/:id/edit" element={<PatientsEdit />} />
                    <Route path="/patients/:id" element={<PatientsShow />} />

                    {/* Appointments Routes */}
                    <Route path="/appointments" element={<AppointmentsIndex />} />
                    <Route path="/appointments/:id" element={<AppointmentsShow />} />
                    <Route path="/appointments/create" element={<AppointmentsCreate />} />
                    <Route path="/appointments/:id/edit" element={<AppointmentsEdit />} />

                    {/* Diagnoses Routes */}
                    <Route path="/diagnoses" element={<DiagnosesIndex />} />
                    <Route path="/diagnoses/:id" element={<DiagnosesShow />} />
                    <Route path="/diagnoses/create" element={<DiagnosesCreate />} />
                    <Route path="/diagnoses/:id/edit" element={<DiagnosesEdit />} />

                  </Routes>

                </div>
              </div>
            </div>

          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </Router>
  );
}
