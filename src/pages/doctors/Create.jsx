import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";

import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const SPECIALISATIONS = [
  "Podiatrist",
  "Dermatologist",
  "Pediatrician",
  "Psychiatrist",
  "General Practitioner"
];


const doctorSchema = z.object({
  first_name: z.string().min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .min(10, "Phone must be exactly 10 digits")
    .max(10, "Phone must be exactly 10 digits")
    .regex(/^\d{10}$/, "Phone must contain only digits"),
  specialisation: z.enum([
    "Podiatrist",
    "Dermatologist",
    "Pediatrician",
    "Psychiatrist",
    "General Practitioner",
  ]),
});

export default function Create() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const form = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      specialisation: "",
    },
    mode: "onChange",
  });


  const submitDoctor = async (data) => {
    try {
      const payload = {
        ...data,
        phone: data.phone?.trim(),
      };

      const response = await axios.post("/doctors", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/doctors", {
        state: {
          type: "success",
          message: `Doctor "${response.data.first_name} ${response.data.last_name}" created successfully`,
        },
      });
    } catch (err) {
      console.error(err);
      form.setError("root", {
        message:
          err?.response?.data?.message || "An unexpected error occurred",
      });
    }
  };


  return (
    <Card className="w-full max-w-md mt-4">
      <CardHeader>
        <CardTitle>Create a New Doctor</CardTitle>
      </CardHeader>

      <CardContent>
        <form id="create-doctor-form" onSubmit={form.handleSubmit(submitDoctor)}>
          <div className="flex flex-col gap-6">

            {/* First Name */}
            <Controller
              name="first_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>First Name</FieldLabel>
                  <Input {...field} placeholder="First Name" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Last Name */}
            <Controller
              name="last_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Last Name</FieldLabel>
                  <Input {...field} placeholder="Last Name" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Email */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} placeholder="Email" type="email" />
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Phone */}
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Phone</FieldLabel>
                  <Input {...field} placeholder="Phone" />
                  <FieldDescription>Optional. 7–15 digits.</FieldDescription>
                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Specialisation */}
            <Controller
              name="specialisation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Specialisation</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select Specialisation" />
                    </SelectTrigger>

                    <SelectContent>
                      {SPECIALISATIONS.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FieldDescription>
                    Choose the doctor’s primary field.
                  </FieldDescription>

                  <FieldError errors={[fieldState.error]} />
                </Field>
              )}
            />

            {/* Server Errors */}
            {form.formState.errors.root && (
              <p className="text-red-600 text-sm">
                {form.formState.errors.root.message}
              </p>
            )}
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => form.reset()}>
          Reset
        </Button>

        <Button
          variant="outline"
          type="submit"
          form="create-doctor-form"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </CardFooter>
    </Card>
  );
}
