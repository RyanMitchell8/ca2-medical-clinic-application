import { useAuth } from "@/hooks/useAuth";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Link } from "react-router";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const { onLogin } = useAuth();

  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100, "Password must be at most 100 characters."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const submitForm = async (data) => {
    console.log(data);
    const response = await onLogin(data.email, data.password);
    if (response && response.msg) toast.error(response.msg);
    console.log(response);
  };

  return (
    <Card className="w-full max-w-md">
      <Toaster />
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={form.handleSubmit(submitForm)}>
          <div className="flex flex-col gap-4">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="form-email">Email</Label>
                  <Input
                    id="form-email"
                    {...field}
                    placeholder="you@clinic.com"
                    autoComplete="email"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <p className="text-sm text-red-600 mt-1">{fieldState.error?.message}</p>
                  )}
                </div>
              )}
            />

            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Label htmlFor="form-password">Password</Label>
                  <Input
                    id="form-password"
                    type="password"
                    {...field}
                    autoComplete="current-password"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <p className="text-sm text-red-600 mt-1">{fieldState.error?.message}</p>
                  )}
                </div>
              )}
            />

            <div className="text-right">
              <Link to="/forgot" className="text-sm text-muted-foreground underline">Forgot password?</Link>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex-col gap-2">
        <Button form="login-form" type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
}
