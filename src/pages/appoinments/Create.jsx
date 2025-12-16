import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown, ArrowLeft } from "lucide-react";

// Zod schema – validation rules
const appointmentSchema = z.object({
    appointment_date: z.date({
        required_error: "Appointment date is required",
    }),
    doctor_id: z.string().min(1, "Doctor is required"),
    patient_id: z.string().min(1, "Patient is required"),
});

export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [dateOpen, setDateOpen] = useState(false);

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            appointment_date: undefined,
            doctor_id: "",
            patient_id: "",
        },
    });

    // Fetch doctors & patients for dropdowns
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [docRes, patRes] = await Promise.all([
                    axios.get("/doctors"),
                    axios.get("/patients"),
                ]);

                setDoctors(docRes.data);
                setPatients(patRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, []);

    const createAppointment = async (data) => {
        const isoDate = formatForAPI(data.appointment_date);

        const options = {
            method: "POST",
            url: "/appointments",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                appointment_date: isoDate,
                doctor_id: Number(data.doctor_id),
                patient_id: Number(data.patient_id),
            },
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);

            navigate("/appointments", {
                state: {
                    type: "success",
                    message: "Appointment created successfully",
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = (formData) => {
        console.log(formData);
        createAppointment(formData);
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Create a new Appointment</CardTitle>
                        </div>
                    </CardHeader>

            <CardContent>
                <form id="create-appointment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Appointment Date with calendar popup */}
                <div>
                    <label className="block mb-1 text-sm font-medium">
                        Appointment Date
                    </label>

                    <Controller
                        name="appointment_date"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? field.value.toLocaleDateString()
                                                : "Select date"}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(selectedDate) => {
                                                field.onChange(selectedDate);
                                                setDateOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.appointment_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.appointment_date.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Doctor dropdown */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Doctor</label>

                    <Controller
                        name="doctor_id"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a doctor" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {doctors.map((doctor) => (
                                            <SelectItem
                                                key={doctor.id}
                                                value={doctor.id.toString()}
                                            >
                                                {doctor.first_name} {doctor.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.doctor_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.doctor_id.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                {/* Patient dropdown */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Patient</label>

                    <Controller
                        name="patient_id"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a patient" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {patients.map((patient) => (
                                            <SelectItem
                                                key={patient.id}
                                                value={patient.id.toString()}
                                            >
                                                {patient.first_name} {patient.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patient_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.patient_id.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>

                </form>
            </CardContent>

            <CardFooter>
                <Button className="cursor-pointer" variant="outline" type="submit" form="create-appointment-form">Submit</Button>
            </CardFooter>
        </Card>
    );
}
