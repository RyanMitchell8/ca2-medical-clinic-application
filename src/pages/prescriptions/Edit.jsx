import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI, formatForInput } from '@/utils/formatDate';

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


export default function Edit() {
    const [form, setForm] = useState({
        patient_id: "",
        doctor_id: "",
        diagnosis_id: "",
        medication: "",
        dosage: "",
        start_date: null,
        end_date: null
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [diagnoses, setDiagnoses] = useState([]);

    const [startDateOpen, setStartDateOpen] = useState(false);
    const [endDateOpen, setEndDateOpen] = useState(false);

    useEffect(() => {
        const fetchLists = async () => {
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

        fetchLists();
    }, []);

    useEffect(() => {
        const fetchPrescription = async () => {
            const options = {
                method: "GET",
                url: `/prescriptions/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                console.log(response.data);
                let prescription = response.data;

                const startDate = prescription.start_date
                    ? new Date(prescription.start_date)
                    : null;

                const endDate = prescription.end_date
                    ? new Date(prescription.end_date)
                    : null;


                setForm({
                    patient_id: String(prescription.patient_id),
                    doctor_id: String(prescription.doctor_id),
                    diagnosis_id: String(prescription.diagnosis_id),
                    medication: prescription.medication,
                    dosage: prescription.dosage,
                    start_date: startDate,
                    end_date: endDate,
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchPrescription();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const updatePrescription = async () => {

        const isoDate = formatForAPI(form.start_date);
        const isoEndDate = formatForAPI(form.end_date);

        const options = {
            method: "PATCH",
            url: `/prescriptions/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                ...form,
                start_date: isoDate,
                end_date: isoEndDate,
                doctor_id: Number(form.doctor_id),
                patient_id: Number(form.patient_id),
                diagnosis_id: Number(form.diagnosis_id)
            }
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/prescriptions");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        updatePrescription();
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                <CardTitle>Update Prescription</CardTitle>
            </CardHeader>

            <CardContent>
                <form id="edit-prescription-form" onSubmit={handleSubmit} className="space-y-4">
                <Select
                    value={String(form.patient_id)}
                    onValueChange={(value) => setForm({ ...form, patient_id: value })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Patient" />
                    </SelectTrigger>
                    <SelectContent>
                        {patients.map((patient) => (
                            <SelectItem key={patient.id} value={String(patient.id)}>
                                {patient.first_name} {patient.last_name}
                            </SelectItem>
                        ))}

                    </SelectContent>
                </Select>
                <Select
                    value={String(form.doctor_id)}
                    onValueChange={(value) => setForm({ ...form, doctor_id: value })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Doctor" />
                    </SelectTrigger>
                    <SelectContent>
                        {doctors.map((doctor) => (
                            <SelectItem key={doctor.id} value={String(doctor.id)}>
                                {doctor.first_name} {doctor.last_name}
                            </SelectItem>
                        ))}

                    </SelectContent>
                </Select>
                <Select
                    value={String(form.diagnosis_id)}
                    onValueChange={(value) => setForm({ ...form, diagnosis_id: value })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Diagnosis" />
                    </SelectTrigger>
                    <SelectContent>
                        {diagnoses.map((diagnosis) => (
                            <SelectItem key={diagnosis.id} value={String(diagnosis.id)}>
                                {diagnosis.condition}
                            </SelectItem>
                        ))}

                    </SelectContent>
                </Select>
                <Input
                    type="text"
                    name="medication"
                    value={form.medication}
                    onChange={handleChange}
                    placeholder="Medication"
                    className="w-full"
                />
                <Input
                    type="text"
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                    placeholder="Dosage"
                    className="w-full"
                />
                <div>
                    <label className="block mb-1 text-sm font-medium">Start Date</label>
                    <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">
                                {form.start_date ? form.start_date.toLocaleDateString() : "Select date"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Calendar
                                mode="single"
                                selected={form.start_date}
                                onSelect={(d) => {
                                    setForm(prev => ({ ...prev, start_date: d }));
                                    setStartDateOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">End Date</label>
                    <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">
                                {form.end_date ? form.end_date.toLocaleDateString() : "Select date"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Calendar
                                mode="single"
                                selected={form.end_date}
                                onSelect={(d) => {
                                    setForm(prev => ({ ...prev, end_date: d }));
                                    setEndDateOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                </form>
            </CardContent>

            <CardFooter>
                <Button className="cursor-pointer" variant="outline" type="submit" form="edit-prescription-form">Submit</Button>
            </CardFooter>
        </Card>
    );
}