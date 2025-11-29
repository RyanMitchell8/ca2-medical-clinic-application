import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Edit() {
    const [form, setForm] = useState({
        appointment_date: "",
        doctor_id: "",
        patient_id: ""
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

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

                const date = new Date(
                    Number(appointment.appointment_date)
                )
                    .toISOString()
                    .split("T")[0];

                setForm({
                    appointment_date: date,
                    doctor_id: appointment.doctor_id,
                    patient_id: appointment.patient_id,
                });

            } catch (err) {
                console.log(err);
            }
        };

        fetchAppointment();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const updateAppointment = async () => {

        const options = {
            method: "PATCH",
            url: `/appointment/${id}`,  
            headers: {
                Authorization: `Bearer ${token}`,
            },
            data: {
                appointment_date: form.appointment_date,
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

            <form onSubmit={handleSubmit}>

                <Input
                    type="date"
                    name="appointment_date"
                    value={form.appointment_date}
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
                    placeholder="Patient ID"
                    name="patient_id"
                    value={form.patient_id}
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
