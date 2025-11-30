import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from "@/config/api";
import { useNavigate } from 'react-router';
import { useAuth } from "@/hooks/useAuth";

export default function Create() {

    const [form, setForm] = useState({
        patient_id: "",
        condition: "",
        diagnosis_date: "",
    });

    const navigate = useNavigate();
    const { token } = useAuth();

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const createDiagnosis = async () => {

        const options = {
            method: "POST",
            url: "/diagnoses",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: {
            patient_id: Number(form.patient_id),
            condition: form.condition,
            diagnosis_date: form.diagnosis_date
            }
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

    const handleSubmit = (e) => {
        e.preventDefault();
        createDiagnosis();
    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Create Diagnosis</h1>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-md">

                <Input
                    name="patient_id"
                    type="number"
                    placeholder="Patient ID"
                    value={form.patient_id}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="condition"
                    type="text"
                    placeholder="Condition"
                    value={form.condition}
                    onChange={handleChange}
                    required
                />

                <Input
                    name="diagnosis_date"
                    type="date"
                    value={form.diagnosis_date}
                    onChange={handleChange}
                    required
                />

                <Button
                    type="submit"
                    variant="outline"
                    className="mt-4 cursor-pointer"                
                    >
                    Create Diagnosis  
                </Button>

            </form>
        </>
    );
}
