import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { token } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // If logged in
  if (token) {
    return (
      <div className="flex flex-col items-center pt-20">
        <h1 className="text-3xl font-bold mb-4">You are logged in 🎉</h1>
        <p className="text-muted-foreground">Use the sidebar to navigate.</p>

        {/* Link Cards */}
        <div className="w-full max-w-4xl mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="/doctors"
            className="block p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow duration-150"
          >
            <h2 className="text-lg font-semibold mb-1">🩺 Doctors</h2>
            <p className="text-sm text-muted-foreground">View and manage doctors.</p>
          </a>

          <a
            href="/appointments"
            className="block p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow duration-150"
          >
            <h2 className="text-lg font-semibold mb-1">📅 Appointments</h2>
            <p className="text-sm text-muted-foreground">See upcoming and past bookings.</p>
          </a>

          <a
            href="/patients"
            className="block p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow duration-150"
          >
            <h2 className="text-lg font-semibold mb-1">👥 Patients</h2>
            <p className="text-sm text-muted-foreground">Patient list and details.</p>
          </a>

          <a
            href="/prescriptions"
            className="block p-6 bg-white rounded-xl border hover:shadow-lg transition-shadow duration-150"
          >
            <h2 className="text-lg font-semibold mb-1">💊 Prescriptions</h2>
            <p className="text-sm text-muted-foreground">Create and review prescriptions.</p>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-14 px-4">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">
        {showRegister ? "Create an Account" : "Welcome Back"}
      </h1>

      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white border animate-fadeIn">

        {/* Swap Forms */}
        <div className="animate-fadeIn">
          {showRegister ? <RegisterForm /> : <LoginForm />}
        </div>

        {/* Toggle */}
        <div className="text-center mt-6">
          {!showRegister ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Don't have an account?
              </p>
              <Button
                variant="outline"
                onClick={() => setShowRegister(true)}
                className="w-full"
              >
                Register Here
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
                Login Instead
              </Button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}