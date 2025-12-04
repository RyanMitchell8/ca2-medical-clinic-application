import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";
import { formatForAPI } from '@/utils/formatDate';



export default function Create() {
    const [form, setForm] = useState({
        patient_id: "",
        doctor_id: "",
        diagnosis_id: "",
        medication: "",
        dosage: "",
        start_date: "",
        end_date: ""
    });

    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const createPrescription = async () => {
        
        const isoDate = formatForAPI(form.start_date);
        const isoEndDate = formatForAPI(form.end_date);


        const options = {
            method: "POST",
            url: "/prescriptions",
            headers: {
                Authorization: `Bearer ${token}`
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
            navigate('/prescriptions', { state: { 
                type: 'success',
                message: `Prescription "${response.data.id}" created successfully` 
            }});
        } catch (err) {
            console.log(err);
        }

    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form);
        createPrescription();
    };

    return (
        <>
            <h1>Create a new Prescription</h1>
            <form onSubmit={handleSubmit}>

                <Input
                    type="number"
                    placeholder="Patient ID"
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="number"
                    placeholder="Doctor ID"
                    name="doctor_id"
                    value={form.doctor_id}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="number"
                    placeholder="Diagnosis ID"
                    name="diagnosis_id"
                    value={form.diagnosis_id}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="text"
                    placeholder="Medication"
                    name="medication"
                    value={form.medication}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="text"
                    placeholder="Dosage"
                    name="dosage"
                    value={form.dosage}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="date" 
                    placeholder="Start Date"
                    name="start_date"
                    value={form.start_date}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="date" 
                    placeholder="End Date"
                    name="end_date"
                    value={form.end_date}
                    onChange={handleChange}
                />

                <Button
                    className="mt-4 cursor-pointer"
                    variant="outline"
                    type="submit"
                >
                    Submit
                </Button>
            </form>
        </>
    );
}
