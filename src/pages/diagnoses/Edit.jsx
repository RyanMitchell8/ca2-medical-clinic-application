import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import axios from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { ChevronDown } from "lucide-react";

const diagnosisSchema = z.object({
  patient_id: z.string().min(1, "Patient is required"),
  condition: z.string().min(3, "Condition must be at least 3 characters"),
  diagnosis_date: z.date({ required_error: "Diagnosis date is required" }),
});

export default function Edit() {
  const [patients, setPatients] = useState([]);
  const [dateOpen, setDateOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(diagnosisSchema),
    defaultValues: {
      patient_id: "",
      condition: "",
      diagnosis_date: undefined,
    },
  });

 
  useEffect(() => {
    if (!token) return;

    const fetchPatients = async () => {
      try {
        const res = await axios.get("/patients", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setPatients([]);
      }
    };

    fetchPatients();
  }, [token]);


  useEffect(() => {
    if (!token || !id) return;

    const fetchDiagnosis = async () => {
      setLoading(true);

      try {
        const res = await axios.get(`/diagnoses/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const diag = res.data;
        const dateObj = diag.diagnosis_date
          ? new Date(diag.diagnosis_date)
          : undefined;

        reset({
          patient_id: String(diag.patient_id ?? ""),
          condition: diag.condition ?? "",
          diagnosis_date: dateObj,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosis();
  }, [id, token, reset]);


  const onSubmit = async (data) => {
    const payload = {
      patient_id: Number(data.patient_id),
      condition: data.condition,
      diagnosis_date: formatForAPI(data.diagnosis_date),
    };

    try {
      await axios.patch(`/diagnoses/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/diagnoses");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;


  return (
    <>
      <h1 className="text-xl font-bold mb-4">Update Diagnosis</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        {/* Patient Select */}
        <div>
          <label className="block mb-1 text-sm font-medium">Patient</label>
          <Controller
            control={control}
            name="patient_id"
            render={({ field }) => (
              <>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>

                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.first_name} {p.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {errors.patient_id && (
                  <p className="text-red-500 text-sm">
                    {errors.patient_id.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Condition */}
        <div>
          <Input
            {...register("condition")}
            type="text"
            placeholder="Condition"
          />
          {errors.condition && (
            <p className="text-red-500 text-sm">{errors.condition.message}</p>
          )}
        </div>

        {/* Diagnosis Date */}
        <div>
          <label className="block mb-1 text-sm font-medium">
            Diagnosis Date
          </label>

          <Controller
            control={control}
            name="diagnosis_date"
            render={({ field }) => (
              <>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {field.value
                        ? field.value.toLocaleDateString()
                        : "Select date"}
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent className="p-0 w-auto">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDateOpen(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>

                {errors.diagnosis_date && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.diagnosis_date.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* Submit */}
        <Button variant="outline" type="submit" disabled={isSubmitting}>
          Submit
        </Button>
      </form>
    </>
  );
}
