import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from "@/utils/formatDate";

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
        appointment_date: null,
        doctor_id: "",
        patient_id: ""
    });

    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [dateOpen, setDateOpen] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchLists = async () => {
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

        fetchLists();
    }, []);

    useEffect(() => {
        const fetchAppointment = async () => {
            const options = {
                method: "GET",
                url: `/appointments/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                let appointment = response.data;

                const date = appointment.appointment_date ? new Date(appointment.appointment_date) : null;

                setForm({
                    appointment_date: date,
                    doctor_id: String(appointment.doctor_id),
                    patient_id: String(appointment.patient_id),
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointment();
    }, [id, token]);

    const updateAppointment = async () => {
        const options = {
            method: "PATCH",
            url: `/appointments/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                appointment_date: formatForAPI(form.appointment_date),
                doctor_id: Number(form.doctor_id),
                patient_id: Number(form.patient_id),
            },
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/appointments");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateAppointment();
    };

    return (
        <>
            <h1>Update Appointment</h1>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                {/* Calendar */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Appointment Date</label>
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                            <Button type="button" variant="outline" className="w-full justify-between">
                                {form.appointment_date ? form.appointment_date.toLocaleDateString() : "Select date"}
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto">
                            <Calendar
                                mode="single"
                                selected={form.appointment_date}
                                onSelect={(d) => {
                                    setForm(prev => ({ ...prev, appointment_date: d }));
                                    setDateOpen(false);
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Doctor select */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Doctor</label>
                    <Select value={form.doctor_id} onValueChange={(v) => setForm(prev => ({ ...prev, doctor_id: v }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                        <SelectContent>
                            {doctors.map(d => (
                                <SelectItem key={d.id} value={String(d.id)}>{d.first_name} {d.last_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Patient select */}
                <div>
                    <label className="block mb-1 text-sm font-medium">Patient</label>
                    <Select value={form.patient_id} onValueChange={(v) => setForm(prev => ({ ...prev, patient_id: v }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a patient" />
                        </SelectTrigger>
                        <SelectContent>
                            {patients.map(p => (
                                <SelectItem key={p.id} value={String(p.id)}>{p.first_name} {p.last_name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Button className="mt-4 cursor-pointer" variant="outline" type="submit">Submit</Button>
            </form>
        </>
    );
}