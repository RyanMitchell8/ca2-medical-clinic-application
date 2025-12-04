import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatForInput, formatForAPI } from "@/utils/formatDate";

export default function Edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();

    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        date_of_birth: "",
        address: "",
    });

    

    useEffect(() => {
        const fetchPatient = async () => {
            const options = {
                method: "GET",
                url: `/patients/${id}`,
                headers: { Authorization: `Bearer ${token}` },
            };

            try {
                let response = await axios.request(options);
                let patient = response.data;

                setForm({
                    first_name: patient.first_name,
                    last_name: patient.last_name,
                    email: patient.email,
                    phone: patient.phone,
                    date_of_birth: formatForInput(patient.date_of_birth),
                    address: patient.address,
                });

            } catch (err) {
                console.error(err);
            }
        };

        fetchPatient();
    }, [id, token]);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const apiDate = formatForAPI(form.date_of_birth );
        const payload = { ...form, date_of_birth: apiDate };

        const options = {
            method: "PATCH",
            url: `/patients/${id}`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
                ...form,
                ...payload,
            },
        };

        try {
            await axios.request(options);
            navigate("/patients");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Edit Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                <Input
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                />

                <Input
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                />

                <Input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                />

                <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                />

                <Input
                    type="date"
                    name="date_of_birth"
                    value={form.date_of_birth}
                    onChange={handleChange}
                />

                <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                />

                <Button type="submit" variant="outline">
                    Update Patient
                </Button>
            </form>
        </>
    );
}
