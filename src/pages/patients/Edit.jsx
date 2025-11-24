import { useState, useEffect } from "react";
import axios from "@/config/api";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
            try {
                const { data } = await axios.get(`/patients/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setForm(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchPatient();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:
                e.target.name === "date_of_birth"
                    ? Number(e.target.value)
                    : e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`/patients/${id}`, form, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/patients");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <h1 className="text-xl font-bold mb-4">Edit Patient</h1>

            <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
                <Input name="first_name" value={form.first_name} onChange={handleChange} />
                <Input name="last_name" value={form.last_name} onChange={handleChange} />
                <Input name="email" value={form.email} onChange={handleChange} />
                <Input name="phone" value={form.phone} onChange={handleChange} />
                <Input name="date_of_birth" value={form.date_of_birth} onChange={handleChange} />
                <Input name="address" value={form.address} onChange={handleChange} />

                <Button type="submit" variant="outline">
                    Update Patient
                </Button>
            </form>
        </>
    );
}
