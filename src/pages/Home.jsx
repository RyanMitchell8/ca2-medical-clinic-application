import { useState } from "react";
import { Link } from "react-router";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

import {
  Stethoscope,
  CalendarDays,
  Users,
  ClipboardList,
  Pill,
} from "lucide-react";

export default function Home() {
  const { token } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  if (token) {
    return (
      <div className="container mx-auto pt-20 px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Choose a section to manage your clinic
          </p>
        </div>

        {/* Dashboard cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            to="/doctors"
            title="Doctors"
            description="View and manage doctors"
            icon={<Stethoscope className="h-6 w-6" />}
          />

          <DashboardCard
            to="/appointments"
            title="Appointments"
            description="Schedule and view appointments"
            icon={<CalendarDays className="h-6 w-6" />}
          />

          <DashboardCard
            to="/patients"
            title="Patients"
            description="View patient records"
            icon={<Users className="h-6 w-6" />}
          />

          <DashboardCard
            to="/diagnoses"
            title="Diagnoses"
            description="Manage diagnoses"
            icon={<ClipboardList className="h-6 w-6" />}
          />

          <DashboardCard
            to="/prescriptions"
            title="Prescriptions"
            description="Create and review prescriptions"
            icon={<Pill className="h-6 w-6" />}
          />
        </div>
      </div>
    );
  }

 
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">
          {showRegister ? "Create Your Clinic Account" : "Welcome to Clinic Manager"}
        </h1>

        <Card className="p-6">
          {showRegister ? <RegisterForm /> : <LoginForm />}

          <div className="text-center mt-6">
            {!showRegister ? (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Don’t have an account?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowRegister(true)}
                  className="w-full"
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-2">
                  Already have an account?
                </p>
                <Button
                  variant="outline"
                  onClick={() => setShowRegister(false)}
                  className="w-full"
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function DashboardCard({ to, title, description, icon }) {
  return (
    <Link to={to}>
      <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
            {icon}
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
}
