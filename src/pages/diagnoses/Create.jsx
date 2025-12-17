import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";

import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ChevronDown, ArrowLeft } from "lucide-react";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

const diagnosisSchema = z.object({
    patient_id: z.string().min(1, "Patient ID is required"),
    condition: z.string().min(3, "Condition must be at least 3 characters"),
    diagnosis_date: z.date({ required_error: "Diagnosis date is required" }),
});

export default function Create() {
    const [dateOpen, setDateOpen] = useState(false);
    const [patients, setPatients] = useState([]);

    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const res = await axios.get("/patients", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPatients(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPatients();
    }, [token]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(diagnosisSchema),
        defaultValues: {
            patient_id: "",
            condition: "",
            diagnosis_date: undefined,
        },
    });

    const createDiagnosis = async (formData) => {
        const payload = {
            patient_id: Number(formData.patient_id),
            condition: formData.condition,
            diagnosis_date: formatForAPI(formData.diagnosis_date),
        };

        const options = {
            method: "POST",
            url: "/diagnoses",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: payload
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);

            navigate("/diagnoses", {
                state: {
                    type: "success",
                    message: `Diagnosis for patient ID ${response.data.patient_id} created successfully`
                }
            });

        } catch (err) {
            console.log(err);
        }
    };

    const onSubmit = (data) => {
        createDiagnosis(data);
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Create Diagnosis</CardTitle>
                        </div>
                    </CardHeader>

            <CardContent>
                <form id="create-diagnosis-form" onSubmit={handleSubmit(onSubmit)} className="space-y-3">

                
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
                                        {patients.map(p => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.first_name} {p.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.patient_id && (
                                    <p className="text-red-500 text-sm">{errors.patient_id.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>

                
                <Input
                    {...register("condition")}
                    name="condition"
                    type="text"
                    placeholder="Condition"
                    aria-invalid={errors.condition ? "true" : "false"}
                />
                {errors.condition && (
                    <p className="text-red-500 text-sm">{errors.condition.message}</p>
                )}

                
                <div>
                    <label className="block mb-1 text-sm font-medium">Diagnosis Date</label>

                    <Controller
                        control={control}
                        name="diagnosis_date"
                        render={({ field }) => (
                            <>
                                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                                    <PopoverTrigger asChild>
                                        <Button type="button" variant="outline" className="w-full justify-between">
                                            {field.value ? field.value.toLocaleDateString() : "Select date"}
                                            <ChevronDown className="h-4 w-4" />
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
                                    <p className="text-red-500 text-sm mt-1">{errors.diagnosis_date.message}</p>
                                )}
                            </>
                        )}
                    />
                </div>

                </form>
            </CardContent>

            <CardFooter>
                <Button type="submit" variant="outline" form="create-diagnosis-form">Create Diagnosis</Button>
            </CardFooter>
        </Card>
    );
}