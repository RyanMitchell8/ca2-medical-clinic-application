import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { token } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // If logged in, don't show forms
  if (token) {
    return <h1 className="text-xl font-bold">You are logged in ✅</h1>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full mt-10">

      <h1 className="text-2xl font-bold mb-6">
        {showRegister ? "Create an Account" : "Welcome Back"}
      </h1>

      <div className="w-full max-w-md p-6 border rounded-xl shadow-sm bg-white">

        {/* Swap forms */}
        {!showRegister ? (
          <LoginForm />
        ) : (
          <RegisterForm />
        )}

        {/* Toggle Button */}
        <div className="text-center mt-4">
          {!showRegister ? (
            <>
              <p className="text-sm mb-2">Don't have an account?</p>
              <Button
                variant="outline"
                onClick={() => setShowRegister(true)}
              >
                Register Here
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm mb-2">Already have an account?</p>
              <Button
                variant="outline"
                onClick={() => setShowRegister(false)}
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
