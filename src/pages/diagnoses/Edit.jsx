import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate } from "react-router";
import { useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
    const [form, setForm] = useState({
        patient_id: "",
        condition: "",
        diagnosis_date: "",
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    useEffect(() => {
        const fetchDiagnosis = async () => {
            const options = {
                method: "GET",
                url: `/diagnoses/${id}`,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                let response = await axios.request(options);
                let diagnosis = response.data;

                const formattedDate = new Date(Number(diagnosis.diagnosis_date))
                    .toISOString()
                    .split("T")[0];

                setForm({
                    patient_id: diagnosis.patient_id,
                    condition: diagnosis.condition,
                    diagnosis_date: formattedDate,
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchDiagnosis();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const updateDiagnosis = async () => {

        const options = {
            method: "PATCH",
            url: `/diagnoses/${id}`,
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                patient_id: Number(form.patient_id),
                condition: form.condition,
                diagnosis_date: form.diagnosis_date, // <-- MUST stay string (yyyy-mm-dd)
            },
        };

        try {
            let response = await axios.request(options);
            console.log(response.data);
            navigate("/diagnoses");
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateDiagnosis();
    };

    return (
        <>
            <h1>Update Diagnosis</h1>

            <form onSubmit={handleSubmit}>

                <Input
                    type="text"
                    placeholder="Patient ID"
                    name="patient_id"
                    value={form.patient_id}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="text"
                    placeholder="Condition"
                    name="condition"
                    value={form.condition}
                    onChange={handleChange}
                />

                <Input
                    className="mt-2"
                    type="date"
                    placeholder="Diagnosis Date"
                    name="diagnosis_date"
                    value={form.diagnosis_date}
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
