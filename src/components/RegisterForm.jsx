import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const registerSchema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_password: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
  });

export default function Register() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
    mode: "onChange",
  });

  const submitForm = async (values) => {
    const { confirm_password, ...payload } = values;
    try {
      await authRegister(payload);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-muted p-2">
            <UserPlus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>Enter your details to register</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form id="register-form" onSubmit={form.handleSubmit(submitForm)} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            name="first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <Label>First Name</Label>
                <Input {...field} />
                {fieldState.error && <p className="text-red-600">{fieldState.error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <Label>Last Name</Label>
                <Input {...field} />
                {fieldState.error && <p className="text-red-600">{fieldState.error.message}</p>}
              </div>
            )}
          />

          <div className="md:col-span-2">
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <Label>Email</Label>
                  <Input type="email" {...field} />
                  {fieldState.error && <p className="text-red-600">{fieldState.error.message}</p>}
                </div>
              )}
            />
          </div>

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <Label>Password</Label>
                <Input type="password" {...field} />
                {fieldState.error && <p className="text-red-600">{fieldState.error.message}</p>}
              </div>
            )}
          />

          <Controller
            name="confirm_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" {...field} />
                {fieldState.error && <p className="text-red-600">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </form>
      </CardContent>

      <CardFooter>
        <Button className="w-full" form="register-form" type="submit">Register</Button>
      </CardFooter>
    </Card>
  );
}

