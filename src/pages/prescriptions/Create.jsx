import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from '@/utils/formatDate';

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

import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";


const prescriptionsSchema = z.object({
    patient_id: z.string().min(1, "Patient ID is required"),
    doctor_id: z.string().min(1, "Doctor ID is required"),
    diagnosis_id: z.string().min(1, "Diagnosis ID is required"),
    medication: z.string().min(1, "Medication is required"),
    dosage: z.string().min(1, "Dosage is required"),
    start_date: z.date({
        required_error: "Start date is required",
    }),
    end_date: z.date({
        required_error: "End date is required",
    }),
});


export default function Create() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(prescriptionsSchema),
        mode: 'onChange',
        defaultValues: {
            patient_id: "",
            doctor_id: "",
            diagnosis_id: "",
            medication: "",
            dosage: "",
            start_date: undefined,
            end_date: undefined
        },
    });

    useEffect(() => {
        if (!token) return;

        const fetchData = async () => {
            try {
                const [docRes, patRes, diagnosisRes] = await Promise.all([
                    axios.get("/doctors", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/patients", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("/diagnoses", { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                setDoctors(docRes.data);
                setPatients(patRes.data);
                setDiagnoses(diagnosisRes.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [token]);

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    const createPrescription = async (data) => {
        const isoDate = formatForAPI(data.start_date);
        const isoEndDate = formatForAPI(data.end_date);

        const options = {
            method: "POST",
            url: "/prescriptions",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
                ...data,
                start_date: isoDate,
                end_date: isoEndDate,
                doctor_id: Number(data.doctor_id),
                patient_id: Number(data.patient_id),
                diagnosis_id: Number(data.diagnosis_id)
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate('/prescriptions', {
                state: {
                    type: 'success',
                    message: `Prescription "${response.data.id}" created successfully`
                }
            });
        } catch (err) {
            console.log(err);
        }

    };

    const onSubmit = (formData) => {
        console.log(formData);
        createPrescription(formData);
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Create Prescription</CardTitle>
            </CardHeader>

            <CardContent>
                <form id="create-prescription-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                <div>
                    <label className="block mb-1 text-sm font-medium">Diagnosis</label>
                    <Controller
                        name="diagnosis_id"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a diagnosis" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {diagnoses.map((diagnosis) => (
                                            <SelectItem
                                                key={diagnosis.id}
                                                value={diagnosis.id.toString()}
                                            >
                                                {diagnosis.condition}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.diagnosis_id && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.diagnosis_id.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Medication</label>
                    <Input
                        type="text"
                        placeholder="Medication"
                        {...register("medication")}
                    />
                    {errors.medication && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.medication.message}
                        </p>
                    )}

                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Dosage</label>
                    <Input
                        type="text"
                        placeholder="Dosage"
                        {...register("dosage")}
                    />
                    {errors.dosage && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors.dosage.message}
                        </p>
                    )}

                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Start Date</label>
                    <Controller
                        name="start_date"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? field.value.toLocaleDateString()
                                                : "Select start date"}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(selectedDate) => {
                                                field.onChange(selectedDate);
                                                setStartDateOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.start_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.start_date.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">End Date</label>
                    <Controller
                        name="end_date"
                        control={control}
                        render={({ field }) => (
                            <>
                                <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {field.value
                                                ? field.value.toLocaleDateString()
                                                : "Select start date"}
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-auto">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={(selectedDate) => {
                                                field.onChange(selectedDate);
                                                setEndDateOpen(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.end_date && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.end_date.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
                </form>
            </CardContent>

            <CardFooter>
                <Button type="submit" form="create-prescription-form">Create Prescription</Button>
            </CardFooter>
        </Card>
    );
}
