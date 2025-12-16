import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import axios from "@/config/api";
import { useNavigate, useParams } from "react-router";
import { useAuth } from "@/hooks/useAuth";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";

const SPECIALISATIONS = [
    "Podiatrist",
    "Dermatologist",
    "Pediatrician",
    "Psychiatrist",
    "General Practitioner",
];

export default function Edit() {
    const [form, setForm] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        specialisation: "",
    });

    const [errors, setErrors] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    const { token } = useAuth();


    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`/doctors/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const doc = response.data;

                setForm({
                    first_name: doc.first_name,
                    last_name: doc.last_name,
                    email: doc.email,
                    phone: doc.phone,
                    specialisation: doc.specialisation,
                });
            } catch (err) {
                console.error("Error loading doctor:", err);
            }
        };

        fetchDoctor();
    }, [id, token]);


    const validate = () => {
        const v = {};

        if (!form.first_name.trim()) v.first_name = "First name is required";
        if (!form.last_name.trim()) v.last_name = "Last name is required";

        if (!form.email.trim()) v.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
            v.email = "Enter a valid email address";

        if (!form.phone.trim()) v.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(form.phone))
            v.phone = "Phone must be exactly 10 digits";

        if (!form.specialisation) v.specialisation = "Specialisation is required";

        setErrors(v);
        return Object.keys(v).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            const cleaned = value.replace(/\D/g, "").slice(0, 10);
            setForm((prev) => ({ ...prev, phone: cleaned }));
            setErrors((prev) => ({ ...prev, phone: undefined }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };

    const updateDoctor = async () => {
        const payload = {
            first_name: form.first_name.trim(),
            last_name: form.last_name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            specialisation: form.specialisation.trim(),
        };

        try {
            await axios.patch(`/doctors/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            navigate("/doctors");
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        updateDoctor();
    };

    return (
        <Card className="w-full max-w-md mt-4">
            <CardHeader>
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <CardTitle>Update Doctor</CardTitle>
                        </div>
                    </CardHeader>

            <CardContent>
                <form id="edit-doctor-form" onSubmit={handleSubmit} className="space-y-3">
                {/* First Name */}
                <Input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={handleChange}
                />
                {errors.first_name && (
                    <p className="text-red-500 text-sm">{errors.first_name}</p>
                )}

                {/* Last Name */}
                <Input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    className="mt-2"
                    value={form.last_name}
                    onChange={handleChange}
                />
                {errors.last_name && (
                    <p className="text-red-500 text-sm">{errors.last_name}</p>
                )}

                {/* Email */}
                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="mt-2"
                    value={form.email}
                    onChange={handleChange}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                {/* Phone */}
                <Input
                    type="text"
                    name="phone"
                    placeholder="Phone (10 digits)"
                    className="mt-2"
                    value={form.phone}
                    onChange={handleChange}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                {/* Specialisation */}
                <div className="mt-2">
                    <label className="block text-sm font-medium">Specialisation</label>

                    <Select
                        value={form.specialisation}
                        onValueChange={(v) => {
                            setForm((prev) => ({ ...prev, specialisation: v }));
                            setErrors((prev) => ({ ...prev, specialisation: undefined }));
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select specialisation" />
                        </SelectTrigger>

                        <SelectContent>
                            {SPECIALISATIONS.map((spec) => (
                                <SelectItem key={spec} value={spec}>
                                    {spec}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {errors.specialisation && (
                        <p className="text-red-500 text-sm">{errors.specialisation}</p>
                    )}
                </div>

                </form>
            </CardContent>

            <CardFooter>
                <Button variant="outline" className="cursor-pointer" type="submit" form="edit-doctor-form">
                    Submit
                </Button>
            </CardFooter>
        </Card>
    );
}
